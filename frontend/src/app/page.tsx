'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    BarChart3,
    Package,
    TrendingUp,
    ShieldCheck,
    ArrowRight,
    Store,
    Users,
    Zap,
    ChevronDown,
    Menu,
    X,
} from 'lucide-react';
import { Button } from '../components/ui/button';

/* ───────── Navbar ───────── */
function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-border'
                    : 'bg-transparent'
                }`}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/30 group-hover:shadow-lg group-hover:shadow-primary/40 transition-all">
                        TC
                    </div>
                    <span className="text-lg font-bold text-text tracking-tight">
                        TienditaCampus
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden items-center gap-8 md:flex">
                    <Link href="/marketplace" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-1">
                        <Store size={16} />
                        Tienda
                    </Link>
                    <a href="#features" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                        Funciones
                    </a>
                    <a href="#stats" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                        Impacto
                    </a>
                </div>

                {/* Desktop CTAs */}
                <div className="hidden items-center gap-3 md:flex">
                    <Link href="/login">
                        <Button variant="ghost" className="text-sm font-semibold">
                            Iniciar Sesión
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button className="text-sm font-semibold shadow-md shadow-primary/25">
                            Comenzar Gratis
                        </Button>
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden p-2 text-text-secondary hover:text-text transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-border animate-slide-up">
                    <div className="flex flex-col gap-1 px-6 py-4">
                        <Link href="/marketplace" onClick={() => setMobileOpen(false)} className="py-2.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-2">
                            <Store size={18} /> Tienda / Marketplace
                        </Link>
                        <a href="#features" onClick={() => setMobileOpen(false)} className="py-2.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                            Funciones
                        </a>
                        <a href="#stats" onClick={() => setMobileOpen(false)} className="py-2.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                            Impacto
                        </a>
                        <a href="#cta" onClick={() => setMobileOpen(false)} className="py-2.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                            Únete
                        </a>
                        <div className="mt-3 flex flex-col gap-2">
                            <Link href="/login">
                                <Button variant="outline" className="w-full">Iniciar Sesión</Button>
                            </Link>
                            <Link href="/register">
                                <Button className="w-full">Comenzar Gratis</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

/* ───────── Feature Card ───────── */
function FeatureCard({
    icon: Icon,
    title,
    description,
    gradient,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    gradient: string;
}) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
            <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={26} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-text">{title}</h3>
            <p className="text-sm leading-relaxed text-text-secondary">{description}</p>
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />
        </div>
    );
}

/* ───────── Stat Counter ───────── */
function StatItem({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center">
            <div className="text-4xl font-extrabold text-white md:text-5xl">{value}</div>
            <div className="mt-1.5 text-sm font-medium text-white/70">{label}</div>
        </div>
    );
}

/* ───────── Page ───────── */
export default function Home() {
    // Registrar Service Worker para PWA
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('SW registrado:', registration.scope);
                })
                .catch((error) => {
                    console.error('Error al registrar SW:', error);
                });
        }
    }, []);

    return (
        <>
            <Navbar />

            {/* ─── Hero ─── */}
            <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16">
                {/* Background decorations */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -bottom-20 -right-40 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-3xl" />
                    <div className="absolute left-1/2 top-1/4 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-success/5 blur-3xl" />
                </div>

                <div className="relative z-10 mx-auto max-w-4xl text-center animate-fade-in">
                    {/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
                        <Zap size={14} />
                        Plataforma para vendedores universitarios
                    </div>

                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-text sm:text-5xl md:text-6xl lg:text-7xl">
                        Gestiona tu negocio{' '}
                        <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                            dentro del campus
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
                        Herramientas digitales que te ayudan a entender tu rentabilidad real,
                        reducir pérdidas y tomar mejores decisiones de inventario.
                    </p>

                    {/* CTAs */}
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link href="/marketplace">
                            <Button size="lg" className="group gap-2 text-base font-bold shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all px-8 bg-blue-600 hover:bg-blue-700">
                                <Store size={18} />
                                Explorar Tienda
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button variant="outline" size="lg" className="group gap-2 text-base font-bold px-8">
                                Comenzar Gratis
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <a
                    href="#features"
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-text-secondary/50 hover:text-primary transition-colors animate-bounce"
                >
                    <span className="text-[10px] font-medium uppercase tracking-widest">Descubre más</span>
                    <ChevronDown size={18} />
                </a>
            </section>

            {/* ─── Features ─── */}
            <section id="features" className="relative bg-bg py-24 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
                            Funciones Principales
                        </p>
                        <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
                            Todo lo que necesitas para vender mejor
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-text-secondary">
                            Diseñado específicamente para las necesidades de vendedores dentro del campus universitario.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <FeatureCard
                            icon={BarChart3}
                            title="Rentabilidad Real"
                            description="Calcula automáticamente tus márgenes de ganancia diarios y semanales. Sabe exactamente cuánto ganas por cada producto."
                            gradient="bg-gradient-to-br from-primary to-blue-600"
                        />
                        <FeatureCard
                            icon={Package}
                            title="Control de Inventario"
                            description="Registra productos perecederos, controla fechas de vencimiento y minimiza las pérdidas por caducidad."
                            gradient="bg-gradient-to-br from-secondary to-orange-600"
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="Reportes Semanales"
                            description="Visualiza tu progreso con reportes automatizados. Identifica tendencias y toma decisiones informadas."
                            gradient="bg-gradient-to-br from-success to-emerald-600"
                        />
                    </div>
                </div>
            </section>

            {/* ─── Stats ─── */}
            <section id="stats" className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-blue-600 py-20 px-6">
                {/* Decorative circles */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/5" />
                    <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5" />
                </div>

                <div className="relative z-10 mx-auto max-w-5xl">
                    <div className="mb-14 text-center">
                        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-white/60">
                            Nuestro Impacto
                        </p>
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            Números que hablan por sí solos
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        <StatItem value="50+" label="Vendedores Activos" />
                        <StatItem value="200+" label="Productos Registrados" />
                        <StatItem value="95%" label="Satisfacción" />
                        <StatItem value="30%" label="Menos Pérdidas" />
                    </div>
                </div>
            </section>

            {/* ─── Security ─── */}
            <section className="bg-bg py-24 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
                        <div className="flex-1 text-center lg:text-left">
                            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
                                Seguridad
                            </p>
                            <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
                                Tus datos están protegidos
                            </h2>
                            <p className="mt-4 text-text-secondary leading-relaxed">
                                Implementamos las mejores prácticas de seguridad para que tu información esté siempre a salvo.
                            </p>
                        </div>
                        <div className="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {[
                                { icon: ShieldCheck, text: 'Autenticación JWT segura' },
                                { icon: Store, text: 'Datos cifrados con Argon2' },
                                { icon: Users, text: 'Roles y permisos granulares' },
                                { icon: Zap, text: 'Infraestructura Docker aislada' },
                            ].map(({ icon: I, text }, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-all hover:shadow-md hover:border-primary/30"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <I size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-text">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Final CTA ─── */}
            <section id="cta" className="relative overflow-hidden bg-surface py-24 px-6">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
                </div>

                <div className="relative z-10 mx-auto max-w-2xl text-center">
                    <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Store size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
                        ¿Listo para vender mejor?
                    </h2>
                    <p className="mx-auto mt-4 max-w-md text-text-secondary">
                        Únete a la comunidad de vendedores universitarios que ya optimizan su negocio con TienditaCampus.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link href="/register">
                            <Button size="lg" className="group gap-2 text-base font-bold shadow-xl shadow-primary/25 px-8">
                                Crear mi Cuenta Gratis
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── Footer ─── */}
            <footer className="border-t border-border bg-surface py-12 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-xs shadow-sm">
                                TC
                            </div>
                            <span className="text-sm font-bold text-text">TienditaCampus</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/login" className="text-sm text-text-secondary hover:text-primary transition-colors">
                                Iniciar Sesión
                            </Link>
                            <Link href="/register" className="text-sm text-text-secondary hover:text-primary transition-colors">
                                Registrarse
                            </Link>
                            <a href="#features" className="text-sm text-text-secondary hover:text-primary transition-colors">
                                Funciones
                            </a>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-border pt-6 text-center">
                        <p className="text-xs text-text-secondary/60">
                            © 2026 TienditaCampus — Universidad Politécnica de Chiapas. Proyecto Integrador.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
