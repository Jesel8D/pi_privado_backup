import { api } from './api';

export interface RoiStats {
    investment: number;
    revenue: number;
    netProfit: number;
    roi: number;
}

// Re-export DailyHistory as DailySale to match component usage or define a separate one if needed.
// Based on usage in SalesPage: DailySale has details[], totalRevenue, etc.
// The interface DailyHistory defined here seems to match the "History" list, not the "Today" full details.
// Let's verify what getToday returns. It returns "any" in the code, but used as DailySale in SalesPage.
// To fix the build error, we need to export DailySale.

export interface SaleDetail {
    id: string;
    productId: string;
    quantityPrepared: number;
    quantitySold: number;
    quantityLost: number;
    unitPrice: number;
    product: {
        id: string;
        name: string;
    };
}

export interface DailySale {
    id: string;
    saleDate: string;
    totalRevenue: number | string;
    totalInvestment: number | string;
    unitsSold: number;
    unitsLost: number;
    isClosed: boolean;
    details: SaleDetail[];
}

export interface PrepareSaleItem {
    productId: string;
    quantityPrepared: number;
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
    async getHistory(): Promise<DailySale[]> {
        return api.get<DailySale[]>('/sales/history');
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
     * Iniciar el día (preparación)
     */
    async prepareDay(items: PrepareSaleItem[]): Promise<DailySale> {
        return api.post<DailySale>('/sales/prepare', { items });
    },

    /**
     * Registrar venta/merma individual (tracking)
     */
    async trackProduct(productId: string, sold: number, lost: number): Promise<DailySale> {
        return api.patch<DailySale>(`/sales/track/${productId}`, { quantitySold: sold, quantityLost: lost });
    },

    /**
     * Cerrar el día registrando mermas
     */
    async closeDay(items: { productId: string; waste: number }[]): Promise<void> {
        return api.post('/sales/close-day', { items });
    },
};
