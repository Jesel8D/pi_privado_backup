'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    DollarSign,
    TrendingUp,
    ShoppingBag,
    AlertTriangle,
    Loader2,
    Plus,
    Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { productsService, Product } from '@/services/products.service';
import { salesService, DailySale, PrepareSaleItem } from '@/services/sales.service';
import { toast } from 'sonner';

export default function SalesPage() {
    const [dailySale, setDailySale] = useState<DailySale | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for Preparation Mode
    const [prepareItems, setPrepareItems] = useState<Record<string, number>>({});

    // State for Tracking Mode
    const [trackingUpdates, setTrackingUpdates] = useState<Record<string, { sold: number, lost: number }>>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [saleData, productsData] = await Promise.all([
                salesService.getToday(),
                productsService.getAll()
            ]);
            setDailySale(saleData);
            setProducts(productsData);
        } catch (error) {
            toast.error('Error al cargar datos de ventas');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Logic for PREPARATION Mode ---
    const handlePrepareChange = (productId: string, val: string) => {
        const qty = parseInt(val) || 0;
        setPrepareItems(prev => ({ ...prev, [productId]: qty }));
    };

    const submitPreparation = async () => {
        const itemsToSubmit: PrepareSaleItem[] = Object.entries(prepareItems)
            .filter(([_, qty]) => qty > 0)
            .map(([productId, quantityPrepared]) => ({ productId, quantityPrepared }));

        if (itemsToSubmit.length === 0) {
            toast.error('Debes agregar al menos un producto para iniciar el día');
            return;
        }

        setIsSubmitting(true);
        try {
            const newSale = await salesService.prepareDay(itemsToSubmit);
            setDailySale(newSale);
            toast.success('¡Día iniciado exitosamente!');
        } catch (error) {
            toast.error('Error al iniciar el día');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Logic for TRACKING Mode ---
    const handleTrackChange = async (productId: string, field: 'sold' | 'lost', val: string) => {
        const detail = dailySale?.details.find(d => d.productId === productId);
        if (!detail) return;

        const numVal = parseInt(val);
        if (isNaN(numVal) || numVal < 0) return;

        // Optimistic UI update could be complex, let's just trigger API on blur or enter? 
        // For better UX, let's use a local state and a "Save" button per row or global?
        // Let's autosave on blur for "Sheet" like experience

        try {
            const currentSold = field === 'sold' ? numVal : detail.quantitySold;
            const currentLost = field === 'lost' ? numVal : detail.quantityLost;

            // Validate locally
            if ((currentSold + currentLost) > detail.quantityPrepared) {
                toast.error('No puedes vender/perder más de lo preparado');
                return;
            }

            const updatedSale = await salesService.trackProduct(productId, currentSold, currentLost);
            setDailySale(updatedSale);
        } catch (error) {
            toast.error('Error al actualizar venta');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // --- RENDER: PREPARATION VIEW ---
    if (!dailySale) {
        return (
            <div className="max-w-4xl mx-auto p-8 space-y-8 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Iniciar Día de Ventas</h1>
                    <p className="text-muted-foreground">Selecciona los productos que llevarás hoy para vender.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Inventario para Hoy</CardTitle>
                        <CardDescription>Ingresa la cantidad inicial de cada producto.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Precio Venta</TableHead>
                                        <TableHead className="w-[150px]">Cantidad a Llevar</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map(product => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>${Number(product.salePrice).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    className="w-24 bg-white dark:bg-zinc-900"
                                                    onChange={(e) => handlePrepareChange(product.id, e.target.value)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button onClick={submitPreparation} disabled={isSubmitting} size="lg">
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Iniciar Ventas del Día
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // --- RENDER: TRACKING VIEW ---
    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Registro de Ventas</h1>
                    <p className="text-muted-foreground">{new Date(dailySale.saleDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex gap-2">
                    {/* Posible botón para "Cerrar Día" en el futuro */}
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Venta Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">${Number(dailySale.totalRevenue).toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ganancia Neta</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {/* Note: backend entity provides a getter for totalProfit but validation might fail if not selected properly, assuming service returns handled object */}
                        <div className="text-2xl font-bold text-primary">
                            ${(Number(dailySale.totalRevenue) - Number(dailySale.totalInvestment)).toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">Inversión: ${Number(dailySale.totalInvestment).toFixed(2)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unidades Vendidas</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dailySale.unitsSold}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mermas</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{dailySale.unitsLost}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tracking Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Control de Productos</CardTitle>
                    <CardDescription>Registra las ventas y mermas en tiempo real.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead className="text-center">Inicial</TableHead>
                                    <TableHead className="text-center w-[120px]">Vendidos</TableHead>
                                    <TableHead className="text-center w-[120px]">Mermas</TableHead>
                                    <TableHead className="text-center">Restante</TableHead>
                                    <TableHead className="text-right">Subtotal Venta</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dailySale.details.map(detail => {
                                    const remaining = detail.quantityPrepared - detail.quantitySold - detail.quantityLost;
                                    const subtotal = detail.quantitySold * detail.unitPrice;

                                    return (
                                        <TableRow key={detail.id}>
                                            <TableCell className="font-medium">
                                                {detail.product.name}
                                                <div className="text-xs text-muted-foreground">${Number(detail.unitPrice).toFixed(2)} c/u</div>
                                            </TableCell>
                                            <TableCell className="text-center font-bold text-muted-foreground">
                                                {detail.quantityPrepared}
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={detail.quantitySold} // Controlled by backend response for now, simpler
                                                    className="text-center bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 focus-visible:ring-green-500"
                                                    onChange={(e) => handleTrackChange(detail.productId, 'sold', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={detail.quantityLost}
                                                    className="text-center bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 focus-visible:ring-red-500"
                                                    onChange={(e) => handleTrackChange(detail.productId, 'lost', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className={`font-bold ${remaining < 0 ? 'text-destructive' : 'text-foreground'}`}>
                                                    {remaining}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-green-600">
                                                ${subtotal.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
