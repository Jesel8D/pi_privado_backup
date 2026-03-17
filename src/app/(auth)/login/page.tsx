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
import { Loader2, ShieldCheck, ArrowRight, Lock, Mail, Globe } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

// Esquema de validación
const loginSchema = z.object({
    email: z.string().email({ message: 'Email inválido' }),
    password: z.string().min(1, { message: 'La contraseña es requerida' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsGoogleLoading(true);
            try {
                const response = await authService.loginWithGoogle(tokenResponse.access_token);
                toast.success('¡Bienvenido con Google!');
                if (response.user.role === 'buyer') {
                    router.push('/dashboard');
                } else {
                    router.push('/dashboard');
                }
            } catch (error: any) {
                toast.error(error.message || 'Error al iniciar sesión con Google');
            } finally {
                setIsGoogleLoading(false);
            }
        },
        onError: () => {
            toast.error('Ocurrió un error con el proveedor de Google');
        },
        scope: 'email profile'
    });

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
                router.push('/dashboard');
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
            <div className="mb-10 text-center lg:text-left relative">
                <div className="inline-flex h-20 w-20 items-center justify-center border-4 border-foreground bg-primary text-primary-foreground shadow-neo mb-8 rotate-3 rounded-2xl">
                    <ShieldCheck size={40} />
                </div>
                <h1 className="text-6xl font-bold tracking-tighter text-foreground leading-none mb-4 uppercase">
                    ¡HOLA DE <br /> <span className="text-primary italic">NUEVO!</span>
                </h1>
                <p className="text-xl font-bold text-muted-foreground border-l-8 border-secondary pl-6 mt-6 uppercase italic">
                    Entra para seguir dominando el campus.
                </p>
            </div>

            {/* Card Contenedor Neo-Brutalista */}
            <div className="border-4 border-foreground bg-card p-10 shadow-neo-lg relative overflow-hidden rounded-3xl">
                {/* Elemento decorativo */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary text-primary-foreground/10 -mr-12 -mt-12 rotate-45 border-b-4 border-foreground"></div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold tracking-widest text-foreground flex items-center gap-2">
                                <Mail size={16} /> Correo
                            </Label>
                            <div className="relative group">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@correo.com"
                                    className="h-14 border-2 border-foreground bg-background text-foreground font-bold text-lg rounded-xl focus:ring-0 focus:border-primary transition-all shadow-sm"
                                    {...register('email')}
                                    disabled={isLoading}
                                />
                                <div className="absolute inset-0 border-2 border-primary/20 translate-x-1.5 translate-y-1.5 -z-10 group-focus-within:translate-x-0 group-focus-within:translate-y-0 transition-transform bg-primary/5 rounded-xl"></div>
                            </div>
                            {errors.email && (
                                <p className="text-xs font-bold text-primary uppercase mt-1 italic">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-semibold tracking-widest text-foreground flex items-center gap-2">
                                    <Lock size={16} /> Contraseña
                                </Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-semibold text-primary/70 hover:text-primary transition-colors underline decoration-2 underline-offset-4"
                                >
                                    ¿Olvidaste?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-14 border-2 border-foreground bg-background text-foreground font-bold text-lg rounded-xl focus:ring-0 focus:border-primary transition-all shadow-sm"
                                    {...register('password')}
                                    disabled={isLoading}
                                />
                                <div className="absolute inset-0 border-2 border-primary/20 translate-x-1.5 translate-y-1.5 -z-10 group-focus-within:translate-x-0 group-focus-within:translate-y-0 transition-transform bg-primary/5 rounded-xl"></div>
                            </div>
                            {errors.password && (
                                <p className="text-xs font-bold text-primary uppercase mt-1 italic">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="group w-full h-20 bg-foreground text-background text-2xl font-bold tracking-widest border-2 border-foreground shadow-neo-sm hover:shadow-neo hover:-translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-4 disabled:opacity-70 rounded-2xl"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                        ) : (
                            <>
                                ENTRAR AHORA
                                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t-4 border-muted"></div>
                        <span className="flex-shrink-0 mx-6 text-sm font-bold text-muted-foreground uppercase tracking-widest italic">O TAMBIÉN</span>
                        <div className="flex-grow border-t-4 border-muted"></div>
                    </div>

                    <button
                        type="button"
                        onClick={() => googleLogin()}
                        disabled={isLoading || isGoogleLoading}
                        className="group w-full h-20 bg-card text-foreground text-xl font-bold tracking-widest border-2 border-foreground shadow-neo-sm hover:shadow-neo hover:-translate-y-1 hover:bg-background transition-all flex items-center justify-center gap-4 disabled:opacity-70 rounded-2xl"
                    >
                        {isGoogleLoading ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                        ) : (
                            <>
                                <Globe size={28} className="text-primary group-hover:rotate-12 transition-transform" />
                                CONTINUAR CON GOOGLE
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t-4 border-foreground/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight italic">
                        ¿AÚN NO TIENES CUENTA?
                    </p>
                    <Link
                        href="/register"
                        className="px-8 py-4 border-2 border-primary bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest hover:bg-background hover:text-primary transition-all shadow-neo-sm hover:shadow-neo active:translate-y-0 rounded-xl"
                    >
                        CREAR CUENTA
                    </Link>
                </div>
            </div>

            {/* Footer decorativo */}
            <div className="mt-8 flex justify-center gap-4 opacity-10">
                <div className="w-12 h-2 bg-foreground"></div>
                <div className="w-12 h-2 bg-primary"></div>
                <div className="w-12 h-2 bg-secondary"></div>
            </div>
        </div>
    );
}
