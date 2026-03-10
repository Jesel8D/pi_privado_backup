'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Loader2, AlertCircle, CheckCircle2, Calculator } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { salesService } from '@/services/sales.service';

interface CloseDayForm {
    items: {
        productId: string;
        productName: string;
        prepared: number;
        waste: number;
        wasteReason?: 'expired' | 'damaged' | 'other' | '';
    }[];
}

export function CloseDayDialog({ onClosed }: { onClosed?: () => void }) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<'loading' | 'form' | 'success' | 'no-sale'>('loading');
    // const { toast } = useToast(); -> Removed, using sonner direct import

    const { register, control, handleSubmit, setValue, watch, reset } = useForm<CloseDayForm>({
        defaultValues: { items: [] }
    });

    const { fields } = useFieldArray({
        control,
        name: 'items'
    });

    const items = watch('items');

    // Calculate totals for preview
    const totalPrepared = items.reduce((sum, item) => sum + (Number(item.prepared) || 0), 0);
    const totalWaste = items.reduce((sum, item) => sum + (Number(item.waste) || 0), 0);
    const projectedSales = totalPrepared - totalWaste;

    useEffect(() => {
        const loadTodaySale = async () => {
            setStep('loading');
            try {
                const today = await salesService.getToday();
                if (!today || !today.details || today.details.length === 0) {
                    setStep('no-sale');
                    return;
                }

                if (today.isClosed) {
                    toast.message("Día Cerrado", {
                        description: "Ya has cerrado caja hoy. ¡Descansa! 😴",
                    });
                    setOpen(false); // Or show specific step
                    return;
                }

                const formItems = today.details.map((d: any) => ({
                    productId: d.product.id,
                    productName: d.product.name,
                    prepared: d.quantityPrepared,
                    waste: 0,
                    wasteReason: ''
                }));

                setValue('items', formItems);
                setStep('form');
            } catch (error) {
                console.error(error);
                toast.error("Error", {
                    description: "No se pudo cargar la información del día.",
                });
                setOpen(false);
            }
        };

        if (open) {
            loadTodaySale();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, setValue]);

    const onSubmit = async (data: CloseDayForm) => {
        try {
            await salesService.closeDay(data.items.map(i => ({
                productId: i.productId,
                waste: Number(i.waste),
                wasteReason: Number(i.waste) > 0 && i.wasteReason ? (i.wasteReason as any) : undefined
            })));

            setStep('success');
            setTimeout(() => {
                setOpen(false);
                if (onClosed) onClosed();
            }, 2000);
        } catch (error: any) {
            toast.error("Error al cerrar", {
                description: error.response?.data?.message || "Algo salió mal.",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800">
                    <Calculator size={16} /> Cerrar Día
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Cierre de Caja Rapido</DialogTitle>
                    <DialogDescription>
                        Registra la merma (lo que no se vendió) para cerrar el día.
                    </DialogDescription>
                </DialogHeader>

                {step === 'loading' && (
                    <div className="py-8 flex justify-center">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                )}

                {step === 'no-sale' && (
                    <div className="py-6 text-center space-y-3">
                        <AlertCircle className="mx-auto text-gray-400" size={40} />
                        <p className="text-gray-600">No has iniciado ninguna venta hoy.</p>
                        <Button onClick={() => setOpen(false)}>Entendido</Button>
                    </div>
                )}

                {step === 'success' && (
                    <div className="py-8 text-center space-y-3 animate-fade-in">
                        <CheckCircle2 className="mx-auto text-green-500" size={48} />
                        <h3 className="text-xl font-bold text-gray-900">¡Día Cerrado!</h3>
                        <p className="text-gray-600">Tus finanzas han sido actualizadas.</p>
                    </div>
                )}

                {step === 'form' && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm text-gray-900">{items[index]?.productName}</p>
                                            <p className="text-xs text-gray-500">Preparado: {items[index]?.prepared}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Label htmlFor={`waste-${index}`} className="text-xs text-gray-500">Merma:</Label>
                                            <Input
                                                id={`waste-${index}`}
                                                type="number"
                                                min="0"
                                                max={items[index]?.prepared}
                                                className="w-20 h-9 text-right font-mono text-sm leading-none"
                                                {...register(`items.${index}.waste` as const, { valueAsNumber: true })}
                                            />
                                        </div>
                                    </div>

                                    {Number(items[index]?.waste) > 0 && (
                                        <div className="flex items-center justify-end gap-3 mt-1 pt-2 border-t border-gray-200">
                                            <Label htmlFor={`reason-${index}`} className="text-xs text-red-600 font-medium">Motivo:</Label>
                                            <select
                                                id={`reason-${index}`}
                                                className="h-8 w-40 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                required
                                                {...register(`items.${index}.wasteReason` as const)}
                                            >
                                                <option value="" disabled>Selecciona...</option>
                                                <option value="expired">Caducidad</option>
                                                <option value="damaged">Daño físico</option>
                                                <option value="other">Otro</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center text-sm text-blue-800">
                            <span>Ventas calculadas:</span>
                            <span className="font-bold">{projectedSales} unidades</span>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                                Confirmar Cierre
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
