import { api } from './api';

export interface BreakEvenRequest {
    productId: string;
    fixedCosts: number;
    unitCost?: number;
    unitPrice?: number;
}

export interface BreakEvenResult {
    productId: string;
    productName: string;
    fixedCosts: string;
    unitCost: string;
    unitPrice: string;
    unitMargin: string;
    breakEvenUnits: number;
    formula: string;
}

export interface WeeklyReport {
    id: string;
    weekStart: string;
    weekEnd: string;
    totalInvestment: string;
    totalRevenue: string;
    totalProfit: string;
    avgProfitMargin: string;
    totalUnitsSold: number;
    totalUnitsLost: number;
    lossPercentage: string;
    bestSellingProduct?: {
        id: string;
        name: string;
    } | null;
}

export interface DashboardPeriodComparison {
    current_start: string;
    current_end: string;
    current_revenue: string;
    current_investment: string;
    current_profit: string;
    previous_start: string;
    previous_end: string;
    previous_revenue: string;
    previous_investment: string;
    previous_profit: string;
}

export interface ProductProfitability {
    product_id: string;
    product_name: string;
    revenue: string;
    investment: string;
    profit: string;
    margin_pct: string;
}

export interface DashboardComparisonResponse {
    weekComparison: DashboardPeriodComparison | null;
    monthComparison: DashboardPeriodComparison | null;
    profitabilityByProduct: ProductProfitability[];
}

export const financeService = {
    async calculateBreakEven(payload: BreakEvenRequest): Promise<BreakEvenResult> {
        return api.post<BreakEvenResult>('/break-even/calculate', payload);
    },

    async getWeeklyReports(startWeek?: string, endWeek?: string): Promise<WeeklyReport[]> {
        const params: Record<string, string> = {};
        if (startWeek) params.startWeek = startWeek;
        if (endWeek) params.endWeek = endWeek;

        return api.get<WeeklyReport[]>('/reports/weekly', { params });
    },

    async generateWeeklyReport(weekStart?: string): Promise<WeeklyReport[]> {
        const params = weekStart ? { weekStart } : undefined;
        return api.post<WeeklyReport[]>('/reports/weekly/generate', undefined, { params });
    },

    async getDashboardComparison(startDate?: string, endDate?: string): Promise<DashboardComparisonResponse> {
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        return api.get<DashboardComparisonResponse>('/dashboard/comparison', { params });
    },
};
