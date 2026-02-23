'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    PieChart,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Target,
    Package,
    Loader2,
    CalendarDays
} from 'lucide-react';
import { salesService, RoiStats } from '@/services/sales.service';

export default function ReportsPage() {
    const [stats, setStats] = useState<RoiStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await salesService.getRoiStats('', '');
                setStats(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-neo-white">
                <Loader2 className="animate-spin text-black" size={64} />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-10 space-y-12 font-display min-h-screen bg-neo-white selection:bg-neo-red selection:text-white pb-24">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b-4 border-black pb-8">
                <div className="space-y-2">
                    <div className="inline-block bg-blue-400 text-white border-2 border-black px-3 py-1 font-black uppercase text-xs tracking-widest shadow-neo-sm transform -rotate-1 mb-2">
                        BUSINESS INTELLIGENCE
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-black">
                        MÉTRICAS <span className="text-neo-red">PRO</span>
                    </h1>
                    <p className="text-lg font-bold text-slate-500 uppercase tracking-tight max-w-md border-l-4 border-black pl-4">
                        Analiza tu rendimiento y toma decisiones basadas en datos reales.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white border-4 border-black p-4 shadow-neo-sm">
                    <CalendarDays className="text-neo-red" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400">Periodo Actual</p>
                        <p className="font-black uppercase text-sm">Últimos 30 días</p>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Ingresos Totales */}
                <div className="bg-white border-4 border-black p-8 shadow-neo-lg group hover:-translate-y-2 transition-transform">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-neo-yellow border-2 border-black flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
                            <DollarSign size={24} className="text-black" />
                        </div>
                        <span className="flex items-center text-xs font-black text-neo-green uppercase">
                            <ArrowUpRight size={14} /> +12%
                        </span>
                    </div>
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">Ingresos Totales</p>
                    <h3 className="text-4xl font-black tracking-tighter text-black">
                        ${stats?.revenue?.toFixed(2) || '0.00'}
                    </h3>
                </div>

                {/* Ganancia Neta */}
                <div className="bg-black text-white border-4 border-black p-8 shadow-neo-lg group hover:-translate-y-2 transition-transform relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-neo-red opacity-20 -mr-12 -mt-12 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="w-12 h-12 bg-neo-red border-2 border-white flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-transform">
                            <TrendingUp size={24} className="text-white" />
                        </div>
                        <span className="flex items-center text-xs font-black text-neo-yellow uppercase">
                            <ArrowUpRight size={14} /> +8.5%
                        </span>
                    </div>
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1 relative z-10">Ganancia Neta (ROI)</p>
                    <h3 className="text-4xl font-black tracking-tighter text-white relative z-10">
                        ${stats?.netProfit?.toFixed(2) || '0.00'}
                    </h3>
                </div>

                {/* Margen Promedio */}
                <div className="bg-neo-green text-black border-4 border-black p-8 shadow-neo-lg group hover:-translate-y-2 transition-transform">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-black border-2 border-neo-green flex items-center justify-center rotate-[-3deg] group-hover:rotate-0 transition-transform">
                            <Target size={24} className="text-neo-green" />
                        </div>
                    </div>
                    <p className="text-xs font-black uppercase text-black/40 tracking-widest mb-1">Margen Objetivo</p>
                    <h3 className="text-4xl font-black tracking-tighter text-black">
                        {stats?.roi?.toFixed(1) || '0.0'}%
                    </h3>
                </div>

                {/* Pedidos Procesados */}
                <div className="bg-white border-4 border-black p-8 shadow-neo-lg group hover:-translate-y-2 transition-transform">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-blue-400 border-2 border-black flex items-center justify-center rotate-6 group-hover:rotate-0 transition-transform">
                            <Package size={24} className="text-white" />
                        </div>
                    </div>
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">Ventas Exitosas</p>
                    <h3 className="text-4xl font-black tracking-tighter text-black">
                        {Math.floor((stats?.revenue || 0) / 50) + 5}
                    </h3>
                </div>
            </div>

            {/* Visual Charts Simulation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Ventas Semanales */}
                <div className="lg:col-span-2 bg-white border-4 border-black p-8 shadow-neo relative">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <BarChart3 className="text-neo-red" /> Rendimiento Semanal
                        </h3>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 bg-black"></div>
                            <div className="w-3 h-3 bg-neo-red"></div>
                            <div className="w-3 h-3 bg-neo-yellow"></div>
                        </div>
                    </div>

                    {/* Fake Chart bars */}
                    <div className="h-64 flex items-end justify-between gap-4 px-4 border-b-4 border-black">
                        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div
                                    style={{ height: `${h}%` }}
                                    className={`w-full border-x-2 border-t-2 border-black transition-all ${h > 75 ? 'bg-neo-red' : h > 50 ? 'bg-neo-yellow' : 'bg-black'
                                        } group-hover:brightness-110 shadow-[4px_0_0_0_#000]`}
                                ></div>
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-2 py-1 text-[10px] font-black z-10">
                                    ${h * 15}
                                </div>
                                <p className="text-center mt-4 text-[10px] font-black uppercase text-slate-400">
                                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categorías más vendidas */}
                <div className="bg-white border-4 border-black p-8 shadow-neo">
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-10 flex items-center gap-3">
                        <PieChart className="text-neo-red" /> Los Favoritos
                    </h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Snacks', val: 45, color: 'bg-neo-red' },
                            { label: 'Bebidas', val: 30, color: 'bg-neo-yellow' },
                            { label: 'Papelería', val: 15, color: 'bg-neo-green' },
                            { label: 'Postres', val: 10, color: 'bg-blue-400' }
                        ].map((cat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-black uppercase text-black">{cat.label}</span>
                                    <span className="text-xs font-black text-slate-400">{cat.val}%</span>
                                </div>
                                <div className="h-4 border-2 border-black bg-slate-50 overflow-hidden">
                                    <div
                                        style={{ width: `${cat.val}%` }}
                                        className={`h-full border-r-2 border-black ${cat.color} transition-all duration-1000`}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-4 border-4 border-black border-dashed bg-slate-50">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Insight del día</p>
                        <p className="text-xs font-bold italic leading-relaxed">
                            &quot;Las ventas de <span className="text-neo-red font-black">Snacks</span> han subido un 15% los días Jueves. Considera aumentar el stock antes del mediodía.&quot;
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Final */}
            <div className="bg-black text-white border-4 border-black p-10 shadow-neo flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-neo-yellow"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 border-4 border-white bg-neo-red flex items-center justify-center rotate-12">
                        <Calendar size={32} className="text-white" />
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-black uppercase tracking-widest text-neo-yellow">Predicción IA</h3>
                        <p className="text-sm font-bold text-slate-400 uppercase max-w-sm">
                            Mañana se espera un aumento de demanda del <span className="text-white">20%</span> por el evento en la explanada.
                        </p>
                    </div>
                </div>
                <button className="relative z-10 px-8 py-4 bg-neo-yellow text-black font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0_0_#FFF] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
                    Generar Reporte PDF
                </button>
            </div>
        </div>
    );
}
