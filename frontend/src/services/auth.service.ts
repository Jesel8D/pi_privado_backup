import { api } from './api';
import { useAuthStore } from '../store/auth.store';

// ── Tipos ─────────────────────────────────────────────

export interface LoginDto {
    email: string;
    password?: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'seller' | 'buyer';
    lastLoginAt?: string;
    loginCount?: number;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

export interface UserProfile extends User {
    phone?: string;
    avatarUrl?: string;
    isEmailVerified: boolean;
    createdAt: string;
}

// ── Servicio ──────────────────────────────────────────

export const authService = {
    /**
     * Iniciar sesión y guardar estado en store
     */
    async login(credentials: LoginDto): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', credentials, {
            requiresAuth: false,
        });

        // Guardar en store
        useAuthStore.getState().login(response.accessToken, response.user);

        return response;
    },

    /**
     * Registrarse y guardar estado (auto-login)
     */
    async register(data: RegisterDto): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data, {
            requiresAuth: false,
        });

        // Guardar en store
        useAuthStore.getState().login(response.accessToken, response.user);

        return response;
    },

    /**
     * Obtener perfil del usuario actual
     */
    async getProfile(): Promise<UserProfile> {
        const user = await api.get<UserProfile>('/auth/profile');

        // Actualizar usuario en store
        useAuthStore.getState().updateUser(user);

        return user;
    },

    /**
     * Cerrar sesión
     */
    logout() {
        useAuthStore.getState().logout();
    },
};
