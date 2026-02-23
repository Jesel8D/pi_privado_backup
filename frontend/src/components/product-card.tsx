import { Store, ShoppingCart, Loader2, MapPin, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Product } from '@/services/products.service';
import { ordersService } from '@/services/orders.service';
import { useState, type ChangeEvent } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function ProductCard({ product }: { product: Product }) {
    const seller = (product as any).seller;
    const sellerName = seller ? `${seller.firstName} ${seller.lastName}` : 'Estudiante';
    const sellerId = seller?.id;
    const sellerMajor = seller?.major;
    const sellerCampus = seller?.campusLocation;

    // Fallback to 0 if undefined, but our modified backend sends 'quantityRemaining' 
    const stockAvailable = (product as any).quantityRemaining || 0;

    const { isAuthenticated, user } = useAuthStore();
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [deliveryMessage, setDeliveryMessage] = useState('');
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);

    const handlePurchase = async () => {
        if (!isAuthenticated) {
            toast.error('Debes iniciar sesión para comprar');
            return;
        }

        if (user?.id === sellerId) {
            toast.error('No puedes comprar tus propios productos');
            return;
        }

        if (quantity < 1 || quantity > stockAvailable) {
            toast.error('Cantidad inválida');
            return;
        }

        setIsPurchasing(true);
        try {
            await ordersService.createOrder({
                sellerId: sellerId,
                items: [{
                    productId: product.id,
                    quantity: quantity
                }],
                deliveryMessage: deliveryMessage
            });
            toast.success('¡Solicitud enviada con éxito!', {
                description: `Has solicitado ${quantity}x ${product.name}. Ponte de acuerdo para la entrega.`
            });
            setOpen(false);
            // Optionally reload page or update local state stock
        } catch (error: any) {
            toast.error('Error al solicitar la compra', {
                description: error.response?.data?.message || 'Stock insuficiente o error del servidor'
            });
        } finally {
            setIsPurchasing(false);
        }
    };

    return (
        <div className="bg-white border-2 border-slate-900 dark:border-white shadow-[6px_6px_0px_0px_#E31837] overflow-hidden transition-transform group flex flex-col h-full hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
            <div className="aspect-square bg-[#f1f1f1] relative overflow-hidden border-b-2 border-slate-900 dark:border-white">
                {product.imageUrl && !imageFailed ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-900 text-5xl font-black bg-[#FFC72C] uppercase">
                        {product.name.charAt(0)}
                    </div>
                )}
                {product.isPerishable && (
                    <span className="absolute top-3 right-3 bg-[#FFC72C] text-slate-900 text-xs font-black px-2 py-1 border-2 border-slate-900 dark:border-white uppercase tracking-wider">
                        Perecedero
                    </span>
                )}
                {stockAvailable > 0 ? (
                    <span className="absolute bottom-3 left-3 bg-white text-slate-900 text-xs font-black px-2 py-1 border-2 border-slate-900 dark:border-white uppercase tracking-wider">
                        Stock {stockAvailable}
                    </span>
                ) : (
                    <span className="absolute bottom-3 left-3 bg-[#E31837] text-white text-xs font-black px-2 py-1 border-2 border-slate-900 dark:border-white uppercase tracking-wider">
                        Agotado
                    </span>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-black text-slate-900 line-clamp-1 uppercase tracking-tight" title={product.name}>
                            {product.name}
                        </h3>
                        {sellerId ? (
                            <Link
                                href={`/seller/${sellerId}`}
                                className="text-sm text-slate-900 font-bold flex items-center gap-1 hover:underline decoration-[#E31837] decoration-2 underline-offset-4 mt-1"
                                title="Ver perfil"
                            >
                                <Store size={14} className="text-slate-900" /> {sellerName}
                            </Link>
                        ) : (
                            <p className="text-sm text-slate-900 font-bold flex items-center gap-1 mt-1">
                                <Store size={14} className="text-slate-900" /> {sellerName}
                            </p>
                        )}
                        {(sellerMajor || sellerCampus) && (
                            <div className="flex flex-col gap-0.5 mt-1">
                                {sellerCampus && (
                                    <p className="text-xs text-slate-600 font-medium flex items-center gap-1">
                                        <MapPin size={12} className="text-slate-600" /> {sellerCampus}
                                    </p>
                                )}
                                {sellerMajor && (
                                    <p className="text-xs text-slate-600 font-medium flex items-center gap-1 line-clamp-1" title={sellerMajor}>
                                        <GraduationCap size={12} className="text-slate-600" /> {sellerMajor}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="shrink-0 ml-3 text-right">
                        <div className="inline-flex border-2 border-slate-900 dark:border-white bg-[#FFC72C] px-2 py-1 font-black text-slate-900">
                            ${Number(product.salePrice).toFixed(2)}
                        </div>
                    </div>
                </div>

                {product.description && (
                    <p className="text-sm text-slate-700 line-clamp-2 h-10 mt-1 font-medium">
                        {product.description}
                    </p>
                )}

                <div className="mt-auto pt-4">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="w-full gap-2 transition-transform active:scale-95 bg-[#E31837] hover:bg-[#c9122e] border-2 border-slate-900 dark:border-white font-black uppercase shadow-[4px_4px_0px_0px_#FFC72C]"
                                disabled={stockAvailable < 1 || !sellerId}
                            >
                                <ShoppingCart size={16} />
                                {stockAvailable > 0 ? 'Solicitar Compra' : 'Agotado'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Solicitar Compra</DialogTitle>
                                <DialogDescription>
                                    Vendido por <strong>{sellerName}</strong> {sellerCampus ? `(${sellerCampus})` : ''} <br />
                                    Precio unidad: <strong className="text-gray-900">${Number(product.salePrice).toFixed(2)}</strong>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">¿Cuántas piezas deseas apartar?</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        max={stockAvailable}
                                        value={quantity}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantity(Number(e.target.value))}
                                    />
                                    <p className="text-xs text-gray-500">Stock disponible: {stockAvailable}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Instrucciones de entrega (Opcional)</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Ej. 'Llevo sudadera roja, estoy en la biblioteca...'"
                                        value={deliveryMessage}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDeliveryMessage(e.target.value)}
                                        className="resize-none"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                                    <span className="font-medium text-gray-700">Total a pagar:</span>
                                    <span className="font-bold text-xl text-primary">
                                        ${(Number(product.salePrice) * quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <DialogFooter className="sm:justify-between flex-row">
                                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                                <Button onClick={handlePurchase} disabled={isPurchasing || quantity < 1 || quantity > stockAvailable}>
                                    {isPurchasing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Solicitar (Contraentrega)
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
