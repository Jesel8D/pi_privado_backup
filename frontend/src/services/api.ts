/**
 * TienditaCampus - Cliente HTTP Base
 * 
 * Configuración centralizada para todas las llamadas al backend.
 * Asegura que las variables de entorno estén presentes y normaliza las respuestas/errores.
 */

import { useAuthStore } from '../store/auth.store';

// 1. Validación de Entorno
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
    console.warn(
        '⚠️ ATENCIÓN: La variable NEXT_PUBLIC_API_URL no está definida. Se usará http://localhost:3001/api como fallback. Asegúrate de configurar tu archivo .env.local',
    );
}

const BASE_URL = API_BASE_URL || 'http://localhost:3001/api';

// 2. Clase de Error Normalizada
export class ApiError extends Error {
    public status: number;
    public data: any;

    constructor(status: number, message: string, data?: any) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

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

        // Configuración de Headers segura
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(fetchOptions.headers as Record<string, string>),
        };

        // Inyectar token si existe y se requiere
        if (requiresAuth) {
            const token = useAuthStore.getState().token;
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                headers,
            });

            // Manejo de 401: Sesión expirada
            if (response.status === 401) {
                useAuthStore.getState().logout();
                throw new ApiError(401, 'Sesión expirada. Por favor, inicia sesión nuevamente.');
            }

            // Normalización de Errores (4xx, 5xx)
            if (!response.ok) {
                let errorMessage = `API Error: ${response.status} ${response.statusText}`;
                let errorData = null;

                try {
                    errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMessage = Array.isArray(errorData.message)
                            ? errorData.message.join(', ')
                            : errorData.message;
                    }
                } catch (e) {
                    // Si no es JSON, nos quedamos con el mensaje genérico
                }

                throw new ApiError(response.status, errorMessage, errorData);
            }

            // Respuesta exitosa (siempre intenta parsear JSON, o retorna null si está vacío)
            if (response.status === 204) {
                return {} as T;
            }

            const text = await response.text();
            if (!text || text.length === 0) {
                return null as T;
            }

            try {
                return JSON.parse(text);
            } catch {
                return text as unknown as T;
            }

        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            // Error de red o algo inesperado en el fetch
            throw new ApiError(500, error instanceof Error ? error.message : 'Error desconocido de red');
        }
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

    patch<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    delete<T>(endpoint: string, options?: RequestOptions) {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

export const api = new ApiClient(BASE_URL);
