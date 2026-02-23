'use client';

import { ShieldCheck, History, Search, Filter, ArrowDownToLine, Zap, Clock, User, HardDrive } from 'lucide-react';
import { useState } from 'react';

const mockLogs = [
    { id: '1', action: 'CREATE_PRODUCT', user: 'Emilio J.', date: '2026-02-22 14:30', detail: 'Agregó Tacos de Canasta x50', status: 'success' },
    { id: '2', action: 'UPDATE_STOCK', user: 'Ana P.', date: '2026-02-22 12:15', detail: 'Modificó stock de Brownies (-10)', status: 'success' },
    { id: '3', action: 'DELETE_PRODUCT', user: 'Admin', date: '2026-02-21 09:45', detail: 'Eliminó producto ID #992', status: 'warning' },
    { id: '4', action: 'LOGIN_FAILURE', user: 'Unknown', date: '2026-02-21 08:30', detail: 'Intento de acceso fallido desde 192.168.1.1', status: 'error' },
    { id: '5', action: 'ORDER_COMPLETED', user: 'Sistema', date: '2026-02-20 18:00', detail: 'Pedido #772 marcado como entregado', status: 'success' },
];

export default function AuditPage() {
    const [search, setSearch] = useState('');

    return (
        <div className="p-6 md:p-10 space-y-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-neo-red text-white px-4 py-1 border-2 border-black font-black uppercase text-xs tracking-widest shadow-neo-sm rotate-1">
                        <ShieldCheck size={16} /> Seguridad & Auditoría
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                        HISTORIAL DE <span className="text-neo-red">SISTEMA</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <button className="h-14 px-8 border-4 border-black bg-white font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all shadow-neo-sm flex items-center gap-2">
                        <ArrowDownToLine size={18} /> EXPORTAR LOGS
                    </button>
                </div>
            </header>

            {/* Quick Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
                    <input
                        type="text"
                        placeholder="BUSCAR EVENTOS, USUARIOS O ACCIONES..."
                        className="w-full h-16 pl-14 pr-4 border-4 border-black font-black uppercase bg-white focus:bg-neo-yellow/10 focus:outline-none placeholder:text-slate-300"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="absolute inset-0 border-4 border-black translate-x-2 translate-y-2 -z-10 group-focus-within:translate-x-0 group-focus-within:translate-y-0 transition-transform bg-neo-yellow"></div>
                </div>
                <button className="h-16 px-8 border-4 border-black bg-black text-white font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-neo-red transition-colors">
                    <Filter size={18} /> FILTRAR
                </button>
            </div>

            {/* Audit Table */}
            <div className="bg-white border-4 border-black shadow-neo-lg overflow-hidden">
                <div className="grid grid-cols-12 bg-black text-white p-4 font-black uppercase text-[10px] tracking-[0.2em]">
                    <div className="col-span-2">Acción</div>
                    <div className="col-span-2">Usuario</div>
                    <div className="col-span-5">Detalle del Evento</div>
                    <div className="col-span-2">Fecha/Hora</div>
                    <div className="col-span-1 text-center">Estado</div>
                </div>
                <div className="divide-y-4 divide-black">
                    {mockLogs.map((log) => (
                        <div key={log.id} className="grid grid-cols-12 p-4 items-center hover:bg-slate-50 transition-colors group">
                            <div className="col-span-2">
                                <span className="bg-neo-yellow/20 text-black border-2 border-black/10 px-2 py-0.5 font-black text-[10px] uppercase">
                                    {log.action}
                                </span>
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <div className="w-6 h-6 bg-black text-white flex items-center justify-center font-black text-[8px] uppercase">
                                    {log.user.charAt(0)}
                                </div>
                                <span className="font-bold text-xs uppercase">{log.user}</span>
                            </div>
                            <div className="col-span-5 text-sm font-medium text-slate-600 italic">
                                "{log.detail}"
                            </div>
                            <div className="col-span-2 flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
                                <Clock size={12} /> {log.date}
                            </div>
                            <div className="col-span-1 flex justify-center">
                                <div className={`w-3 h-3 border-2 border-black rotate-45 ${log.status === 'success' ? 'bg-neo-green' :
                                        log.status === 'warning' ? 'bg-neo-yellow' : 'bg-neo-red'
                                    }`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Stats Deco */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 border-4 border-black bg-slate-50 flex items-center gap-4">
                    <Zap size={24} className="text-neo-yellow" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400">Eventos Totales</p>
                        <p className="text-2xl font-black">1.2k+</p>
                    </div>
                </div>
                <div className="p-6 border-4 border-black bg-slate-50 flex items-center gap-4">
                    <ShieldCheck size={24} className="text-neo-green" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400">Integridad de DB</p>
                        <p className="text-2xl font-black text-neo-green">100%</p>
                    </div>
                </div>
                <div className="p-6 border-4 border-black bg-slate-50 flex items-center gap-4">
                    <User size={24} className="text-blue-500" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400">Usuarios Activos</p>
                        <p className="text-2xl font-black">42</p>
                    </div>
                </div>
                <div className="p-6 border-4 border-black bg-black text-white flex items-center gap-4">
                    <HardDrive size={24} className="text-neo-red" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 opacity-50">Espacio Log</p>
                        <p className="text-2xl font-black">12.5 MB</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
