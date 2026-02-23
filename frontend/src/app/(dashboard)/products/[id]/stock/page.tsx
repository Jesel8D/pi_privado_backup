'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Loader2, Save, History } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { productsService, Product } from '@/services/products.service';
import { inventoryService, InventoryRecord } from '@/services/inventory.service';
import { toast } from 'sonner';

const stockSchema = z.object({
    quantity: z.coerce.number().min(1, 'La cantidad debe ser al menos 1'),
    unitCost: z.coerce.number().min(0, 'El costo no puede ser negativo'),
    recordDate: z.string().optional(),
});

type StockFormValues = z.infer<typeof stockSchema>;

export default function StockManagementPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [history, setHistory] = useState<InventoryRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<StockFormValues>({
        resolver: zodResolver(stockSchema) as any,
        defaultValues: {
            quantity: 0,
            unitCost: 0,
            recordDate: new Date().toISOString().split('T')[0],
        },
    });

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [productData, historyData] = await Promise.all([
                productsService.getById(params.id),
                inventoryService.getHistory(params.id),
            ]);
            setProduct(productData);
            setHistory(historyData);
            // Set default unit cost from product current cost
            form.setValue('unitCost', Number(productData.unitCost));
        } catch (error) {
            toast.error('Error al cargar datos');
            router.push('/products');
        } finally {
            setIsLoading(false);
        }
    }, [params.id, form, router]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onSubmit = async (data: StockFormValues) => {
        setIsSubmitting(true);
        try {
            await inventoryService.addStock({
                productId: params.id,
                quantity: data.quantity,
                unitCost: data.unitCost,
                recordDate: data.recordDate,
            });
            toast.success('Stock agregado exitosamente');
            form.reset({
                quantity: 0,
                unitCost: Number(product?.unitCost || 0),
                recordDate: new Date().toISOString().split('T')[0],
            });
            loadData(); // Reload history
        } catch (error) {
            toast.error('Error al agregar stock');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !product) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-8 space-y-8 animate-fade-in">
            <div className="flex items-center space-x-4">
                <Link href="/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Stock</h1>
                    <p className="text-muted-foreground">{product.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Formulario de Entrada */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Agregar Entrada</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Cantidad (Unidades)</label>
                                <Input type="number" {...form.register('quantity')} />
                                {form.formState.errors.quantity && (
                                    <p className="text-sm text-destructive">{form.formState.errors.quantity.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Costo Unitario ($)</label>
                                <Input type="number" step="0.01" {...form.register('unitCost')} />
                                <p className="text-xs text-muted-foreground">Costo de adquisición para este lote.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Fecha de Ingreso</label>
                                <Input type="date" {...form.register('recordDate')} />
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Registrar Entrada
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Historial */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <History className="mr-2 h-5 w-5" />
                            Historial de Lotes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {history.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                No hay registros de stock aún.
                            </div>
                        ) : (
                            <div className="rounded-md border border-border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Inicial</TableHead>
                                            <TableHead>Restante</TableHead>
                                            <TableHead>Costo</TableHead>
                                            <TableHead>Estado</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {history.map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell>{new Date(record.recordDate).toLocaleDateString()}</TableCell>
                                                <TableCell>{record.quantityInitial}</TableCell>
                                                <TableCell className="font-bold">{record.quantityRemaining}</TableCell>
                                                <TableCell>${Number(record.investmentAmount / record.quantityInitial).toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                     ${record.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                                  `}>
                                                        {record.status === 'active' ? 'Activo' : record.status}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
