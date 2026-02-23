'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
import { Loader2 } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar'; // Import local component

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated, token, user, _hasHydrated } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!_hasHydrated) return; // Wait for localStorage to inject the token

        // Validación de autenticación y rol
        if (!token || !isAuthenticated || !user) {
            router.push('/login');
        } else if (user.role === 'buyer') {
            router.push('/buyer/dashboard');
        } else {
            setIsChecking(false);
        }
    }, [token, isAuthenticated, user, router, _hasHydrated]);

    if (isChecking || !_hasHydrated) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar />
            </div>
            <main className="md:pl-72 pb-10">
                {/* Mobile Header could go here */}
                {children}
            </main>
        </div>
    );
}
