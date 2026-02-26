'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    LogOut,
    ShoppingBag,
    ShoppingBasket,
    Menu,
    X,
    ShieldCheck,
    TrendingUp
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useState } from 'react';

const routes = [
    {
        label: 'Ver Tienda',
        icon: ShoppingBag,
        href: '/marketplace',
        color: 'bg-neo-yellow',
        roles: ['seller', 'admin', 'buyer'],
    },
    {
        label: 'Resumen',
        icon: LayoutDashboard,
        href: '/dashboard',
        color: 'bg-neo-yellow',
        roles: ['seller', 'admin'],
    },
    {
        label: 'Mi Inventario',
        icon: Package,
        href: '/products',
        color: 'bg-neo-red',
        roles: ['seller', 'admin'],
    },
    {
        label: 'Gestión Ventas',
        icon: ShoppingCart,
        href: '/sales',
        color: 'bg-neo-green',
        roles: ['seller', 'admin'],
    },
    {
        label: 'Reportes Pro',
        icon: BarChart3,
        href: '/reports',
        color: 'bg-blue-400',
        roles: ['seller', 'admin'],
    },
    {
        label: 'Configuración',
        icon: Settings,
        href: '/settings',
        color: 'bg-slate-300',
        roles: ['seller', 'admin'],
    },
    {
        label: 'Auditoría',
        icon: ShieldCheck,
        href: '/audit',
        color: 'bg-neo-red',
        roles: ['admin', 'seller', 'buyer'],
    },
    {
        label: 'Benchmarking',
        icon: TrendingUp,
        href: '/benchmarking',
        color: 'bg-neo-yellow',
        roles: ['admin', 'seller', 'buyer'],
    },
];

interface SidebarContentProps {
    pathname: string;
    logout: () => void;
    user: any;
    setOpen: (open: boolean) => void;
    filteredRoutes: typeof routes;
}

const SidebarContent = ({ pathname, logout, user, setOpen, filteredRoutes }: SidebarContentProps) => (
    <div className="flex flex-col h-full bg-white border-r-4 border-black p-4 font-display">
        {/* Header / Logo */}
        <Link href="/" className="flex items-center gap-3 mb-10 group" onClick={() => setOpen(false)}>
            <div className="bg-neo-red p-2 border-2 border-black shadow-[3px_3px_0_0_#000] rotate-[-5deg] group-hover:rotate-0 transition-transform">
                <ShoppingBasket className="h-6 w-6 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-black uppercase tracking-tighter leading-none text-black">
                    Tiendita
                </h1>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neo-red">
                    Campus Admin
                </span>
            </div>
        </Link>

        {/* User Info Brief */}
        <div className="mb-8 p-4 border-4 border-black bg-white relative group shadow-[4px_4px_0_0_#000]">
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-neo-yellow border-2 border-black rotate-12 -z-10 group-hover:rotate-0 transition-transform"></div>
            <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 shrink-0 border-2 border-black bg-black text-white flex items-center justify-center font-black text-lg uppercase shadow-[2px_2px_0_0_#fff]">
                    {user?.firstName?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col min-w-0">
                    <p className="font-black text-[11px] uppercase truncate text-black leading-tight">
                        {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                        Nivel {user?.role === 'admin' ? 'Master' : 'Vendedor'}
                    </p>
                </div>
            </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2">Menú Principal</p>
            {filteredRoutes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={`group flex items-center p-3 w-full font-black uppercase text-xs tracking-widest border-2 transition-all ${pathname === route.href
                        ? 'bg-black text-white border-black shadow-[4px_4px_0_0_#FFC72C] translate-x-[-2px] translate-y-[-2px]'
                        : 'bg-white text-black border-transparent hover:border-black hover:bg-slate-50'
                        }`}
                    onClick={() => setOpen(false)}
                >
                    <div className={`w-8 h-8 flex items-center justify-center border-2 border-black mr-3 transition-transform group-hover:rotate-[-5deg] ${pathname === route.href ? 'bg-white text-black' : `${route.color} text-black`}`}>
                        <route.icon className="h-4 w-4 shrink-0" />
                    </div>
                    {route.label}
                </Link>
            ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-auto space-y-2 pt-6 border-t-2 border-black border-dashed">
            <Link
                href="/marketplace"
                className="flex items-center p-3 w-full font-bold uppercase text-[10px] tracking-wider text-slate-600 hover:text-black hover:bg-neo-yellow/20 border-2 border-transparent hover:border-black transition-all"
                onClick={() => setOpen(false)}
            >
                <ShoppingBag className="h-4 w-4 mr-3" />
                Regresar a la Tienda
            </Link>
            <button
                onClick={() => { logout(); setOpen(false); }}
                className="flex items-center p-3 w-full font-black uppercase text-[10px] tracking-wider text-neo-red hover:bg-neo-red hover:text-white border-2 border-transparent hover:border-black transition-all group"
            >
                <LogOut className="h-4 w-4 mr-3 transition-transform group-hover:-translate-x-1" />
                Cerrar Sesión
            </button>
        </div>
    </div>
);

export function Sidebar() {
    const pathname = usePathname();
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const [open, setOpen] = useState(false);

    const filteredRoutes = routes.filter(route =>
        !user || route.roles.includes(user.role)
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex h-full w-72 flex-col fixed inset-y-0 z-50">
                <SidebarContent
                    pathname={pathname}
                    logout={logout}
                    user={user}
                    setOpen={setOpen}
                    filteredRoutes={filteredRoutes}
                />
            </aside>

            {/* Mobile Header/Menu */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b-4 border-black fixed top-0 left-0 right-0 z-50">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-neo-red p-1 border-2 border-black">
                        <ShoppingBasket className="h-5 w-5 text-white" />
                    </div>
                </Link>
                <button
                    onClick={() => setOpen(!open)}
                    className="p-2 border-2 border-black bg-neo-yellow shadow-[2px_2px_0_0_#000]"
                >
                    {open ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {open && (
                <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
                    <div className="w-72 h-full" onClick={e => e.stopPropagation()}>
                        <SidebarContent
                            pathname={pathname}
                            logout={logout}
                            user={user}
                            setOpen={setOpen}
                            filteredRoutes={filteredRoutes}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
