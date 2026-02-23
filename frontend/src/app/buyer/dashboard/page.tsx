'use client';

import { useState, useEffect } from 'react';
import { ordersService, Order } from '@/services/orders.service';
import {
    Package,
    Clock,
    CheckCircle2,
    XCircle,
    ShoppingBag,
    TrendingUp,
    User,
    Zap,
    ArrowRight,
    Loader2,
    Calendar,
    ChevronRight,
    MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';

export default function BuyerDashboardPage() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'activos' | 'completados' | 'cancelados'>('activos');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await ordersService.getMyPurchases();
            setOrders(data);
        } catch (error) {
            console.error("Error loading orders", error);
            toast.error("Error cargando tus pedidos");
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'activos') return ['requested', 'accepted'].includes(order.status);
        if (filter === 'completados') return ['completed', 'delivered'].includes(order.status);
        if (filter === 'cancelados') return order.status === 'rejected';
        return true;
    });

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'requested': return { bg: 'bg-neo-yellow', text: 'text-black', label: 'PEDIDO', icon: <Clock size={14} /> };
            case 'accepted': return { bg: 'bg-neo-red', text: 'text-white', label: 'PREPARANDO', icon: <Package size={14} /> };
            case 'completed':
            case 'delivered': return { bg: 'bg-neo-green', text: 'text-black', label: 'ENTREGADO', icon: <CheckCircle2 size={14} /> };
            case 'rejected': return { bg: 'bg-black', text: 'text-white', label: 'CANCELADO', icon: <XCircle size={14} /> };
            default: return { bg: 'bg-slate-200', text: 'text-black', label: status, icon: <Package size={14} /> };
        }
    };

    return (
        <div className="bg-neo-white font-display text-black min-h-screen selection:bg-neo-red selection:text-white pb-24 mt-16">
            {/* Header / Profile Hero */}
            <div className="bg-black text-white border-b-8 border-black pt-20 pb-16 px-4 md:px-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-neo-yellow opacity-10 blur-[100px] -mr-48 -mt-48"></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:items-start">
                        <div className="w-32 h-32 border-4 border-white bg-neo-red flex items-center justify-center text-5xl font-black rotate-[-3deg] hover:rotate-0 transition-transform shadow-[6px_6px_0_0_#FFC72C]">
                            {user?.firstName?.charAt(0) || 'U'}
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <div className="inline-block bg-neo-yellow text-black border-2 border-black px-3 py-1 font-black uppercase text-xs tracking-widest shadow-neo-sm transform -rotate-1 mb-2">
                                PERFIL DE COMPRADOR
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                                MIS <span className="text-neo-yellow">COMPRAS</span>
                            </h1>
                            <p className="text-lg font-bold text-slate-400 uppercase tracking-tight max-w-md">
                                {user?.firstName} {user?.lastName} • Miembro desde {new Date().getFullYear()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-12 md:px-10 space-y-16">

                {/* Apartado 1: Resumen de Actividad (Stats) */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b-4 border-black pb-2">
                        <TrendingUp className="text-neo-red" />
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Resumen Ejecutivo</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border-4 border-black p-6 shadow-neo hover:translate-y-[-4px] transition-transform">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Pedidos</p>
                            <h4 className="text-4xl font-black">{orders.length}</h4>
                        </div>
                        <div className="bg-white border-4 border-black p-6 shadow-neo hover:translate-y-[-4px] transition-transform">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">En Camino</p>
                            <h4 className="text-4xl font-black text-neo-red">{orders.filter(o => o.status === 'requested' || o.status === 'accepted').length}</h4>
                        </div>
                        <div className="bg-white border-4 border-black p-6 shadow-neo hover:translate-y-[-4px] transition-transform">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Inversión Campus</p>
                            <h4 className="text-4xl font-black text-neo-green">${orders.reduce((acc, o) => acc + Number(o.totalAmount), 0).toFixed(0)}</h4>
                        </div>
                    </div>
                </section>

                {/* Apartado 2: Historial de Pedidos (Filters) */}
                <section className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-black pb-4">
                        <div className="flex items-center gap-3">
                            <Zap className="text-neo-yellow" />
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Mi Historial</h2>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                            {(['activos', 'completados', 'cancelados'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`px-6 py-2 border-2 border-black font-black uppercase text-[10px] tracking-widest transition-all ${filter === tab
                                        ? 'bg-black text-white shadow-neo-sm translate-y-[-2px]'
                                        : 'bg-white text-black hover:bg-slate-50'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-300">
                                <Loader2 className="animate-spin" size={48} />
                                <p className="font-black uppercase text-xs tracking-[0.2em]">Cargando paquetes...</p>
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="border-4 border-black border-dashed p-20 text-center bg-white">
                                <Package className="w-16 h-16 mx-auto mb-4 text-slate-100" />
                                <h3 className="text-2xl font-black uppercase text-slate-300 italic">Nada por aquí todavía</h3>
                                <Link href="/marketplace">
                                    <button className="mt-6 px-6 py-3 border-4 border-black bg-neo-yellow font-black uppercase text-xs tracking-widest shadow-neo-sm hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
                                        Ir al marketplace
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            filteredOrders.map(order => {
                                const statusInfo = getStatusInfo(order.status);
                                return (
                                    <div key={order.id} className="bg-white border-4 border-black shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all overflow-hidden flex flex-col md:flex-row">
                                        <div className={`p-6 md:w-48 flex flex-col items-center justify-center border-b-4 md:border-b-0 md:border-r-4 border-black ${statusInfo.bg} ${statusInfo.text}`}>
                                            <Package size={32} className="mb-2" />
                                            <span className="font-black uppercase text-[10px] tracking-widest">{statusInfo.label}</span>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col md:flex-row justify-between gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-black text-white px-2 py-0.5 font-black text-[10px] uppercase italic tracking-[0.2em]">
                                                        #{order.id.slice(-6).toUpperCase()}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                        <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h4 className="text-2xl font-black uppercase tracking-tighter leading-none">
                                                    {order.items.map(i => `${i.quantity}x ${i.product?.name}`).join(' + ')}
                                                </h4>
                                                <div className="flex items-center gap-4 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-neo-red border border-black flex items-center justify-center text-white font-black text-[10px]">
                                                            {order.seller?.fullName?.charAt(0) || 'V'}
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase text-slate-600">@{order.seller?.fullName?.replace(/\s/g, '').toLowerCase() || 'vendedor'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <MapPin size={12} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest italic">Campus Core</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end justify-between gap-4">
                                                <div className="text-4xl font-black tracking-tighter">${Number(order.totalAmount).toFixed(2)}</div>
                                                <button className="w-full md:w-auto px-6 py-2 border-2 border-black font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-2">
                                                    Detalles <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* Apartado 3: Descubrimiento / Sugerencias (Cards) */}
                <section className="space-y-8 bg-black text-white p-10 border-4 border-black shadow-neo relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-neo-red"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="space-y-4 text-center md:text-left">
                            <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">¿HAMBRE <br /> DE <span className="text-neo-yellow">ALGO MÁS?</span></h2>
                            <p className="max-w-md text-sm font-bold text-slate-400 uppercase leading-relaxed">
                                Explora las tendencias del día y descubre emprendedores nuevos en tu facultad. Las mejores ofertas están a un clic.
                            </p>
                            <Link href="/marketplace">
                                <button className="mt-4 px-10 py-4 bg-neo-yellow text-black font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0_0_#FFF] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2">
                                    IR A LA TIENDA <ArrowRight size={18} />
                                </button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-24 h-24 border-2 border-white/20 bg-white/5 rotate-3 hover:rotate-0 transition-transform flex items-center justify-center grayscale group">
                                    <ShoppingBag className="text-white/20 group-hover:text-neo-yellow transition-colors" size={32} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
