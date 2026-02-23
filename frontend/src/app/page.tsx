import { Package, Store, Users, Zap, ShieldCheck, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col selection:bg-neo-yellow selection:text-slate-900 pt-16">
            {/* Banner superior animado */}
            <div className="bg-neo-red text-white overflow-hidden py-2 border-b-2 border-slate-900 dark:border-white z-40">
                <div className="whitespace-nowrap flex animate-marquee font-bold text-sm tracking-widest uppercase">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <span key={i} className="mx-4">🔥 Compra Local • Vende en tu U • TienditaCampus</span>
                    ))}
                </div>
            </div>

            <header className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
                <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#FFC72C 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 flex flex-col items-start text-left">
                            <div className="inline-block px-4 py-1 mb-6 border-2 border-neo-red text-neo-red font-bold text-xs uppercase tracking-widest bg-neo-red/10 rounded-full">
                                🚀 La red #1 de emprendedores universitarios
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase text-slate-900 dark:text-white">
                                Emprende <br />
                                <span className="text-neo-yellow">en tu</span> <br />
                                <span className="relative inline-block">
                                    Campus
                                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-neo-red" preserveAspectRatio="none" viewBox="0 0 100 10">
                                        <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
                                    </svg>
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-lg mb-10 font-medium leading-relaxed border-l-4 border-neo-yellow pl-6">
                                Conecta con tu comunidad universitaria. Compra snacks, apuntes y merch, o vende tus productos sin intermediarios.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <Link
                                    href="/marketplace"
                                    className="group relative px-8 py-4 bg-neo-red text-white font-bold text-lg uppercase tracking-wide border-2 border-slate-900 dark:border-white shadow-neo-yellow hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 text-center"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        Explorar Tienda
                                        <Package className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                                <Link
                                    href="/register"
                                    className="group px-8 py-4 bg-neo-yellow text-slate-900 font-bold text-lg uppercase tracking-wide border-2 border-slate-900 dark:border-white shadow-[3px_3px_0_0_#E31837] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 text-center"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        Crear Cuenta
                                        <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </span>
                                </Link>
                            </div>
                            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                                ¿Ya tienes cuenta?{' '}
                                <Link href="/login" className="font-bold text-neo-red underline decoration-2 underline-offset-4 hover:text-neo-yellow transition-colors">
                                    Inicia sesión aquí
                                </Link>
                            </p>
                        </div>

                        {/* Ilustración Hero Animada */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative z-10 border-2 border-slate-900 dark:border-white bg-slate-800 p-2 shadow-neo-red rotate-2 hover:rotate-0 transition-transform duration-300">
                                <div className="relative bg-slate-900 aspect-[4/5] overflow-hidden group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        alt="Estudiantes en el campus"
                                        className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 mix-blend-overlay opacity-80"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxEzEY2M4GQm7g3GYQ1_3hGxRrVBnGUcoif-ZCjsQSJGM65dCiQAY6Coqvs1tp1woZTTBSSAe-DjVH7vgz7HDHTaDTcvlAzvsFelYMetNJQoAdmJHXn7BLlV44Xx846vvvNAnqdOjSmRSeRTLROYAjzv1c67EQgtI0h-1e9eF-O8jiUYvCry_Yt6tR8kbsr8FYXE2kPEEjrZoHVYWsufSa24M7qGANqFivGMk30gza2haO8fNg4o9uO_zCK7qRBbzQD9SG-LXrMasz"
                                    />
                                    <div className="absolute inset-0 bg-neo-yellow/20 mix-blend-multiply pointer-events-none"></div>
                                    <div className="absolute bottom-6 left-6 right-6 bg-background-dark border-2 border-neo-yellow p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-neo-yellow text-xs font-bold uppercase">Trending Ahora</span>
                                        </div>
                                        <div className="text-white font-bold text-lg">Brownies (Facultad de Artes)</div>
                                        <div className="flex justify-between items-end mt-2">
                                            <span className="text-2xl font-black text-neo-yellow">$25.00</span>
                                            <button className="bg-neo-yellow text-slate-900 p-1 hover:bg-neo-red hover:text-white transition-colors">
                                                <Store className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-12 -right-8 w-24 h-24 bg-neo-yellow rounded-full blur-2xl opacity-20 z-0"></div>
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 border-2 border-dashed border-neo-red z-0 rounded-full animate-spin-slow"></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sección: Cómo funciona */}
            <section id="como-funciona" className="py-20 border-y-4 border-black bg-white dark:bg-[#202020]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black uppercase text-slate-900 dark:text-white mb-4">
                            ¿Por qué <span className="bg-neo-yellow text-slate-900 px-2 inline-block -rotate-1 transform">Tiendita?</span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
                            La economía circular de tu universidad, digitalizada y sin rollos.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="border-4 border-black p-8 bg-white shadow-[6px_6px_0_0_#FFC72C] hover:-translate-y-2 transition-transform">
                            <div className="w-14 h-14 bg-neo-red border-2 border-black flex items-center justify-center mb-6">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-black uppercase mb-3 text-slate-900">Publica en Segundos</h3>
                            <p className="text-slate-600 font-medium">
                                Sube tu producto con foto, precio y descripción. En menos de un minuto ya estás vendiendo al campus.
                            </p>
                        </div>
                        <div className="border-4 border-black p-8 bg-white shadow-[6px_6px_0_0_#E31837] hover:-translate-y-2 transition-transform">
                            <div className="w-14 h-14 bg-neo-yellow border-2 border-black flex items-center justify-center mb-6">
                                <ShieldCheck className="w-7 h-7 text-slate-900" />
                            </div>
                            <h3 className="text-xl font-black uppercase mb-3 text-slate-900">Compra Seguro</h3>
                            <p className="text-slate-600 font-medium">
                                Cada vendedor es un estudiante verificado. Pago contra entrega, sin intermediarios ni sorpresas.
                            </p>
                        </div>
                        <div className="border-4 border-black p-8 bg-white shadow-[6px_6px_0_0_#000] hover:-translate-y-2 transition-transform">
                            <div className="w-14 h-14 bg-black border-2 border-black flex items-center justify-center mb-6">
                                <TrendingUp className="w-7 h-7 text-neo-yellow" />
                            </div>
                            <h3 className="text-xl font-black uppercase mb-3 text-slate-900">Analíticas Pro</h3>
                            <p className="text-slate-600 font-medium">
                                Dashboard con ganancia neta, historial de ventas, predicciones y reportes para que crezcas tu negocio.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección: CTA Final */}
            <section className="py-20 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#FFC72C 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
                        ¿Listo para <span className="text-neo-yellow">vender?</span>
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Únete a cientos de estudiantes que ya están generando ingresos dentro de su universidad.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="px-10 py-5 bg-neo-yellow text-black font-black text-xl uppercase border-4 border-white shadow-[6px_6px_0_0_#E31837] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all"
                        >
                            Empezar Gratis
                        </Link>
                        <Link
                            href="/login"
                            className="px-10 py-5 bg-transparent text-white font-black text-xl uppercase border-4 border-white hover:bg-white hover:text-black transition-all"
                        >
                            Ya tengo cuenta
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white border-t-4 border-neo-yellow py-8">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-neo-red p-1 border-2 border-white">
                            <ShoppingBasket className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-black uppercase text-sm">TienditaCampus © 2026</span>
                    </div>
                    <div className="flex gap-6 text-sm font-bold uppercase tracking-wider text-gray-400">
                        <Link href="/marketplace" className="hover:text-neo-yellow transition-colors">Tienda</Link>
                        <Link href="/login" className="hover:text-neo-yellow transition-colors">Entrar</Link>
                        <Link href="/register" className="hover:text-neo-yellow transition-colors">Registrarse</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function ShoppingBasket(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m15 11-1 9" /><path d="m19 11-4-7" /><path d="M2 11h20" /><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" /><path d="m4.5 15.5h15" /><path d="m5 11 4-7" /><path d="m9 11 1 9" />
        </svg>
    );
}
