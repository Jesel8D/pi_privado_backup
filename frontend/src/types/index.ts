/**
 * TienditaCampus - Tipos Globales
 */

// ── Users ───────────────────────────────────
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: 'admin' | 'seller' | 'buyer';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// ── Products ────────────────────────────────
export interface Category {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    isActive: boolean;
}

export interface Product {
    id: string;
    sellerId: string;
    categoryId?: string;
    name: string;
    description?: string;
    unitCost: number;
    salePrice: number;
    isPerishable: boolean;
    shelfLifeDays?: number;
    imageUrl?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// ── Sales ───────────────────────────────────
export interface DailySale {
    id: string;
    sellerId: string;
    saleDate: string;
    totalInvestment: number;
    totalRevenue: number;
    totalProfit: number;
    profitMargin?: number;
    unitsSold: number;
    unitsLost: number;
    notes?: string;
}

export interface SaleDetail {
    id: string;
    dailySaleId: string;
    productId: string;
    quantityPrepared: number;
    quantitySold: number;
    quantityLost: number;
    unitCost: number;
    unitPrice: number;
    subtotal: number;
}

// ── Reports ─────────────────────────────────
export interface WeeklyReport {
    id: string;
    sellerId: string;
    weekStart: string;
    weekEnd: string;
    totalInvestment: number;
    totalRevenue: number;
    totalProfit: number;
    avgProfitMargin: number;
    totalUnitsSold: number;
    totalUnitsLost: number;
    lossPercentage: number;
}

// ── API Response ────────────────────────────
export interface ApiResponse<T> {
    data: T;
    message?: string;
    statusCode: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
