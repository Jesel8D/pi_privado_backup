import { api } from './api';

export interface Product {
    id: string;
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

export interface CreateProductDto {
    name: string;
    description?: string;
    unitCost: number;
    salePrice: number;
    isPerishable?: boolean;
    shelfLifeDays?: number;
    imageUrl?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> { }

export const productsService = {
    /**
     * Obtener todos los productos del usuario
     */
    async getAll(): Promise<Product[]> {
        return api.get<Product[]>('/products');
    },

    /**
     * Obtener un producto por ID
     */
    async getById(id: string): Promise<Product> {
        return api.get<Product>(`/products/${id}`);
    },

    /**
     * Crear un nuevo producto
     */
    async create(data: CreateProductDto): Promise<Product> {
        return api.post<Product>('/products', data);
    },

    /**
     * Actualizar un producto existente
     */
    async update(id: string, data: UpdateProductDto): Promise<Product> {
        return api.patch<Product>(`/products/${id}`, data);
    },

    /**
     * Eliminar (soft delete) un producto
     */
    async delete(id: string): Promise<void> {
        return api.delete<void>(`/products/${id}`);
    },
};
