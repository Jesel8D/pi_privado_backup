/**
 * TienditaCampus - Cliente HTTP Base
 * 
 * Configuración centralizada para todas las llamadas al backend.
 * La URL del API se lee desde las variables de entorno.
 */

import { useAuthStore } from '../store/auth.store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
    requiresAuth?: boolean;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestOptions = {},
    ): Promise<T> {
        const { params, requiresAuth = true, ...fetchOptions } = options;

        let url = `${this.baseUrl}${endpoint}`;
        if (params) {
            const searchParams = new URLSearchParams(params);
            url += `?${searchParams.toString()}`;
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
        };

        // Inyectar token si existe
        if (requiresAuth) {
            const token = useAuthStore.getState().token;
            if (token) {
                (headers as any)['Authorization'] = `Bearer ${token}`;
            }
        }

        const response = await fetch(url, {
            ...fetchOptions,
            headers,
        });

        if (response.status === 401) {
            // Token expirado o inválido -> Logout
            useAuthStore.getState().logout();
            // Opcional: Redirigir a login, pero mejor manejarlo en la UI o middleware
        }

        if (!response.ok) {
            // Intentar leer mensaje de error del backend
            let errorMessage = `API Error: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData.message) {
                    errorMessage = Array.isArray(errorData.message)
                        ? errorData.message.join(', ')
                        : errorData.message;
                }
            } catch (e) {
                // Si no es JSON, usar texto status
            }
            throw new Error(errorMessage);
        }

        return response.json();
    }

    get<T>(endpoint: string, options?: RequestOptions) {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    post<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    put<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    delete<T>(endpoint: string, options?: RequestOptions) {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

export const api = new ApiClient(API_BASE_URL);
