'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productsService, Product } from '@/services/products.service';
import { ArrowLeft, ShoppingCart, CheckCircle, MapPin, Package, Star, MessageSquare, ShieldCheck, Clock, Loader2, Minus, Plus } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                const data = await productsService.getById(id as string);
                setProduct(data);
            } catch (error) {
                console.error("Error loading product", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) loadProduct();
    }, [id]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-neo-white">
            <Loader2 className="animate-spin text-black" size={64} />
        </div>
    );

    if (!product) return (
        <div className="h-screen flex flex-col items-center justify-center bg-neo-white gap-6">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Producto No Encontrado</h2>
            <Link href="/marketplace">
                <button className="px-8 py-4 bg-black text-white font-black uppercase border-4 border-black shadow-neo-yellow hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
                    Regresar al Marketplace
                </button>
            </Link>
        </div>
    );

    return (
        <div className="bg-neo-white font-display text-black min-h-screen selection:bg-neo-red selection:text-white pb-32 mt-16">
            <main className="max-w-7xl mx-auto px-4 py-10 md:px-8">
                {/* Back Button & Breadcrumbs */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-3 h-14 px-6 bg-white border-4 border-black font-black uppercase text-xs tracking-widest shadow-neo-sm hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        VOLVER ATRÁS
                    </button>
                    <div className="bg-black text-white px-4 py-2 border-2 border-black font-black uppercase text-[10px] tracking-[0.2em] -rotate-1">
                        TIENDACAMPUS / PRODUCTO / {product.name.toUpperCase()}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Visual Section */}
                    <div className="lg:col-span-6 space-y-8">
                        <div className="relative aspect-square border-4 border-black bg-slate-50 shadow-neo-lg overflow-hidden group">
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 italic font-black text-9xl text-slate-200 uppercase select-none">
                                    {product.name.charAt(0)}
                                </div>
                            )}
                            <div className="absolute top-6 left-6 z-20 bg-neo-yellow border-4 border-black px-6 py-2 font-black text-2xl tracking-tighter shadow-neo transform -rotate-3">
                                {product.isPerishable ? 'FRESCO' : 'STOCK'}
                            </div>
                        </div>

                        {/* Social Proof Sim (Deco) */}
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-square border-4 border-black bg-white flex items-center justify-center grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all cursor-crosshair">
                                    <Package size={40} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="lg:col-span-6 flex flex-col pt-4">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-neo-red text-white py-1 px-3 border-2 border-black font-black uppercase text-[10px] tracking-widest">
                                    LO MÁS VENDIDO
                                </div>
                                <div className="flex items-center gap-1 text-neo-yellow">
                                    <Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} />
                                </div>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-black">
                                {product.name}
                            </h1>

                            <div className="flex items-end gap-6 py-4">
                                <span className="text-7xl font-black tracking-tighter text-neo-red border-b-8 border-black">${Number(product.salePrice).toFixed(2)}</span>
                                <span className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest italic">PAGO CONTRA ENTREGA</span>
                            </div>

                            {/* Seller Card Redesign */}
                            <div className="p-6 border-4 border-black bg-slate-50 flex items-center justify-between group hover:bg-neo-yellow/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 border-4 border-black bg-black text-white flex items-center justify-center font-black text-2xl group-hover:rotate-6 transition-transform">
                                        {product.seller?.fullName?.charAt(0).toUpperCase() || 'V'}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendedor Verificado</p>
                                        <p className="font-black text-xl uppercase tracking-tighter">@{product.seller?.fullName?.replace(/\s/g, '').toLowerCase() || 'vendedor'}</p>
                                    </div>
                                </div>
                                <button className="h-12 w-12 border-2 border-slate-300 hover:border-black flex items-center justify-center transition-colors">
                                    <MessageSquare size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 pt-6">
                                <h3 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-3 h-3 bg-neo-red"></div> SOBRE PRODUCTO
                                </h3>
                                <p className="text-lg font-bold text-slate-500 leading-relaxed border-l-4 border-black pl-6">
                                    {product.description || 'Este producto es de alta calidad y está disponible hoy mismo para entrega inmediata en cualquier punto estratégico del campus universitario.'}
                                </p>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4 py-8 border-y-4 border-black border-dashed">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="text-neo-green" size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Seguridad Campus</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="text-neo-red" size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Entrega Flash</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Section */}
                        <div className="mt-12 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-black uppercase text-black tracking-widest">Seleccionar Cantidad</div>
                                <div className="flex items-center border-4 border-black bg-white h-14 shadow-neo-sm overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-14 h-full flex items-center justify-center hover:bg-black hover:text-white transition-all border-r-4 border-black active:scale-90"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        readOnly
                                        className="w-16 h-full text-center font-black text-xl focus:outline-none"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-14 h-full flex items-center justify-center hover:bg-black hover:text-white transition-all border-l-4 border-black active:scale-90"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push(`/checkout?productId=${product.id}&qty=${quantity}`)}
                                className="w-full h-20 bg-black text-white text-3xl font-black uppercase tracking-[0.1em] border-4 border-black shadow-[10px_10px_0_0_#E31837] hover:shadow-none hover:translate-x-[10px] hover:translate-y-[10px] transition-all flex items-center justify-center gap-6 active:scale-95"
                            >
                                <ShoppingCart size={32} />
                                PEDIR AHORA
                            </button>

                            <p className="text-[10px] font-black uppercase text-slate-400 text-center tracking-widest italic pt-2">
                                Garantía Tiendita: Pago contra entrega en zonas seguras
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
