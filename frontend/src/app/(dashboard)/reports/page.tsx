'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    ArrowUpRight,
    DollarSign,
    Target,
    Package,
    Loader2,
    CalendarDays,
    RefreshCw,
    Trash2,
} from 'lucide-react';
import { salesService, RoiStats } from '@/services/sales.service';
import { ordersService, Order } from '@/services/orders.service';
import { financeService, WeeklyReport, DashboardComparisonResponse } from '@/services/finance.service';

export default function ReportsPage() {
    const [stats, setStats] = useState<RoiStats | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [comparison, setComparison] = useState<DashboardComparisonResponse | null>(null);
    const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>([]);
    const [weekdayAnalytics, setWeekdayAnalytics] = useState<Awaited<ReturnType<typeof salesService.getWeekdayAnalytics>>>([]);
    const [isGeneratingWeek, setIsGeneratingWeek] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [data, ordersData] = await Promise.all([
                    salesService.getRoiStats('', ''),
                    ordersService.getIncomingOrders(),
                ]);
                const [comparisonData, reportsData, weekdayData] = await Promise.all([
                    financeService.getDashboardComparison(),
                    financeService.getWeeklyReports(),
                    salesService.getWeekdayAnalytics(),
                ]);
                setStats(data);
                setOrders(ordersData);
                setComparison(comparisonData);
                setWeeklyReports(reportsData);
                setWeekdayAnalytics(weekdayData);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const toMoney = (value?: string | number) => Number(value || 0).toFixed(2);

    const handleGenerateWeekly = async () => {
        try {
            setIsGeneratingWeek(true);
            const generated = await financeService.generateWeeklyReport();
            setWeeklyReports(generated);
        } catch (error) {
            console.error(error);
        } finally {
            setIsGeneratingWeek(false);
        }
    };

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
                        {orders.filter(o => ['completed', 'delivered'].includes(o.status)).length}
                    </h3>
                </div>

                {/* Costo de Merma */}
                <div className="bg-white border-4 border-black p-8 shadow-neo-lg group hover:-translate-y-2 transition-transform">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-black border-2 border-black flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform">
                            <Trash2 size={24} className="text-neo-red" />
                        </div>
                    </div>
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">Costo de Merma Semanal</p>
                    <h3 className="text-4xl font-black tracking-tighter text-neo-red w-full truncate">
                        ${weeklyReports[0] ? toMoney(weeklyReports[0].totalWasteCost) : '0.00'}
                    </h3>
                </div>
            </div>

            {/* Visual Charts Simulation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Ventas Semanales */}
                <div className="lg:col-span-2 bg-white border-4 border-black p-8 shadow-neo relative">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 text-black">
                            <BarChart3 className="text-neo-red" /> Rendimiento Semanal
                        </h3>
                        <button
                            onClick={handleGenerateWeekly}
                            disabled={isGeneratingWeek}
                            className="flex items-center gap-2 border-2 border-black px-3 py-2 font-black uppercase text-[10px] text-black hover:bg-neo-yellow"
                        >
                            <RefreshCw size={14} className={isGeneratingWeek ? 'animate-spin' : ''} />
                            {isGeneratingWeek ? 'Generando...' : 'Regenerar semana'}
                        </button>
                    </div>

                    <div className="space-y-3">
                        {weeklyReports.slice(0, 4).map((report) => (
                            <div key={report.id} className="grid grid-cols-2 md:grid-cols-5 gap-3 border-2 border-black p-3 text-xs font-black uppercase text-black">
                                <div>
                                    <p className="text-black">Semana</p>
                                    <p>{report.weekStart} a {report.weekEnd}</p>
                                </div>
                                <div>
                                    <p className="text-black">Utilidad Neta</p>
                                    <p>${toMoney(report.totalProfit)}</p>
                                </div>
                                <div>
                                    <p className="text-black">U. Perdidas (%)</p>
                                    <p>{report.totalUnitsLost} ({toMoney(report.lossPercentage)}%)</p>
                                </div>
                                <div>
                                    <p className="text-black">Inv vs Ingreso</p>
                                    <p>${toMoney(report.totalInvestment)} / ${toMoney(report.totalRevenue)}</p>
                                </div>
                                <div className="text-neo-red">
                                    <p>Merma ($)</p>
                                    <p>${toMoney(report.totalWasteCost)}</p>
                                </div>
                            </div>
                        ))}
                        {weeklyReports.length === 0 && (
                            <p className="text-xs font-black uppercase text-black">No hay reportes semanales generados.</p>
                        )}
                    </div>
                </div>

                {/* Comparativo */}
                <div className="bg-white border-4 border-black p-8 shadow-neo text-black">
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-10 flex items-center gap-3">
                        <TrendingUp className="text-neo-red" /> Comparativo
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-xs font-black uppercase text-black">Semana (Utilidad vs Merma)</p>
                            <div className="flex justify-between text-sm font-black uppercase border-b-2 border-black/10 pb-1">
                                <span>Actual</span>
                                <div>
                                    <span className="text-black mr-4" title="Utilidad">${toMoney(comparison?.weekComparison?.current_profit)}</span>
                                    <span className="text-neo-red" title="Merma">-${toMoney(comparison?.weekComparison?.current_waste_cost)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm font-black uppercase">
                                <span>Anterior</span>
                                <div>
                                    <span className="text-black mr-4" title="Utilidad">${toMoney(comparison?.weekComparison?.previous_profit)}</span>
                                    <span className="text-neo-red" title="Merma">-${toMoney(comparison?.weekComparison?.previous_waste_cost)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 border-t-2 border-dashed border-black pt-4">
                            <p className="text-xs font-black uppercase text-black">Mes (Utilidad vs Merma)</p>
                            <div className="flex justify-between text-sm font-black uppercase border-b-2 border-black/10 pb-1">
                                <span>Actual</span>
                                <div>
                                    <span className="text-black mr-4" title="Utilidad">${toMoney(comparison?.monthComparison?.current_profit)}</span>
                                    <span className="text-neo-red" title="Merma">-${toMoney(comparison?.monthComparison?.current_waste_cost)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm font-black uppercase">
                                <span>Anterior</span>
                                <div>
                                    <span className="text-black mr-4" title="Utilidad">${toMoney(comparison?.monthComparison?.previous_profit)}</span>
                                    <span className="text-neo-red" title="Merma">-${toMoney(comparison?.monthComparison?.previous_waste_cost)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 p-4 border-4 border-black border-dashed bg-slate-50">
                        <p className="text-[10px] font-black uppercase text-black mb-2">Top rentabilidad</p>
                        {comparison?.profitabilityByProduct?.slice(0, 3).map((item) => (
                            <div key={item.product_id} className="flex justify-between text-xs font-black uppercase py-1 text-black">
                                <span className="truncate mr-2">{item.product_name}</span>
                                <div>
                                    <span className="text-neo-red mr-3" title="Merma">-${toMoney(item.total_waste_cost)}</span>
                                    <span className="text-black" title="Margen">{Number(item.margin_pct || 0).toFixed(2)}%</span>
                                </div>
                            </div>
                        ))}
                        {(!comparison?.profitabilityByProduct || comparison.profitabilityByProduct.length === 0) && (
                            <p className="text-xs font-bold italic leading-relaxed text-black">Sin productos con rentabilidad registrada.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white border-4 border-black p-8 shadow-neo text-black">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                    <BarChart3 className="text-neo-red" /> Ventas por Día de Semana
                </h3>
                <div className="space-y-3">
                    {weekdayAnalytics.map((item) => (
                        <div key={item.weekday} className="grid grid-cols-2 md:grid-cols-4 gap-3 border-2 border-black p-3 text-xs font-black uppercase text-black">
                            <span>{item.weekdayName}</span>
                            <span>Días: {item.daysCount}</span>
                            <span>Ingresos: ${toMoney(item.revenueSum)}</span>
                            <span>Unidades: {item.unitsSoldSum}</span>
                        </div>
                    ))}
                    {weekdayAnalytics.length === 0 && (
                        <p className="text-xs font-black uppercase text-black">Sin datos de ventas por día de semana.</p>
                    )}
                </div>
            </div>


        </div>
    );
}
