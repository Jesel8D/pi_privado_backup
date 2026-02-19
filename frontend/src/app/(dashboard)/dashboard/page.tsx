'use client';

import { useEffect, useState } from 'react';
import {
    DollarSign,
    Package,
    TrendingUp,
    PieChart,
    AlertCircle,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { salesService, RoiStats, DailySale } from '@/services/sales.service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import { CloseDayDialog } from '@/components/sales/close-day-dialog';

export default function DashboardPage() {
    const [stats, setStats] = useState<RoiStats | null>(null);
    const [history, setHistory] = useState<DailySale[]>([]);
    const [prediction, setPrediction] = useState<{ productName: string; suggested: number; confidence: number } | null>(null);
    const [loading, setLoading] = useState(true);

    const loadDashboardData = async () => {
        try {
            const [statsData, historyData, predictionData] = await Promise.all([
                salesService.getRoiStats(),
                salesService.getHistory(),
                salesService.getPrediction()
            ]);
            setStats(statsData);
            setHistory(historyData);
            setPrediction(predictionData);
        } catch (error) {
            console.error("Error loading dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center p-8">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    // Preparar datos para el gráfico
    const chartData = history.map(day => ({
        date: new Date(day.saleDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }),
        Ventas: parseFloat(String(day.totalRevenue)),
        Inversión: parseFloat(String(day.totalInvestment)),
    }));

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Financiero</h2>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 hidden sm:inline-block">
                        {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <CloseDayDialog onClosed={loadDashboardData} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Revenue Card */}
                <Card className="hover-card border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Ingresos Totales (Ventas)
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            ${stats?.revenue.toFixed(2) || '0.00'}
                        </div>
                    </CardContent>
                </Card>

                {/* Investment Card */}
                <Card className="hover-card border-l-4 border-l-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Inversión Total (Costo)
                        </CardTitle>
                        <Package className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            ${stats?.investment.toFixed(2) || '0.00'}
                        </div>
                    </CardContent>
                </Card>

                {/* Net Profit Card */}
                <Card className="hover-card border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Ganancia Neta
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${(stats?.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${stats?.netProfit.toFixed(2) || '0.00'}
                        </div>
                    </CardContent>
                </Card>

                {/* ROI Card */}
                <Card className="hover-card border-l-4 border-l-violet-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            ROI (Rentabilidad)
                        </CardTitle>
                        <PieChart className="h-4 w-4 text-violet-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {stats?.roi.toFixed(1) || '0.0'}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Retorno sobre la inversión
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                <Card className="col-span-4 hover-card">
                    <CardHeader>
                        <CardTitle>Historial de Rentabilidad (Ventas vs Inversión)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {chartData.length > 0 ? (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                        <Tooltip
                                            formatter={(value) => [`$${value}`, '']}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="Inversión" fill="#f97316" radius={[4, 4, 0, 0]} name="Inversión" />
                                        <Bar dataKey="Ventas" fill="#2563eb" radius={[4, 4, 0, 0]} name="Ventas" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
                                <AlertCircle className="w-8 h-8 mb-2 text-gray-400" />
                                <p>No hay datos suficientes para mostrar la gráfica.</p>
                                <p className="text-sm">Registra ventas e inventario para ver tu progreso.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Suggestions / Predictions (HU-03) */}
                <Card className="col-span-3 hover-card bg-gradient-to-br from-violet-50 to-white border-violet-100">
                    <CardHeader>
                        <CardTitle className="text-violet-900 flex items-center gap-2">
                            <TrendingUp size={20} />
                            Sugerencia del Día (IA)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {prediction ? (
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-violet-100">
                                    <div className="bg-violet-100 p-2 rounded-lg text-violet-600">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Prepara más {prediction.productName}</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Basado en tus ventas históricas de los {new Date().toLocaleDateString('es-MX', { weekday: 'long' })}s,
                                            el algoritmo sugiere preparar:
                                        </p>
                                        <p className="text-2xl font-bold text-violet-600 mt-2">
                                            {prediction.suggested} unidades
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Confianza estadística: {(prediction.confidence * 100).toFixed(0)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-6 text-gray-500">
                                <AlertCircle className="w-8 h-8 mb-2 text-gray-300" />
                                <p>Aún no tenemos suficientes datos para generar predicciones.</p>
                                <p className="text-xs mt-1">Sigue registrando tus ventas diarias.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
