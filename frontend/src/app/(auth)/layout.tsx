import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen relative">
            {/* Botón Volver (Global) */}
            <Link
                href="/"
                className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full lg:left-8 lg:top-8"
            >
                <ArrowLeft size={16} />
                Volver al inicio
            </Link>

            {/* Lado Izquierdo: Visual/Branding (Oculto en móvil) */}
            <div className="relative hidden w-1/2 flex-col justify-between bg-primary p-12 text-white lg:flex">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm z-10" />
                    {/* Aquí se usará la imagen generada una vez que tengamos la ruta */}
                    {/* <Image 
            src="/auth-bg.jpg" 
            alt="Auth Background" 
            fill 
            className="object-cover" 
            priority
          /> */}
                </div>

                <div className="relative z-20 flex items-center text-lg font-medium">
                    <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-primary font-bold">
                        TC
                    </div>
                    TienditaCampus
                </div>

                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-3xl font-light leading-snug">
                            &quot;La plataforma digital que transforma el comercio dentro del campus universitario.&quot;
                        </p>
                        <footer className="text-sm opacity-80">
                            Equipo de TienditaCampus
                        </footer>
                    </blockquote>
                </div>
            </div>

            {/* Lado Derecho: Contenido (Login/Register) */}
            <div className="flex w-full items-center justify-center p-8 lg:w-1/2 bg-background">
                <div className="w-full max-w-md animate-slide-up">
                    <div className="lg:hidden mb-8 flex items-center justify-center text-2xl font-bold text-primary">
                        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
                            TC
                        </div>
                        TienditaCampus
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
