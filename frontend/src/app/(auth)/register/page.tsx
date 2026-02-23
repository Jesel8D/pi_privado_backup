'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { authService } from '../../../services/auth.service';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
    Loader2,
    UserPlus,
    AtSign,
    Lock,
    User,
    GraduationCap,
    MapPin,
    CheckCircle2
} from 'lucide-react';

const registerSchema = z.object({
    firstName: z.string().min(2, { message: 'Nombre muy corto' }),
    lastName: z.string().min(2, { message: 'Apellido muy corto' }),
    email: z.string().email({ message: 'Email inválido' }),
    password: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
    campusLocation: z.string().min(3, { message: 'Requerido' }),
    major: z.string().min(3, { message: 'Requerido' }),
    role: z.enum(['buyer', 'seller']),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller'>('buyer');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'buyer'
        }
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            await authService.register(data);
            toast.success('¡Registro exitoso! Ahora inicia sesión.');
            router.push('/login');
        } catch (error: any) {
            toast.error(error.message || 'Error al registrarse');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto py-10">
            {/* Header */}
            <div className="mb-10 text-center lg:text-left">
                <div className="inline-flex h-16 w-16 items-center justify-center border-4 border-black bg-neo-red shadow-[4px_4px_0_0_#000] mb-6 rotate-3">
                    <UserPlus size={32} className="text-white" />
                </div>
                <h1 className="text-5xl font-black uppercase tracking-tighter text-black leading-none mb-3">
                    ÚNETE A LA <br /> <span className="text-neo-yellow bg-black px-2">TRIBU</span>
                </h1>
                <p className="text-lg font-bold text-slate-600 border-l-4 border-black pl-4 mt-4 uppercase">
                    Crea tu cuenta y empieza a mover el campus.
                </p>
            </div>

            {/* Form Container */}
            <div className="border-4 border-black bg-white p-8 md:p-12 shadow-[12px_12px_0_0_#E31837] relative">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Role Selector */}
                    <div className="space-y-3">
                        <Label className="text-sm font-black uppercase tracking-widest text-black">¿Cuál es tu misión?</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => { setSelectedRole('buyer'); setValue('role', 'buyer'); }}
                                className={`p-4 border-4 border-black flex flex-col items-center gap-2 transition-all ${selectedRole === 'buyer'
                                        ? 'bg-neo-yellow shadow-[4px_4px_0_0_#000] translate-x-[-2px] translate-y-[-2px]'
                                        : 'bg-white hover:bg-slate-50 opacity-60'
                                    }`}
                            >
                                <CheckCircle2 className={`w-6 h-6 ${selectedRole === 'buyer' ? 'text-black' : 'text-slate-300'}`} />
                                <span className="font-black uppercase text-xs">Comprar</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setSelectedRole('seller'); setValue('role', 'seller'); }}
                                className={`p-4 border-4 border-black flex flex-col items-center gap-2 transition-all ${selectedRole === 'seller'
                                        ? 'bg-neo-red text-white shadow-[4px_4px_0_0_#000] translate-x-[-2px] translate-y-[-2px]'
                                        : 'bg-white hover:bg-slate-50 opacity-60 text-black'
                                    }`}
                            >
                                <CheckCircle2 className={`w-6 h-6 ${selectedRole === 'seller' ? 'text-white' : 'text-slate-300'}`} />
                                <span className="font-black uppercase text-xs">Vender</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombres */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-black flex items-center gap-2"><User size={14} /> Nombre</Label>
                            <Input
                                {...register('firstName')}
                                className="h-12 border-4 border-black rounded-none font-bold focus:bg-neo-yellow/5"
                                placeholder="Ej. Juan"
                            />
                            {errors.firstName && <p className="text-xs font-black text-neo-red italic uppercase">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-black flex items-center gap-2"><User size={14} /> Apellido</Label>
                            <Input
                                {...register('lastName')}
                                className="h-12 border-4 border-black rounded-none font-bold focus:bg-neo-yellow/5"
                                placeholder="Ej. Pérez"
                            />
                            {errors.lastName && <p className="text-xs font-black text-neo-red italic uppercase">{errors.lastName.message}</p>}
                        </div>

                        {/* Académico */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-black flex items-center gap-2"><MapPin size={14} /> Campus / Sede</Label>
                            <Input
                                {...register('campusLocation')}
                                className="h-12 border-4 border-black rounded-none font-bold focus:bg-neo-yellow/5"
                                placeholder="Ej. Campus Norte"
                            />
                            {errors.campusLocation && <p className="text-xs font-black text-neo-red italic uppercase">{errors.campusLocation.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-black flex items-center gap-2"><GraduationCap size={14} /> Carrera</Label>
                            <Input
                                {...register('major')}
                                className="h-12 border-4 border-black rounded-none font-bold focus:bg-neo-yellow/5"
                                placeholder="Ej. Ingeniería"
                            />
                            {errors.major && <p className="text-xs font-black text-neo-red italic uppercase">{errors.major.message}</p>}
                        </div>

                        {/* Credenciales */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-black flex items-center gap-2"><AtSign size={14} /> Email</Label>
                            <Input
                                {...register('email')}
                                type="email"
                                className="h-12 border-4 border-black rounded-none font-bold focus:bg-neo-yellow/5"
                                placeholder="correo@ejemplo.edu"
                            />
                            {errors.email && <p className="text-xs font-black text-neo-red italic uppercase">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-black flex items-center gap-2"><Lock size={14} /> Contraseña</Label>
                            <Input
                                {...register('password')}
                                type="password"
                                className="h-12 border-4 border-black rounded-none font-bold focus:bg-neo-yellow/5"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-xs font-black text-neo-red italic uppercase">{errors.password.message}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="group w-full h-20 bg-black text-white text-xl font-black uppercase tracking-widest border-4 border-black shadow-[8px_8px_0_0_#FFC72C] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-4 disabled:opacity-70"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                        ) : (
                            <>
                                CREAR MI CUENTA
                                <CheckCircle2 className="group-hover:scale-125 transition-transform text-neo-yellow" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 text-center border-t-4 border-black pt-8">
                    <p className="font-bold text-slate-500 uppercase text-sm mb-4">¿Ya eres parte de la red?</p>
                    <Link
                        href="/login"
                        className="inline-block px-10 py-3 bg-white border-4 border-black text-black font-black uppercase text-sm hover:bg-black hover:text-white transition-all shadow-[5px_5px_0_0_#000] hover:shadow-none"
                    >
                        INICIAR SESIÓN
                    </Link>
                </div>
            </div>
        </div>
    );
}
