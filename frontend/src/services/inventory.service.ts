import { api } from './api';

export interface InventoryRecord {
    id: string;
    productId: string;
    recordDate: string;
    quantityInitial: number;
    quantityRemaining: number;
    investmentAmount: number;
    status: 'active' | 'sold_out' | 'expired' | 'closed';
    createdAt: string;
}

export interface CreateInventoryDto {
    productId: string;
    quantity: number;
    unitCost: number;
    recordDate?: string;
}

export const inventoryService = {
    /**
     * Agregar stock a un producto
     */
    async addStock(data: CreateInventoryDto): Promise<InventoryRecord> {
        return api.post<InventoryRecord>('/inventory', data);
    },

    /**
     * Obtener historial de inventario de un producto
     */
    async getHistory(productId: string): Promise<InventoryRecord[]> {
        return api.get<InventoryRecord[]>(`/inventory/product/${productId}`);
    },
};
