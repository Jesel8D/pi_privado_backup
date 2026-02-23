'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { productsService, Product } from '@/services/products.service';
import { ordersService } from '@/services/orders.service';
import { ArrowLeft, CheckCircle, Package, Zap, MessageSquare, ShieldCheck, MapPin, Loader2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const productId = searchParams.get('productId');
    const initialQty = parseInt(searchParams.get('qty') || '1', 10);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [quantity, setQuantity] = useState(initialQty);
    const [deliveryMessage, setDeliveryMessage] = useState('');

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                const data = await productsService.getById(productId as string);
                setProduct(data);
            } catch (error) {
                console.error("Error loading product", error);
                toast.error('Producto no encontrado');
            } finally {
                setLoading(false);
            }
        };

        if (productId) loadProduct();
    }, [productId]);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product || !product.seller?.id) return;

        try {
            setIsSubmitting(true);
            await ordersService.createOrder({
                sellerId: product.seller.id,
                items: [
                    { productId: product.id, quantity }
                ],
                deliveryMessage
            });
            toast.success('¡PEDIDO ENVIADO!', {
                description: 'El vendedor ha sido notificado. Revisa tu panel para ver el estado.',
            });
            router.push('/buyer/dashboard');
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Error al crear el pedido');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-neo-white">
            <Loader2 className="animate-spin text-black" size={64} />
        </div>
    );

    if (!product) return (
        <div className="h-screen flex flex-col items-center justify-center bg-neo-white gap-6">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">CARRITO VACÍO</h2>
            <button onClick={() => router.push('/marketplace')} className="px-8 py-4 bg-black text-white font-black uppercase border-4 border-black shadow-neo-yellow hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
                Explorar Marketplace
            </button>
        </div>
    );

    const total = Number(product.salePrice) * quantity;

    return (
        <div className="bg-neo-white font-display text-black min-h-screen selection:bg-neo-red selection:text-white pb-32 mt-16">
            {/* Minimalist Navigation */}
            <header className="border-b-4 border-black bg-white sticky top-0 z-[60]">
                <div className="max-w-7xl mx-auto px-4 h-20 md:px-8 flex justify-between items-center">
                    <button
                        onClick={() => router.back()}
                        className="group h-12 px-6 border-4 border-black bg-white font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-slate-50 shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> ATRÁS
                    </button>
                    <div className="bg-neo-red text-white border-2 border-black font-black uppercase text-[10px] tracking-[0.2em] px-3 py-1 -rotate-2">
                        PAGO SEGURO • CAMPUS
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-12 md:px-8">
                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Form Section */}
                    <div className="flex-1 space-y-12">
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                                FINALIZAR <span className="text-neo-red">PEDIDO</span>
                            </h1>
                            <p className="text-lg font-bold text-slate-500 uppercase tracking-tight max-w-lg border-l-4 border-neo-yellow pl-4">
                                Confirma tu pedido y coordina con el vendedor el punto de entrega.
                            </p>
                        </div>

                        <section className="bg-white border-4 border-black p-8 shadow-neo-lg relative">
                            <div className="absolute -top-4 -right-4 bg-neo-yellow border-4 border-black p-4 rotate-6 group">
                                <MapPin size={32} className="text-black group-hover:rotate-12 transition-transform" />
                            </div>

                            <h2 className="text-2xl font-black uppercase flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-black text-white border-2 border-black flex items-center justify-center">1</div>
                                Coordinar Entrega
                            </h2>

                            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase text-black tracking-widest flex items-center gap-2 pl-1">
                                        Instrucciones para el Vendedor <Zap size={12} className="text-neo-red" />
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={deliveryMessage}
                                        onChange={e => setDeliveryMessage(e.target.value)}
                                        className="w-full border-4 border-black bg-slate-50 p-6 font-bold text-lg focus:outline-none focus:bg-white focus:ring-8 focus:ring-neo-yellow/20 transition-all placeholder:text-slate-300 resize-none"
                                        placeholder="EJ: TE VEO EN LA ENTRADA DE LA BIBLIOTECA CENTRAL A LA 1:00 PM. LLEVO SUDADERA AZUL."
                                    ></textarea>
                                </div>
                                <div className="bg-neo-red/5 border-l-8 border-neo-red p-6 space-y-2">
                                    <p className="font-black flex items-center gap-2 text-xs uppercase text-neo-red uppercase tracking-wider">
                                        <ShieldCheck size={16} /> Verificación de Seguridad
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase italic">
                                        Recomendamos realizar las entregas en zonas iluminadas y concurridas del campus. El pago se realiza al recibir el producto.
                                    </p>
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="w-full lg:w-[450px] shrink-0 sticky top-32">
                        <section className="bg-neo-yellow border-4 border-black p-10 shadow-neo-lg space-y-8">
                            <h2 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-4">
                                Tu Pedido
                            </h2>

                            <div className="flex gap-6 relative">
                                <div className="w-24 h-24 bg-white border-4 border-black shrink-0 flex items-center justify-center -rotate-3 hover:rotate-0 transition-transform overflow-hidden shadow-neo-sm">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover grayscale" />
                                    ) : (
                                        <Package className="w-12 h-12 text-slate-200" />
                                    )}
                                </div>
                                <div className="flex flex-col justify-center flex-1 space-y-2">
                                    <h3 className="font-black uppercase text-lg leading-none tracking-tight line-clamp-2">{product.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-black text-white text-[10px] flex items-center justify-center font-black">
                                            {product.seller?.fullName?.charAt(0) || 'V'}
                                        </div>
                                        <span className="text-[10px] font-black text-black/50 uppercase tracking-widest truncate">
                                            {product.seller?.fullName || 'Campus Store'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-black text-xl tracking-tighter">${Number(product.salePrice).toFixed(2)}</span>
                                        <span className="font-black text-xs bg-white border-2 border-black px-2 py-0.5">X {quantity}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-8 border-t-4 border-black border-dashed">
                                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-black/60">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-black/60">
                                    <span>Cuota Campus</span>
                                    <span className="text-neo-red">$0.00</span>
                                </div>
                                <div className="flex justify-between items-center text-4xl font-black tracking-tighter pt-4">
                                    <span>TOTAL</span>
                                    <span className="flex items-center gap-1">
                                        <DollarSign size={24} className="mb-2" />
                                        {total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={isSubmitting}
                                className="group w-full h-20 bg-black text-white font-black text-2xl uppercase tracking-[0.1em] border-4 border-black shadow-[8px_8px_0_0_#FFF] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px] transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" size={32} />
                                ) : (
                                    <>
                                        ¡PEDIR AHORA!
                                        <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
                                    </>
                                )}
                            </button>

                            <p className="text-[10px] font-black uppercase text-center text-black/40 tracking-widest pt-2">
                                Al confirmar, te comprometes a realizar la compra
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center bg-neo-white"><Loader2 className="animate-spin text-black" size={64} /></div>}>
            <CheckoutContent />
        </Suspense>
    );
}
