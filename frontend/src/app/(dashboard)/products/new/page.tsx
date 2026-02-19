'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Assuming simple textarea if not component
import { Checkbox } from '@/components/ui/checkbox'; // Assuming simple checkbox
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { productsService } from '@/services/products.service';
import { toast } from 'sonner';

// Schema Validation
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

export default function NewProductPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(productSchema),
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

    const onSubmit = async (data: ProductFormValues) => {
        setIsSubmitting(true);
        try {
            await productsService.create({
                ...data,
                shelfLifeDays: data.shelfLifeDays || undefined,
                imageUrl: data.imageUrl || undefined,
            });
            toast.success('Producto creado exitosamente');
            router.push('/products');
        } catch (error) {
            toast.error('Error al crear el producto');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 space-y-8 animate-fade-in">
            <div className="flex items-center space-x-4">
                <Link href="/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Nuevo Producto</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información del Producto</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Nombre del Producto
                            </label>
                            <Input
                                placeholder="Ej. Galletas Chokis"
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
                                {form.formState.errors.unitCost && (
                                    <p className="text-sm text-destructive">{form.formState.errors.unitCost.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Precio de Venta ($)</label>
                                <Input type="number" step="0.01" {...form.register('salePrice')} />
                                {form.formState.errors.salePrice && (
                                    <p className="text-sm text-destructive">{form.formState.errors.salePrice.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Descripción (Opcional)</label>
                            <Textarea
                                placeholder="Descripción del producto..."
                                className="resize-none"
                                {...form.register('description')}
                            />
                        </div>

                        <div className="flex items-center space-x-2 border p-4 rounded-lg bg-muted/20">
                            <Checkbox
                                id="isPerishable"
                                onCheckedChange={(checked) => form.setValue('isPerishable', checked as boolean)}
                                checked={form.watch('isPerishable')}
                            />
                            <label
                                htmlFor="isPerishable"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                ¿Es un producto perecedero?
                            </label>
                        </div>

                        {form.watch('isPerishable') && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-sm font-medium leading-none">Días de vida útil</label>
                                <Input type="number" {...form.register('shelfLifeDays')} />
                            </div>
                        )}

                        {/* Image URL Input */}
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
                                        Guardar Producto
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
