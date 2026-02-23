'use client';

import { useEffect, useState } from 'react';
import { Package, TrendingUp, CheckCircle2, ChevronRight, AlertCircle, Loader2, DollarSign, Users, ShoppingBasket, Rocket, Plus } from "lucide-react";
import { salesService, RoiStats } from '@/services/sales.service';
import { ordersService, Order } from '@/services/orders.service';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { toast } from 'sonner';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<RoiStats | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [statsData, ordersData] = await Promise.all([
                salesService.getRoiStats('', ''),
                ordersService.getIncomingOrders()
            ]);
            setStats(statsData);
            setOrders(ordersData);
        } catch (error) {
            console.error("Error loading dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (orderId: string) => {
        try {
            await ordersService.acceptOrder(orderId);
            toast.success('¡Aceptado! Manos a la obra.');
            loadDashboardData();
        } catch (e) {
            toast.error('Error al aceptar');
        }
    };

    const handleReject = async (orderId: string) => {
        try {
            await ordersService.rejectOrder(orderId);
            toast.success('Pedido rechazado');
            loadDashboardData();
        } catch (e) {
            toast.error('Error al rechazar');
        }
    };

    const pendingOrders = orders.filter(o => o.status === 'requested');

    if (loading && !stats) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-neo-white gap-4">
                <div className="w-16 h-16 border-4 border-black border-t-neo-red animate-spin"></div>
                <p className="font-black uppercase tracking-widest text-slate-400">Preparando tu Despacho...</p>
            </div>
        );
    }

    return (
        <div className="font-display selection:bg-neo-red selection:text-white bg-neo-white min-h-screen p-4 md:p-10 pb-24 space-y-12">
            {/* Header / Hero Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-8 border-black pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-neo-yellow text-black border-2 border-black px-3 py-1 font-black uppercase text-[10px] tracking-widest shadow-neo-sm transform -rotate-1">
                            ESTADO: ONLINE
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-neo-green rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase text-slate-400">Live Server</span>
                        </div>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8]">
                        ¡HOLA, <br />
                        <span className="text-neo-red drop-shadow-[4px_4px_0_#000]">{user?.firstName?.toUpperCase() || 'BOSS'}!</span>
                    </h1>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                    <p className="font-black text-black uppercase tracking-widest text-sm bg-neo-yellow border-2 border-black px-4 py-1">
                        {new Date().toLocaleDateString('es-MX', { weekday: 'short', month: 'short', day: '2-digit' }).toUpperCase()}
                    </p>
                    <p className="text-xs font-bold text-slate-400 uppercase italic">Tu imperio del campus está creciendo.</p>
                </div>
            </header>

            {/* Main Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Pending Orders Card */}
                <article className="bg-neo-yellow border-4 border-black p-8 shadow-neo-lg hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all group flex flex-col justify-between min-h-[220px]">
                    <div className="flex justify-between items-start">
                        <h3 className="font-black uppercase tracking-[0.2em] text-xs text-black/60">Pedidos por atender</h3>
                        <ShoppingBasket className="w-10 h-10 text-black group-hover:scale-125 transition-transform" />
                    </div>
                    <div>
                        <div className="text-7xl font-black tracking-tighter leading-none mb-2">
                            {pendingOrders.length}
                        </div>
                        <Link href="/sales" className="inline-flex items-center gap-2 font-black uppercase text-xs border-b-4 border-black pb-1 hover:text-neo-red transition-colors">
                            GESTIONAR VENTAS <ChevronRight size={16} />
                        </Link>
                    </div>
                </article>

                {/* Revenue Card */}
                <article className="bg-white border-4 border-black p-8 shadow-neo-lg hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all flex flex-col justify-between min-h-[220px]">
                    <div className="flex justify-between items-start">
                        <h3 className="font-black uppercase tracking-[0.2em] text-xs text-slate-400">Ingresos Totales</h3>
                        <DollarSign className="w-10 h-10 text-neo-green" />
                    </div>
                    <div>
                        <div className="text-7xl font-black tracking-tighter leading-none mb-2">
                            ${stats?.revenue?.toFixed(0) || '0'}
                        </div>
                        <p className="font-extrabold uppercase text-[10px] text-slate-400">Sincronizado hace 1 min</p>
                    </div>
                </article>

                {/* Profit Card */}
                <article className="bg-black text-white border-4 border-black p-8 shadow-neo-lg hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-neo-red rounded-full opacity-30 blur-2xl"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <h3 className="font-black uppercase tracking-[0.2em] text-xs text-slate-500">Ganancia Neta</h3>
                        <TrendingUp className="w-10 h-10 text-neo-green" />
                    </div>
                    <div className="relative z-10">
                        <div className={`text-7xl font-black tracking-tighter leading-none mb-2 ${(stats?.netProfit || 0) < 0 ? 'text-neo-red' : 'text-white'}`}>
                            ${stats?.netProfit?.toFixed(0) || '0'}
                        </div>
                        <p className="font-extrabold uppercase text-[10px] text-neo-green tracking-widest flex items-center gap-1">
                            <Rocket size={12} /> ROI OBJETIVO ALCANZADO
                        </p>
                    </div>
                </article>
            </section>

            {/* Quick Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Active Orders List */}
                <section className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between border-b-4 border-black pb-4">
                        <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <Rocket className="text-neo-red" /> Pedidos Recientes
                        </h2>
                        <Link href="/sales" className="text-xs font-black uppercase border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all">
                            Ver Todo
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {pendingOrders.slice(0, 3).map(order => (
                            <div key={order.id} className="bg-white border-4 border-black p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center hover:bg-slate-50 transition-colors group">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-neo-red text-white text-[9px] font-black uppercase px-1.5 py-0.5 border border-black shadow-[1px_1px_0_0_#000]">
                                            NUEVO
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">#{order.id.slice(-4).toUpperCase()}</span>
                                    </div>
                                    <h4 className="font-black text-xl uppercase leading-none text-black">
                                        {order.items?.[0]?.product?.name || 'PRODUCTO'}
                                        {order.items?.length > 1 && <span className="text-neo-red ml-2">+{order.items.length - 1} MÁS</span>}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-6 h-6 bg-black text-white text-[10px] flex items-center justify-center font-black rounded-sm uppercase">
                                            {order.buyer?.fullName?.charAt(0) || 'C'}
                                        </div>
                                        <p className="text-xs font-black uppercase text-slate-600">{order.buyer?.fullName || 'CLIENTE ANÓNIMO'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => handleAccept(order.id)}
                                        className="flex-1 sm:flex-none h-12 px-6 bg-neo-green border-4 border-black font-black uppercase text-xs shadow-[3px_3px_0_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                                    >
                                        ACEPTAR
                                    </button>
                                    <button
                                        onClick={() => handleReject(order.id)}
                                        className="flex-1 sm:flex-none h-12 px-4 bg-white border-4 border-black font-black uppercase text-xs text-slate-400 hover:text-neo-red hover:bg-slate-50 transition-all"
                                    >
                                        IGNORAR
                                    </button>
                                </div>
                            </div>
                        ))}
                        {pendingOrders.length === 0 && (
                            <div className="bg-white border-4 border-black border-dashed p-10 text-center">
                                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                                <p className="font-black uppercase text-slate-300 tracking-wider">Sin alertas críticas por ahora.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Quick Shortcuts */}
                <section className="lg:col-span-2 space-y-6">
                    <h2 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-4">Accesos Rápidos</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <Link href="/products/new" className="group">
                            <div className="bg-black text-white p-6 border-4 border-black shadow-[6px_6px_0_0_#FFC72C] group-hover:shadow-none group-hover:translate-x-[6px] group-hover:translate-y-[6px] transition-all flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-neo-yellow border-2 border-white flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-transform">
                                        <Plus className="text-black" />
                                    </div>
                                    <span className="font-black uppercase tracking-widest text-sm">Lanzar Producto</span>
                                </div>
                                <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                            </div>
                        </Link>

                        <Link href="/reports" className="group">
                            <div className="bg-white text-black p-6 border-4 border-black shadow-[6px_6px_0_0_#E31837] group-hover:shadow-none group-hover:translate-x-[6px] group-hover:translate-y-[6px] transition-all flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-400 border-2 border-black flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
                                        <TrendingUp className="text-white" />
                                    </div>
                                    <span className="font-black uppercase tracking-widest text-sm">Ver Auditoría</span>
                                </div>
                                <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                            </div>
                        </Link>
                    </div>

                    <div className="p-8 border-4 border-black bg-neo-green/10 relative overflow-hidden flex items-center justify-center min-h-[160px]">
                        <div className="absolute inset-0 opacity-10 font-black text-8xl flex items-center justify-center select-none pointer-events-none uppercase rotate-12">
                            PRO
                        </div>
                        <div className="text-center relative z-10">
                            <p className="font-black uppercase text-lg text-black leading-tight">¿Alguna duda, {user?.firstName}?</p>
                            <p className="text-xs font-bold uppercase text-slate-500 mt-2">Estamos aquí para ayudarte a escalar.</p>
                            <button className="mt-4 px-6 py-2 bg-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-neo-red transition-colors">
                                Soporte VIP
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
