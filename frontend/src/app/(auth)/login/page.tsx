'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { authService } from '../../../services/auth.service';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Loader2, ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';

// Esquema de validación
const loginSchema = z.object({
    email: z.string().email({ message: 'Email inválido' }),
    password: z.string().min(1, { message: 'La contraseña es requerida' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            const response = await authService.login(data);
            toast.success('¡Bienvenido de nuevo!');
            if (response.user.role === 'buyer') {
                router.push('/buyer/dashboard');
            } else {
                router.push('/dashboard');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Header Neo-Brutalista */}
            <div className="mb-8 text-center lg:text-left relative">
                <div className="inline-flex h-16 w-16 items-center justify-center border-4 border-black bg-neo-yellow shadow-[4px_4px_0_0_#000] mb-6 -rotate-3">
                    <ShieldCheck size={32} className="text-black" />
                </div>
                <h1 className="text-5xl font-black uppercase tracking-tighter text-black leading-none mb-2">
                    ¡HOLA DE <br /> <span className="text-neo-red">NUEVO!</span>
                </h1>
                <p className="text-lg font-bold text-slate-600 border-l-4 border-neo-yellow pl-4 mt-4">
                    Entra para seguir dominando el campus.
                </p>
            </div>

            {/* Card Contenedor Neo-Brutalista */}
            <div className="border-4 border-black bg-white p-8 shadow-[10px_10px_0_0_#000] relative overflow-hidden">
                {/* Elemento decorativo */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-neo-red/10 -mr-8 -mt-8 rotate-45 border-b-2 border-black"></div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2">
                                <Mail size={16} /> Email Institucional
                            </Label>
                            <div className="relative group">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@correo.edu"
                                    className="h-14 border-4 border-black bg-white rounded-none text-black font-bold focus:ring-0 focus:bg-neo-yellow/5 transition-all outline-none"
                                    {...register('email')}
                                    disabled={isLoading}
                                />
                                <div className="absolute inset-0 border-4 border-black translate-x-1 translate-y-1 -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
                            </div>
                            {errors.email && (
                                <p className="text-xs font-black text-neo-red uppercase mt-1 italic">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2">
                                    <Lock size={16} /> Contraseña
                                </Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-black uppercase text-neo-red hover:text-black transition-colors underline decoration-2 underline-offset-4"
                                >
                                    ¿Olvidaste?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-14 border-4 border-black bg-white rounded-none text-black font-bold focus:ring-0 focus:bg-neo-yellow/5 transition-all outline-none"
                                    {...register('password')}
                                    disabled={isLoading}
                                />
                                <div className="absolute inset-0 border-4 border-black translate-x-1 translate-y-1 -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
                            </div>
                            {errors.password && (
                                <p className="text-xs font-black text-neo-red uppercase mt-1 italic">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="group w-full h-16 bg-black text-white text-lg font-black uppercase tracking-widest border-4 border-black shadow-[6px_6px_0_0_#FFC72C] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <>
                                ENTRAR AHORA
                                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-6 border-t-4 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-bold text-slate-600 uppercase tracking-tight">
                        ¿Sin cuenta aún?
                    </p>
                    <Link
                        href="/register"
                        className="px-6 py-2 border-2 border-black bg-neo-yellow text-black font-black uppercase text-xs hover:bg-black hover:text-white transition-all shadow-[3px_3px_0_0_#000] hover:shadow-none translate-y-[-2px] active:translate-y-0"
                    >
                        REGISTRARSE
                    </Link>
                </div>
            </div>

            {/* Footer decorativo */}
            <div className="mt-8 flex justify-center gap-4 grayscale opacity-40">
                <div className="w-12 h-2 bg-black"></div>
                <div className="w-12 h-2 bg-neo-red"></div>
                <div className="w-12 h-2 bg-neo-yellow"></div>
            </div>
        </div>
    );
}
