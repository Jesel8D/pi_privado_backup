import { ReactNode } from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen">
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
