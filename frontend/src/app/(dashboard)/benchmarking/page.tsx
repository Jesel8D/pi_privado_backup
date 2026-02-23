'use client';

import { useState, useEffect } from 'react';
import {
    Activity,
    Send,
    Database,
    Play,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Globe,
    BarChart3,
    Zap,
    History
} from 'lucide-react';
import { benchmarkingService } from '@/services/benchmarking.service';
import { toast } from 'sonner';
import { useGoogleLogin } from '@react-oauth/google';

export default function BenchmarkingPage() {
    const [projectId, setProjectId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRunningQueries, setIsRunningQueries] = useState(false);
    const [lastStatus, setLastStatus] = useState<string | null>(null);

    useEffect(() => {
        loadProject();
    }, []);

    const loadProject = async () => {
        try {
            const data = await benchmarkingService.getProject();
            setProjectId(data.project_id);
        } catch (error) {
            console.error('Error al cargar proyecto', error);
        }
    };

    const handleRunQueries = async () => {
        setIsRunningQueries(true);
        try {
            await benchmarkingService.runQueries();
            toast.success('¡TRÁFICO GENERADO!', {
                description: 'Las consultas de benchmarking se ejecutaron con éxito.'
            });
            setLastStatus('Consultas ejecutadas - Métricas listas en pg_stat_statements');
        } catch (error) {
            toast.error('Error al ejecutar consultas');
        } finally {
            setIsRunningQueries(false);
        }
    };

    // OAuth Login & BigQuery Upload
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                const response = await benchmarkingService.sendSnapshot(tokenResponse.access_token) as any;
                toast.success('¡SNAPSHOT ENVIADO!', {
                    description: `Se enviaron ${response.count} métricas al almacén de BigQuery.`
                });
                setLastStatus(`Exitoso: ${new Date().toLocaleTimeString()}`);
            } catch (error: any) {
                toast.error('Error al enviar snapshot', {
                    description: error.response?.data?.message || error.message
                });
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            toast.error('Fallo en la autenticación con Google');
        },
        scope: 'https://www.googleapis.com/auth/bigquery'
    });

    return (
        <div className="p-4 md:p-10 space-y-10 font-display min-h-screen bg-neo-white selection:bg-neo-red selection:text-white pb-24">
            {/* Header Neo-Brutalista */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b-4 border-black pb-8">
                <div className="space-y-4">
                    <div className="inline-block bg-neo-yellow text-black border-2 border-black px-3 py-1 font-black uppercase text-xs tracking-widest shadow-neo-sm transform -rotate-1 mb-2">
                        EVALUACIÓN UNIDAD 2 / BENCHMARKING
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-black">
                        METRICS <span className="text-neo-red">LAB</span>
                    </h1>
                    <p className="text-lg font-bold text-slate-500 uppercase tracking-tight max-w-md border-l-4 border-black pl-4">
                        Centro de control para ejecución de pruebas y exportación a BigQuery.
                    </p>
                </div>
                <div className="bg-black text-white border-4 border-black p-4 rotate-2 shadow-neo-red">
                    <p className="font-black uppercase text-xs">Project ID: {projectId || '...'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Panel Izquierdo: Acciones principales */}
                <div className="lg:col-span-12 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* CARD 1: Generar Tráfico */}
                        <div className="bg-white border-4 border-black p-8 shadow-neo-lg space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform">
                                <Zap size={120} />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-neo-yellow border-2 border-black flex items-center justify-center -rotate-3">
                                    <Play className="text-black" size={24} />
                                </div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter">Estresar Sistema</h2>
                            </div>
                            <p className="font-bold text-slate-500 uppercase text-xs leading-relaxed">
                                Ejecuta el catálogo formal de consultas registradas en la base de datos para acumular métricas de rendimiento en pg_stat_statements.
                            </p>
                            <button
                                onClick={handleRunQueries}
                                disabled={isRunningQueries}
                                className="w-full py-4 bg-neo-red text-white font-black uppercase border-4 border-black shadow-[6px_6px_0_0_#000] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isRunningQueries ? <Loader2 className="animate-spin" /> : <Play size={20} />}
                                EJECUTAR QUERIES
                            </button>
                        </div>

                        {/* CARD 2: Snapshot y BigQuery */}
                        <div className="bg-neo-green/10 border-4 border-black p-8 shadow-neo-lg space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:-rotate-12 transition-transform">
                                <Globe size={120} />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-neo-green border-2 border-black flex items-center justify-center rotate-6">
                                    <Send className="text-black" size={24} />
                                </div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter">Snapshot Diario</h2>
                            </div>
                            <p className="font-bold text-slate-500 uppercase text-xs leading-relaxed">
                                Captura las métricas consolidadas del periodo y envíalas al almacén central en BigQuery. Requiere autenticación con Google.
                            </p>
                            <button
                                onClick={() => login()}
                                disabled={isLoading}
                                className="w-full py-4 bg-black text-white font-black uppercase border-4 border-black shadow-[6px_6px_0_0_#FFC72C] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <Globe size={20} className="text-neo-yellow" />}
                                ENVIAR A BIGQUERY
                            </button>
                        </div>

                    </div>

                    {/* Dashboard de Estado */}
                    <div className="bg-white border-4 border-black p-8 shadow-neo space-y-6">
                        <div className="flex items-center justify-between border-b-2 border-black border-dashed pb-4">
                            <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                                <Activity className="text-neo-red" size={20} />
                                Estatus Experimental
                            </h3>
                            <div className={`px-4 py-1 border-2 border-black font-black text-[10px] uppercase tracking-widest ${lastStatus ? 'bg-neo-green text-black' : 'bg-neo-red text-white'}`}>
                                {lastStatus ? 'METRICS READY' : 'WAITING FOR DATA'}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Database size={12} /> Persistencia Local
                                </p>
                                <p className="text-sm font-bold text-black border-l-4 border-black pl-4">
                                    Conectado a PostgreSQL 16 <br />
                                    Esquema: Benchmarking v2.1
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <History size={12} /> Última Actividad
                                </p>
                                <p className="text-sm font-bold text-black border-l-4 border-black pl-4 uppercase">
                                    {lastStatus || 'No hay registros en la sesión actual'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-slate-50 border-2 border-black flex items-start gap-4 italic text-xs font-bold text-slate-500">
                            <AlertCircle className="shrink-0 text-neo-red" size={16} />
                            <p>
                                IMPORTANTE: No reinicies las estadísticas manualmente antes de enviar el snapshot. El sistema ejecutará el reset automático solo tras confirmar la recepción exitosa en BigQuery.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
