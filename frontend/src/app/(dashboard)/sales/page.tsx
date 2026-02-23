'use client';

import { useState, useEffect } from 'react';
import { ordersService, Order } from '@/services/orders.service';
import { Package, Clock, CheckCircle2, RefreshCw, HandPlatter, AlertTriangle, User, MessageCircle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'requested' | 'accepted' | 'completed'>('all');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await ordersService.getIncomingOrders();
            setOrders(data);
        } catch (error) {
            console.error("Error loading orders", error);
            toast.error("Error cargando pedidos");
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (orderId: string) => {
        try {
            await ordersService.acceptOrder(orderId);
            toast.success("¡PEDIDO ACEPTADO! A prepararlo.", {
                icon: <HandPlatter className="text-neo-yellow" />
            });
            loadOrders();
        } catch (error) {
            toast.error("Error al aceptar pedido");
        }
    };

    const handleReject = async (orderId: string) => {
        if (!confirm('¿Seguro que quieres RECHAZAR este pedido?')) return;
        try {
            await ordersService.rejectOrder(orderId);
            toast.success("Pedido enviado a la papelera.");
            loadOrders();
        } catch (error) {
            toast.error("Error al rechazar");
        }
    };

    const handleDeliver = async (orderId: string) => {
        try {
            await ordersService.markAsDelivered(orderId);
            toast.success("¡PEDIDO ENTREGADO! ¡Felicidades por la venta!", {
                icon: <CheckCircle2 className="text-neo-green" />
            });
            loadOrders();
        } catch (error) {
            toast.error("Error al completar");
        }
    };

    const filteredOrders = orders.filter(o => {
        if (activeTab === 'all') return true;
        if (activeTab === 'completed') return ['completed', 'delivered'].includes(o.status);
        return o.status === activeTab;
    });

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'requested': return { bg: 'bg-neo-yellow', text: 'text-black', label: 'PENDIENTE', icon: <Clock size={16} /> };
            case 'accepted': return { bg: 'bg-neo-red', text: 'text-white', label: 'PREPARANDO', icon: <HandPlatter size={16} /> };
            case 'completed':
            case 'delivered': return { bg: 'bg-neo-green', text: 'text-black', label: 'ENTREGADO', icon: <CheckCircle2 size={16} /> };
            case 'rejected': return { bg: 'bg-black', text: 'text-white', label: 'RECHAZADO', icon: <AlertTriangle size={16} /> };
            default: return { bg: 'bg-slate-200', text: 'text-black', label: status, icon: <Package size={16} /> };
        }
    };

    return (
        <div className="p-4 md:p-10 space-y-10 font-display min-h-screen bg-neo-white selection:bg-neo-red selection:text-white pb-24">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b-4 border-black pb-8">
                <div className="space-y-2">
                    <div className="inline-block bg-neo-yellow text-black border-2 border-black px-3 py-1 font-black uppercase text-xs tracking-widest shadow-neo-sm transform -rotate-1 mb-2">
                        SELLER COMMAND CENTER
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-black">
                        GESTIÓN <span className="text-neo-red">VENTAS</span>
                    </h1>
                    <p className="text-lg font-bold text-slate-500 uppercase tracking-tight max-w-md border-l-4 border-black pl-4">
                        Controla el flujo de tus pedidos en tiempo real.
                    </p>
                </div>
                <button
                    onClick={loadOrders}
                    disabled={loading}
                    className="group bg-white border-4 border-black px-8 py-4 font-black uppercase flex items-center justify-center gap-3 hover:bg-neo-yellow shadow-[6px_6px_0px_0px_#000] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all disabled:opacity-50"
                >
                    <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'ACTUALIZANDO...' : 'REFRESCAR LISTA'}
                </button>
            </div>

            {/* Quick Stats Tabs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { id: 'all', label: 'TODOS', count: orders.length, color: 'bg-white' },
                    { id: 'requested', label: 'PENDIENTES', count: orders.filter(o => o.status === 'requested').length, color: 'bg-neo-yellow' },
                    { id: 'accepted', label: 'PREPARANDO', count: orders.filter(o => o.status === 'accepted').length, color: 'bg-neo-red', text: 'text-white' },
                    { id: 'completed', label: 'COMPLETADOS', count: orders.filter(o => ['completed', 'delivered'].includes(o.status)).length, color: 'bg-neo-green' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`p-6 border-4 border-black flex flex-col items-center justify-center text-center transition-all ${activeTab === tab.id
                                ? `${tab.color} ${tab.text || 'text-black'} shadow-[6px_6px_0_0_#000] translate-x-[-4px] translate-y-[-4px]`
                                : 'bg-white text-slate-400 border-slate-200 opacity-60 hover:opacity-100 hover:border-black'
                            }`}
                    >
                        <span className={`text-4xl font-black tracking-tighter mb-1`}>{tab.count}</span>
                        <span className="font-black uppercase tracking-[0.1em] text-[10px]">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Orders Feed */}
            <div className="space-y-8">
                {loading ? (
                    <div className="py-20 text-center uppercase font-black text-slate-300 tracking-[0.3em] animate-pulse">
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        Sincronizando con el servidor...
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="border-4 border-black border-dashed p-20 text-center bg-white">
                        <Package className="w-20 h-20 mx-auto mb-6 text-slate-100" />
                        <h3 className="text-3xl font-black uppercase text-slate-300">Sin pedidos por ahora</h3>
                        <p className="font-bold text-slate-300 uppercase mt-2 italic shadow-white text-sm">Pronto llegarán clientes hambrientos</p>
                    </div>
                ) : (
                    filteredOrders.map(order => {
                        const style = getStatusInfo(order.status);
                        return (
                            <article key={order.id} className="bg-white border-4 border-black flex flex-col lg:grid lg:grid-cols-[200px_1fr] shadow-neo-lg group hover:-translate-y-1 transition-transform overflow-hidden">
                                {/* Lateral Status / Amount */}
                                <div className={`${style.bg} ${style.text} p-8 border-b-4 lg:border-b-0 lg:border-r-4 border-black flex flex-col items-center justify-center text-center`}>
                                    <div className="w-16 h-16 border-4 border-black bg-white flex items-center justify-center rotate-[-5deg] mb-4 group-hover:rotate-0 transition-transform">
                                        <DollarSign className="w-8 h-8 text-black" />
                                    </div>
                                    <div className="text-3xl font-black tracking-tighter mb-1">
                                        ${Number(order.totalAmount).toFixed(2)}
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 font-black uppercase tracking-[0.1em] text-[10px] px-2 py-1 border-2 border-black bg-white text-black">
                                        {style.icon} {style.label}
                                    </div>
                                </div>

                                {/* Order Info */}
                                <div className="p-8 flex flex-col">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-black text-white px-2 py-1 font-black text-xs uppercase tracking-widest">
                                                    ORD #{order.id.slice(-6).toUpperCase()}
                                                </span>
                                                <span className="font-black text-slate-400 text-xs flex items-center gap-1">
                                                    <Clock size={14} /> {new Date(order.createdAt).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-black uppercase leading-none text-black pt-2">
                                                {order.items.map(i => `${i.quantity}X ${i.product?.name}`).join(' | ')}
                                            </h3>
                                        </div>
                                        <div className="bg-slate-50 border-2 border-black p-4 flex flex-col min-w-[200px] hover:bg-neo-yellow/10 transition-colors">
                                            <div className="flex items-center gap-2 mb-1">
                                                <User size={14} className="text-neo-red" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</span>
                                            </div>
                                            <p className="font-black uppercase text-sm text-black">{order.buyer?.fullName || 'ANÓNIMO'}</p>
                                        </div>
                                    </div>

                                    {order.deliveryMessage && (
                                        <div className="bg-blue-50 border-4 border-black border-dashed p-4 mb-8 relative">
                                            <MessageCircle className="absolute -top-3 -left-3 text-blue-500 fill-white" size={24} />
                                            <p className="text-sm font-bold italic text-blue-900 leading-snug">
                                                &quot;{order.deliveryMessage}&quot;
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-auto flex flex-col sm:flex-row justify-end gap-4 border-t-4 border-black border-dashed pt-6">
                                        {order.status === 'requested' && (
                                            <>
                                                <button
                                                    onClick={() => handleReject(order.id)}
                                                    className="px-6 py-3 font-black uppercase text-xs tracking-[0.2em] text-neo-red hover:bg-neo-red hover:text-white border-2 border-transparent hover:border-black transition-all"
                                                >
                                                    Declinar Pedido
                                                </button>
                                                <button
                                                    onClick={() => handleAccept(order.id)}
                                                    className="px-8 py-3 bg-neo-yellow border-4 border-black font-black uppercase text-sm tracking-[0.1em] shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2"
                                                >
                                                    <HandPlatter className="w-5 h-5" /> EMPEZAR PREPARACIÓN
                                                </button>
                                            </>
                                        )}
                                        {order.status === 'accepted' && (
                                            <button
                                                onClick={() => handleDeliver(order.id)}
                                                className="w-full sm:w-auto px-10 py-4 bg-neo-green border-4 border-black font-black uppercase text-lg tracking-[0.1em] shadow-[6px_6px_0_0_#000] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all flex items-center justify-center gap-3"
                                            >
                                                <CheckCircle2 className="w-6 h-6" /> MARCAR COMO ENTREGADO
                                            </button>
                                        )}
                                        {['completed', 'delivered'].includes(order.status) && (
                                            <div className="flex items-center gap-2 px-6 py-3 bg-slate-100 border-2 border-black font-black uppercase text-[10px] text-slate-500">
                                                <CheckCircle2 size={14} /> TRANSACCIÓN FINALIZADA
                                            </div>
                                        )}
                                        {order.status === 'rejected' && (
                                            <div className="flex items-center gap-2 px-6 py-3 bg-black text-white border-2 border-black font-black uppercase text-[10px]">
                                                <AlertTriangle size={14} /> PEDIDO RECHAZADO
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })
                )}
            </div>
        </div>
    );
}
