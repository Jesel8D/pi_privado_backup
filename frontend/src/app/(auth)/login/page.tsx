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
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../../../components/ui/card';
import { Loader2, ShieldCheck } from 'lucide-react';

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
            await authService.login(data);
            toast.success('¡Bienvenido de nuevo!');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-2 text-center lg:text-left">
                <div className="mb-2 flex justify-center lg:justify-start">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/30">
                        <ShieldCheck size={28} />
                    </div>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Iniciar Sesión</h1>
                <p className="text-sm text-muted-foreground">
                    Ingresa tus credenciales para acceder a la gestión de tu campus.
                </p>
            </div>

            <Card className="border-none shadow-none bg-transparent">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground/70 font-semibold">
                                Email Corporativo
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nombre@ejemplo.com"
                                className="h-12 border-input bg-background focus:ring-primary/20 transition-all"
                                {...register('email')}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-xs font-medium text-destructive animate-fade-in">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs uppercase tracking-widest text-muted-foreground/70 font-semibold">
                                    Contraseña
                                </Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-primary hover:text-primary-dark font-medium transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                className="h-12 border-input bg-background focus:ring-primary/20 transition-all"
                                {...register('password')}
                                disabled={isLoading}
                            />
                            {errors.password && (
                                <p className="text-xs font-medium text-destructive animate-fade-in">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 text-sm font-bold bg-primary hover:bg-primary-dark transition-all duration-300 shadow-md shadow-primary/20"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            'Acceder al Panel'
                        )}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    ¿Nuevo en la plataforma?{' '}
                    <Link href="/register" className="font-bold text-primary hover:text-primary-dark transition-colors">
                        Crea una cuenta ahora
                    </Link>
                </div>
            </Card>
        </div>
    );
}
