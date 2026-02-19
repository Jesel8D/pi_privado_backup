'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utils exists, otherwise I'll need to create it or remove cn usage
import { useAuthStore } from '../../store/auth.store';

const routes = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        color: 'text-sky-500',
    },
    {
        label: 'Inventario',
        icon: Package,
        href: '/products',
        color: 'text-violet-500',
    },
    {
        label: 'Ventas',
        icon: ShoppingCart,
        href: '/sales',
        color: 'text-pink-700',
    },
    {
        label: 'Reportes',
        icon: BarChart3,
        href: '/reports',
        color: 'text-orange-700',
    },
    {
        label: 'Configuración',
        icon: Settings,
        href: '/settings',
        color: 'text-gray-500',
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const logout = useAuthStore((state) => state.logout);

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-card text-card-foreground border-r border-border shadow-xl">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative h-8 w-8 mr-4">
                        {/* Logo placeholder */}
                        <div className="h-full w-full bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                            TC
                        </div>
                    </div>
                    <h1 className="text-xl font-bold">
                        TienditaCampus
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn( // Using simple template literal if cn is missing
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition duration-300",
                                pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2">
                <button
                    onClick={() => logout()}
                    className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-destructive hover:bg-destructive/10 rounded-lg transition duration-300 text-muted-foreground"
                >
                    <div className="flex items-center flex-1">
                        <LogOut className="h-5 w-5 mr-3 text-destructive" />
                        Cerrar Sesión
                    </div>
                </button>
            </div>
        </div>
    );
}
