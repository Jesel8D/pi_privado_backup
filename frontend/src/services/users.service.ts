import { api } from './api';

export interface PublicUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    createdAt: string;
    role: 'seller' | 'buyer' | 'admin';
}

export const usersService = {
    /**
     * Obtener perfil público de un vendedor
     */
    async getPublicProfile(id: string): Promise<PublicUser> {
        return api.get<PublicUser>(`/users/public/${id}`, {
            requiresAuth: false
        });
    },
};
