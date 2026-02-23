'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    LogOut,
    User,
    ShoppingBasket,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
    const pathname = usePathname();
    const { user, logout, isAuthenticated, _hasHydrated } = useAuthStore();
    const [mobileOpen, setMobileOpen] = useState(false);

    // No mostrar la Navbar en el Dashboard de Seller (usa Sidebar propia)
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/products') || pathname.startsWith('/sales') || pathname.startsWith('/reports') || pathname.startsWith('/settings') || pathname.startsWith('/audit')) return null;

    const isBuyer = user?.role === 'buyer';
    const isSeller = user?.role === 'seller' || user?.role === 'admin';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black font-display">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-neo-red p-1.5 border-2 border-black shadow-[2px_2px_0_0_#000] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
                            <ShoppingBasket className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-black uppercase tracking-tight text-black">
                            TienditaCampus
                        </span>
                    </Link>

                    {/* Links Centro - Desktop */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link
                            href="/marketplace"
                            className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all border-2 ${pathname === '/marketplace'
                                ? 'bg-neo-yellow text-black border-black shadow-[2px_2px_0_0_#000]'
                                : 'bg-transparent text-black border-transparent hover:border-black hover:bg-neo-yellow/30'
                                }`}
                        >
                            <span className="flex items-center gap-1.5">
                                <ShoppingBag className="w-4 h-4" /> Tienda
                            </span>
                        </Link>
                        {isAuthenticated && isBuyer && (
                            <Link
                                href="/buyer/dashboard"
                                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all border-2 ${pathname.startsWith('/buyer')
                                    ? 'bg-neo-yellow text-black border-black shadow-[2px_2px_0_0_#000]'
                                    : 'bg-transparent text-black border-transparent hover:border-black hover:bg-neo-yellow/30'
                                    }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <Package className="w-4 h-4" /> Mis Pedidos
                                </span>
                            </Link>
                        )}
                        {isAuthenticated && isSeller && (
                            <Link
                                href="/dashboard"
                                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all border-2 bg-transparent text-black border-transparent hover:border-black hover:bg-neo-red/10`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <LayoutDashboard className="w-4 h-4" /> Panel Vendedor
                                </span>
                            </Link>
                        )}
                    </div>

                    {/* Botones Derecha - Desktop */}
                    <div className="hidden md:flex items-center gap-3">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    href="/login"
                                    className="px-5 py-2 text-sm font-bold uppercase tracking-wider text-black border-2 border-black hover:bg-black hover:text-white transition-all"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-5 py-2 text-sm font-bold uppercase tracking-wider text-white bg-neo-red border-2 border-black shadow-[3px_3px_0_0_#FFC72C] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                                >
                                    Crear Cuenta
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-black bg-neo-yellow/20">
                                    <div className="w-7 h-7 bg-neo-red border-2 border-black flex items-center justify-center text-white font-black text-xs">
                                        {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-sm font-bold text-black hidden sm:inline">{user?.firstName}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="px-3 py-2 text-sm font-bold uppercase text-black border-2 border-black hover:bg-neo-red hover:text-white transition-all"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 border-2 border-black"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t-4 border-black bg-white">
                    <div className="flex flex-col p-4 gap-2">
                        <Link href="/marketplace" onClick={() => setMobileOpen(false)} className="px-4 py-3 font-bold uppercase text-sm border-2 border-black bg-neo-yellow/20 hover:bg-neo-yellow transition-colors">
                            <span className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Tienda</span>
                        </Link>
                        {isAuthenticated && isBuyer && (
                            <Link href="/buyer/dashboard" onClick={() => setMobileOpen(false)} className="px-4 py-3 font-bold uppercase text-sm border-2 border-black hover:bg-neo-yellow/20 transition-colors">
                                <span className="flex items-center gap-2"><Package className="w-4 h-4" /> Mis Pedidos</span>
                            </Link>
                        )}
                        {isAuthenticated && isSeller && (
                            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="px-4 py-3 font-bold uppercase text-sm border-2 border-black hover:bg-neo-red/10 transition-colors">
                                <span className="flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Panel Vendedor</span>
                            </Link>
                        )}
                        <hr className="border-2 border-black my-2" />
                        {!isAuthenticated ? (
                            <>
                                <Link href="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 font-bold uppercase text-sm text-center border-2 border-black hover:bg-black hover:text-white transition-colors">
                                    Entrar
                                </Link>
                                <Link href="/register" onClick={() => setMobileOpen(false)} className="px-4 py-3 font-bold uppercase text-sm text-center border-2 border-black bg-neo-red text-white hover:bg-red-700 transition-colors">
                                    Crear Cuenta
                                </Link>
                            </>
                        ) : (
                            <button onClick={() => { logout(); setMobileOpen(false); }} className="px-4 py-3 font-bold uppercase text-sm text-center border-2 border-black text-neo-red hover:bg-neo-red hover:text-white transition-colors">
                                <span className="flex items-center justify-center gap-2"><LogOut className="w-4 h-4" /> Cerrar Sesión</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
