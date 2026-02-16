'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated, token } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Verificación simple de cliente.
        // Si no hay token o no está autenticado, redirigir a login.
        if (!token && !isAuthenticated) {
            router.push('/login');
        } else {
            setIsChecking(false);
        }
    }, [token, isAuthenticated, router]);

    if (isChecking) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* TODO: Sidebar y Header aquí */}
            <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-6 shadow-sm">
                <h1 className="text-xl font-bold">TienditaCampus</h1>
                <div className="ml-auto">
                    {/* User dropdown placeholder */}
                    <button onClick={() => { useAuthStore.getState().logout(); router.push('/login'); }} className="text-sm text-red-500 hover:underline">Cerrar Sesión</button>
                </div>
            </header>
            <main className="p-6">{children}</main>
        </div>
    );
}
