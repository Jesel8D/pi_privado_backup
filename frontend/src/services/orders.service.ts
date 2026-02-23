import { api } from './api';
import { Product } from './products.service';

export interface Order {
    id: string;
    buyerId: string;
    sellerId: string;
    status: 'requested' | 'accepted' | 'rejected' | 'delivered';
    totalAmount: number;
    deliveryMessage?: string;
    deliveryLocation?: string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
    // Expand based on backend entity relations
    buyer?: { fullName: string; email: string };
    seller?: { fullName: string; email: string };
}

export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product?: Product;
}

export interface OrderItemDto {
    productId: string;
    quantity: number;
}

export interface CreateOrderDto {
    sellerId: string;
    items: OrderItemDto[];
    deliveryMessage?: string;
}

export const ordersService = {
    /**
     * Crear una nueva orden (Buyer)
     */
    async createOrder(data: CreateOrderDto): Promise<Order> {
        return api.post<Order>('/orders/purchase', data);
    },

    /**
     * Obtener compras del usuario (Buyer)
     */
    async getMyPurchases(): Promise<Order[]> {
        return api.get<Order[]>('/orders/my-purchases');
    },

    /**
     * Obtener ventas para gestionar (Seller)
     */
    async getIncomingOrders(): Promise<Order[]> {
        return api.get<Order[]>('/orders/seller-sales');
    },

    /**
     * Aceptar una orden (Seller)
     */
    async acceptOrder(id: string): Promise<Order> {
        return api.post<Order>(`/orders/${id}/accept`);
    },

    /**
     * Rechazar una orden (Seller)
     */
    async rejectOrder(id: string): Promise<Order> {
        return api.post<Order>(`/orders/${id}/reject`);
    },

    /**
     * Marcar como entregada (Seller o Buyer)
     */
    async markAsDelivered(id: string): Promise<Order> {
        return api.post<Order>(`/orders/${id}/deliver`);
    }
};
