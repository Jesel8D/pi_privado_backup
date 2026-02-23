'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { productsService } from '@/services/products.service';
import { toast } from 'sonner';

// Reuse Schema (Should ideally be shared)
const productSchema = z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    description: z.string().optional(),
    unitCost: z.coerce.number().min(0, 'El costo no puede ser negativo'),
    salePrice: z.coerce.number().min(0, 'El precio no puede ser negativo'),
    isPerishable: z.boolean().default(false),
    shelfLifeDays: z.coerce.number().optional(),
    imageUrl: z.string().optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function EditProductPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: '',
            description: undefined,
            unitCost: 0,
            salePrice: 0,
            isPerishable: false,
            shelfLifeDays: undefined,
            imageUrl: undefined,
        },
    });

    const loadProduct = useCallback(async () => {
        try {
            setIsLoading(true);
            const product = await productsService.getById(params.id);
            form.reset({
                name: product.name,
                description: product.description || undefined,
                unitCost: Number(product.unitCost),
                salePrice: Number(product.salePrice),
                isPerishable: product.isPerishable,
                shelfLifeDays: product.shelfLifeDays ? Number(product.shelfLifeDays) : undefined,
                imageUrl: product.imageUrl || undefined, // Use undefined directly
            });
        } catch (error) {
            toast.error('Error al cargar el producto');
            router.push('/products');
        } finally {
            setIsLoading(false);
        }
    }, [params.id, form, router]);

    useEffect(() => {
        loadProduct();
    }, [loadProduct]);

    const onSubmit = async (data: ProductFormValues) => {
        setIsSubmitting(true);
        try {
            await productsService.update(params.id, {
                ...data,
                shelfLifeDays: data.shelfLifeDays || undefined,
                imageUrl: data.imageUrl || undefined,
            });
            toast.success('Producto actualizado exitosamente');
            router.push('/products');
        } catch (error) {
            toast.error('Error al actualizar el producto');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-8 space-y-8 animate-fade-in">
            <div className="flex items-center space-x-4">
                <Link href="/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Editar Producto</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información del Producto</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Nombre del Producto</label>
                            <Input
                                {...form.register('name')}
                                className={form.formState.errors.name ? "border-destructive" : ""}
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Costo Unitario ($)</label>
                                <Input type="number" step="0.01" {...form.register('unitCost')} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Precio de Venta ($)</label>
                                <Input type="number" step="0.01" {...form.register('salePrice')} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Descripción</label>
                            <div className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <textarea
                                    className="w-full h-full bg-transparent outline-none resize-none"
                                    {...form.register('description')}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 border p-4 rounded-lg bg-muted/20">
                            <input
                                type="checkbox"
                                id="edit-isPerishable"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                {...form.register('isPerishable')}
                            />
                            <label
                                htmlFor="edit-isPerishable"
                                className="text-sm font-medium leading-none"
                            >
                                ¿Es un producto perecedero?
                            </label>
                        </div>

                        {form.watch('isPerishable') && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Días de vida útil</label>
                                <Input type="number" {...form.register('shelfLifeDays')} />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">URL de la Imagen (Opcional)</label>
                            <Input
                                placeholder="https://ejemplo.com/mi-producto.jpg"
                                {...form.register('imageUrl')}
                                className={form.formState.errors.imageUrl ? "border-destructive" : ""}
                            />
                            <p className="text-xs text-muted-foreground">
                                Pega aquí el enlace directo a la imagen de tu producto.
                            </p>
                            {form.formState.errors.imageUrl && (
                                <p className="text-sm text-destructive">{form.formState.errors.imageUrl.message}</p>
                            )}
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Guardar Cambios
                                    </>
                                )}
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
