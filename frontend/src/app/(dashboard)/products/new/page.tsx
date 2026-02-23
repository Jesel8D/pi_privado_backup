'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Loader2, Save, ShoppingBag, DollarSign, Image as ImageIcon, Calendar, Info } from 'lucide-react';
import Link from 'next/link';
import { productsService } from '@/services/products.service';
import { toast } from 'sonner';

// Definimos el esquema con tipos más explícitos para el resolver
const productSchema = z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    description: z.string().optional().or(z.literal('')),
    unitCost: z.preprocess((val) => Number(val), z.number().min(0, 'El costo no puede ser negativo')),
    salePrice: z.preprocess((val) => Number(val), z.number().min(0, 'El precio no puede ser negativo')),
    isPerishable: z.boolean().default(false),
    shelfLifeDays: z.preprocess((val) => (val === '' || val === null || val === undefined) ? undefined : Number(val), z.number().min(0).optional()),
    imageUrl: z.string().optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            unitCost: 0,
            salePrice: 0,
            isPerishable: false,
            shelfLifeDays: undefined,
            imageUrl: '',
        },
    });

    const isPerishable = form.watch('isPerishable');

    const onSubmit = async (data: ProductFormValues) => {
        setIsSubmitting(true);
        try {
            const newProduct = await productsService.create({
                name: data.name,
                description: data.description || undefined,
                unitCost: Number(data.unitCost),
                salePrice: Number(data.salePrice),
                isPerishable: data.isPerishable,
                shelfLifeDays: data.shelfLifeDays || undefined,
                imageUrl: data.imageUrl || undefined,
            });
            toast.success('¡PRODUCTO CREADO!', {
                description: 'Ahora vamos a registrar cuánto stock tienes disponible.',
            });
            router.push(`/products/${newProduct.id}/stock`);
        } catch (error) {
            toast.error('Error al crear el producto');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 md:p-10 max-w-5xl space-y-12 font-display bg-neo-white min-h-screen selection:bg-neo-red selection:text-white pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-black pb-8">
                <div className="space-y-4">
                    <button onClick={() => router.back()} className="group flex items-center gap-2 font-black uppercase text-xs tracking-widest hover:text-neo-red transition-colors">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> ATRÁS
                    </button>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                        NUEVO <span className="text-neo-red">PRODUCTO</span>
                    </h1>
                </div>
                <div className="bg-neo-yellow border-4 border-black p-4 rotate-3 hidden lg:block">
                    <p className="font-black uppercase text-xs">Modo Creación</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

                    {/* Sección: Básico */}
                    <div className="bg-white border-4 border-black p-8 shadow-neo-lg space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <ShoppingBag size={120} />
                        </div>

                        <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                            <div className="w-8 h-8 bg-neo-yellow border-2 border-black flex items-center justify-center -rotate-6">
                                <ShoppingBag size={16} />
                            </div>
                            Esenciales
                        </h2>

                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2 group">
                                <label className="text-xs font-black uppercase text-black tracking-widest pl-1">
                                    Nombre del Producto
                                </label>
                                <input
                                    placeholder="EJ. GALLETAS DE AVENA ARTESANALES"
                                    {...form.register('name')}
                                    className={`w-full h-14 px-4 border-4 border-black font-black uppercase outline-none focus:bg-neo-yellow/5 ${form.formState.errors.name ? 'bg-red-50' : 'bg-white'}`}
                                />
                                {form.formState.errors.name && (
                                    <p className="text-[10px] font-black text-neo-red uppercase italic">{form.formState.errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-black tracking-widest pl-1">
                                    Descripción (Opcional)
                                </label>
                                <textarea
                                    placeholder="CUÉNTALES POR QUÉ TU PRODUCTO ES EL MEJOR DEL CAMPUS..."
                                    rows={3}
                                    {...form.register('description')}
                                    className="w-full p-4 border-4 border-black font-black uppercase outline-none focus:bg-neo-yellow/5 bg-white resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección: Precios */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-neo-green/10 border-4 border-black p-8 shadow-neo group">
                            <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 bg-neo-green border-2 border-black flex items-center justify-center group-hover:rotate-12 transition-transform">
                                    <DollarSign size={16} />
                                </div>
                                Costo Unitario
                            </h2>
                            <div className="space-y-4">
                                <div className="text-4xl font-black flex items-center gap-2">
                                    $ <input
                                        type="number"
                                        step="0.01"
                                        {...form.register('unitCost')}
                                        className="bg-transparent border-b-4 border-black w-full outline-none focus:text-neo-green transition-colors"
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">¿Cuánto te cuesta producirlo/comprarlo?</p>
                            </div>
                        </div>

                        <div className="bg-neo-yellow border-4 border-black p-8 shadow-neo group">
                            <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 bg-black text-white border-2 border-black flex items-center justify-center group-hover:-rotate-12 transition-transform">
                                    <DollarSign size={16} />
                                </div>
                                Precio Venta
                            </h2>
                            <div className="space-y-4">
                                <div className="text-4xl font-black flex items-center gap-2">
                                    $ <input
                                        type="number"
                                        step="0.01"
                                        {...form.register('salePrice')}
                                        className="bg-transparent border-b-4 border-black w-full outline-none focus:text-neo-red transition-colors"
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-black uppercase tracking-wider">¿A cuánto lo vendes al público?</p>
                            </div>
                        </div>
                    </div>

                    {/* Sección: Detalles Extra */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="bg-white border-4 border-black p-8 shadow-neo space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-blue-400 border-2 border-black flex items-center justify-center">
                                    <ImageIcon size={16} />
                                </div>
                                Visuales
                            </h2>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-black pl-1">URL de la Imagen (FOTO)</label>
                                <input
                                    placeholder="HTTPS://..."
                                    {...form.register('imageUrl')}
                                    className="w-full h-12 px-4 border-4 border-black font-black outline-none focus:bg-slate-50"
                                />
                                {form.formState.errors.imageUrl && (
                                    <p className="text-[10px] font-black text-neo-red uppercase italic">{form.formState.errors.imageUrl.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white border-4 border-black p-8 shadow-neo space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-neo-red border-2 border-black flex items-center justify-center text-white">
                                    <Calendar size={16} />
                                </div>
                                Caducidad
                            </h2>
                            <div className="flex items-center gap-4 p-3 border-2 border-black bg-slate-50">
                                <input
                                    type="checkbox"
                                    id="is-perishable"
                                    {...form.register('isPerishable')}
                                    className="w-6 h-6 accent-neo-red border-2 border-black"
                                />
                                <label htmlFor="is-perishable" className="text-xs font-black uppercase tracking-widest cursor-pointer">Es un producto perecedero</label>
                            </div>

                            {isPerishable && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                    <label className="text-xs font-black uppercase text-black pl-1">Días de Vida Útil (TENTATIVO)</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            {...form.register('shelfLifeDays')}
                                            className="w-24 h-12 px-4 border-4 border-black font-black outline-none focus:bg-neo-red/5"
                                        />
                                        <span className="font-bold uppercase text-[10px] text-slate-400">días desde producción</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botón Guardar */}
                    <div className="flex justify-end pt-10">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-black text-white px-12 py-5 border-2 border-black font-black uppercase text-xl shadow-[8px_8px_0_0_#FFC72C] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-4 disabled:opacity-50 active:scale-95"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <Save size={24} className="text-neo-yellow" />
                            )}
                            LANZAR PRODUCTO
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
