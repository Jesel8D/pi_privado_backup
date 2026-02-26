'use client';

import { ShieldCheck, Search, ArrowDownToLine, Zap, Clock, Database, HardDrive, Loader2, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { benchmarkingService, QueryMetric } from '@/services/benchmarking.service';

export default function AuditPage() {
    const [search, setSearch] = useState('');
    const [metrics, setMetrics] = useState<QueryMetric[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadMetrics = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await benchmarkingService.getMetrics(30);
            setMetrics(data);
        } catch (err: any) {
            setError(err.message || 'Error al cargar métricas');
            setMetrics([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMetrics();
    }, []);

    const filteredMetrics = metrics.filter(m =>
        m.query?.toLowerCase().includes(search.toLowerCase())
    );

    const totalCalls = metrics.reduce((sum, m) => sum + (Number(m.calls) || 0), 0);
    const totalTime = metrics.reduce((sum, m) => sum + (Number(m.total_time_ms) || 0), 0);
    const totalRows = metrics.reduce((sum, m) => sum + (Number(m.rows_returned) || 0), 0);

    return (
        <div className="p-6 md:p-10 space-y-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-neo-red text-white px-4 py-1 border-2 border-black font-black uppercase text-xs tracking-widest shadow-neo-sm rotate-1">
                        <ShieldCheck size={16} /> Auditoría SQL
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                        MÉTRICAS <span className="text-neo-red">REALES</span>
                    </h1>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-tight max-w-lg border-l-4 border-black pl-4">
                        Datos generados en tiempo real por pg_stat_statements desde PostgreSQL.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={loadMetrics}
                        className="h-14 px-8 border-4 border-black bg-white font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all shadow-neo-sm flex items-center gap-2"
                    >
                        <RefreshCw size={18} /> ACTUALIZAR
                    </button>
                </div>
            </header>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
                    <input
                        type="text"
                        placeholder="BUSCAR POR CONSULTA SQL..."
                        className="w-full h-16 pl-14 pr-4 border-4 border-black font-black uppercase bg-white focus:bg-neo-yellow/10 focus:outline-none placeholder:text-slate-300"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="absolute inset-0 border-4 border-black translate-x-2 translate-y-2 -z-10 group-focus-within:translate-x-0 group-focus-within:translate-y-0 transition-transform bg-neo-yellow"></div>
                </div>
            </div>

            {/* Metrics Table */}
            <div className="bg-white border-4 border-black shadow-neo-lg overflow-hidden">
                <div className="grid grid-cols-12 bg-black text-white p-4 font-black uppercase text-[10px] tracking-[0.2em]">
                    <div className="col-span-5">Consulta SQL</div>
                    <div className="col-span-2 text-center">Llamadas</div>
                    <div className="col-span-2 text-center">Tiempo Total (ms)</div>
                    <div className="col-span-1 text-center">Promedio</div>
                    <div className="col-span-2 text-center">Filas</div>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                        <p className="font-black uppercase text-xs text-slate-400">Cargando métricas reales...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <p className="font-black uppercase text-xs text-neo-red">{error}</p>
                        <p className="text-xs text-slate-400 mt-2">Asegúrate de que pg_stat_statements esté habilitado.</p>
                    </div>
                ) : filteredMetrics.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="font-black uppercase text-xs text-slate-400">No hay métricas registradas. Usa el sistema para generar datos.</p>
                    </div>
                ) : (
                    <div className="divide-y-2 divide-black/10">
                        {filteredMetrics.map((metric, idx) => (
                            <div key={metric.id || idx} className="grid grid-cols-12 p-4 items-center hover:bg-slate-50 transition-colors group">
                                <div className="col-span-5">
                                    <code className="text-[11px] text-slate-600 break-all leading-tight">
                                        {metric.query}
                                    </code>
                                </div>
                                <div className="col-span-2 text-center">
                                    <span className="bg-neo-yellow/20 text-black border-2 border-black/10 px-3 py-1 font-black text-xs">
                                        {Number(metric.calls).toLocaleString()}
                                    </span>
                                </div>
                                <div className="col-span-2 text-center font-bold text-xs">
                                    {Number(metric.total_time_ms).toLocaleString()} ms
                                </div>
                                <div className="col-span-1 text-center font-bold text-xs text-slate-500">
                                    {Number(metric.avg_time_ms).toFixed(1)}
                                </div>
                                <div className="col-span-2 text-center font-bold text-xs">
                                    {Number(metric.rows_returned).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 border-4 border-black bg-slate-50 flex items-center gap-4">
                    <Zap size={24} className="text-neo-yellow" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400">Total Consultas</p>
                        <p className="text-2xl font-black">{totalCalls.toLocaleString()}</p>
                    </div>
                </div>
                <div className="p-6 border-4 border-black bg-slate-50 flex items-center gap-4">
                    <Clock size={24} className="text-neo-red" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400">Tiempo Total</p>
                        <p className="text-2xl font-black">{(totalTime / 1000).toFixed(1)}s</p>
                    </div>
                </div>
                <div className="p-6 border-4 border-black bg-slate-50 flex items-center gap-4">
                    <Database size={24} className="text-blue-500" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400">Filas Procesadas</p>
                        <p className="text-2xl font-black">{totalRows.toLocaleString()}</p>
                    </div>
                </div>
                <div className="p-6 border-4 border-black bg-black text-white flex items-center gap-4">
                    <HardDrive size={24} className="text-neo-red" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 opacity-50">Queries Únicas</p>
                        <p className="text-2xl font-black">{metrics.length}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
