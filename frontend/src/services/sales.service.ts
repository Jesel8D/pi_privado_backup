import { api } from './api';
import { Product } from './products.service';

export interface DailySale {
    id: string;
    saleDate: string;
    totalInvestment: number;
    totalRevenue: number;
    totalProfit: number;
    profitMargin: number;
    unitsSold: number;
    unitsLost: number;
    details: SaleDetail[];
}

export interface SaleDetail {
    id: string;
    productId: string;
    product: Product;
    quantityPrepared: number;
    quantitySold: number;
    quantityLost: number;
    unitCost: number;
    unitPrice: number;
    subtotal: number;
}

export interface PrepareSaleItem {
    productId: string;
    quantityPrepared: number;
}

export const salesService = {
    /**
     * Obtener el registro de ventas del día actual
     */
    async getToday(): Promise<DailySale | null> {
        return api.get<DailySale | null>('/sales/today');
    },

    /**
     * Inicializar el día con los productos llevados
     */
    async prepareDay(items: PrepareSaleItem[]): Promise<DailySale> {
        return api.post<DailySale>('/sales/prepare', { items });
    },

    /**
     * Registrar venta o merma de un producto
     */
    async trackProduct(productId: string, quantitySold: number, quantityLost: number): Promise<DailySale> {
        return api.post<DailySale>('/sales/track', {
            productId,
            quantitySold,
            quantityLost
        });
    }
};
