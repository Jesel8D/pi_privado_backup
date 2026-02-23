'use client';

import { Settings, User, Bell, Shield, Palette, Save, Loader2, Key } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success('¡Configuración guardada!', {
                description: 'Tus cambios han sido aplicados con éxito.',
            });
        }, 1000);
    };

    return (
        <div className="p-6 md:p-10 space-y-10 max-w-5xl">
            <header className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-neo-yellow px-4 py-1 border-2 border-black font-black uppercase text-xs tracking-widest shadow-neo-sm -rotate-1">
                    <Settings size={16} /> Panel de Control
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
                    CONFIGURACIÓN
                </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                {/* Navigation Sidebar Local */}
                <div className="md:col-span-4 space-y-2">
                    {[
                        { icon: User, label: 'Perfil Público', active: true },
                        { icon: Bell, label: 'Notificaciones', active: false },
                        { icon: Shield, label: 'Privacidad', active: false },
                        { icon: Palette, label: 'Apariencia', active: false },
                        { icon: Key, label: 'Seguridad', active: false },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-4 p-4 border-4 border-black font-black uppercase text-xs tracking-widest transition-all ${item.active
                                    ? 'bg-black text-white shadow-neo-sm translate-x-[-2px] translate-y-[-2px]'
                                    : 'bg-white text-black hover:bg-slate-50'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Form Content */}
                <div className="md:col-span-8 bg-white border-4 border-black p-8 shadow-neo-lg space-y-8 relative">
                    <div className="absolute top-0 right-0 w-2 h-full bg-neo-red"></div>

                    <section className="space-y-6">
                        <h3 className="text-2xl font-black uppercase tracking-tighter border-b-4 border-black pb-2 flex items-center gap-2">
                            <User className="text-neo-red" /> Información Básica
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Nombre de la Tienda</label>
                                <input
                                    type="text"
                                    placeholder="Mi Tiendita"
                                    className="w-full h-14 border-4 border-black bg-slate-50 p-4 font-bold focus:outline-none focus:bg-white focus:ring-4 focus:ring-neo-yellow/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Biografía del Vendedor</label>
                                <textarea
                                    rows={4}
                                    placeholder="Cuéntanos un poco sobre lo que vendes..."
                                    className="w-full border-4 border-black bg-slate-50 p-4 font-bold focus:outline-none focus:bg-white focus:ring-4 focus:ring-neo-yellow/20 resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6 pt-4">
                        <h3 className="text-2xl font-black uppercase tracking-tighter border-b-4 border-black pb-2 flex items-center gap-2">
                            <Bell className="text-neo-yellow" /> Preferencias
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border-2 border-black bg-slate-50">
                                <span className="font-bold uppercase text-xs">Notificaciones por Email</span>
                                <div className="w-12 h-6 border-2 border-black bg-neo-green relative cursor-pointer">
                                    <div className="absolute top-0 right-0 w-6 h-full bg-black border-2 border-black"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 border-2 border-black bg-slate-50">
                                <span className="font-bold uppercase text-xs">Solo pedidos urgentes</span>
                                <div className="w-12 h-6 border-2 border-black bg-slate-200 relative cursor-pointer">
                                    <div className="absolute top-0 left-0 w-6 h-full bg-black border-2 border-black"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="pt-6 border-t-4 border-black border-dashed flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="bg-black text-white px-10 py-4 font-black uppercase text-sm border-2 border-black shadow-neo-red hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                            GUARDAR CAMBIOS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
