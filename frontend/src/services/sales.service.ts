import { api } from './api';

export interface RoiStats {
    investment: number;
    revenue: number;
    netProfit: number;
    roi: number;
}

export interface DailyHistory {
    id: string;
    saleDate: string;
    totalRevenue: string; // Decimal comes as string
    totalInvestment: string;
    profitMargin: string;
}

export const salesService = {
    /**
     * Obtener ROI y estadisticas financieras acumuladas
     */
    async getRoiStats(): Promise<RoiStats> {
        return api.get<RoiStats>('/sales/roi');
    },

    /**
     * Obtener historial de ventas diario para graficas
     */
    async getHistory(): Promise<DailyHistory[]> {
        return api.get<DailyHistory[]>('/sales/history');
    },

    /**
     * Obtener venta del día actual (para cierre)
     */
    async getToday(): Promise<any> {
        return api.get<any>('/sales/today');
    },

    /**
     * Obtener sugerencia de preparación (IA - IQR)
     */
    async getPrediction(): Promise<{ productName: string; suggested: number; confidence: number } | null> {
        return api.get<{ productName: string; suggested: number; confidence: number } | null>('/sales/prediction');
    },

    /**
     * Cerrar el día registrando mermas
     */
    async closeDay(items: { productId: string; waste: number }[]): Promise<void> {
        return api.post('/sales/close-day', { items });
    },
};
