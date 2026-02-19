import { Store, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/services/products.service';

export function ProductCard({ product }: { product: Product }) {
    // Generar link de WhatsApp
    // Nota: El backend debería retornar el teléfono del vendedor. Por ahora usaremos un placeholder o el email.
    // Asumiremos que product.seller tiene info, pero la interfaz Product actual no lo tipa.
    // Vamos a castear a any temporalmente para acceder al seller si viene del include.
    const sellerName = (product as any).seller?.fullName || 'Estudiante UP';
    const sellerId = (product as any).seller?.id;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-300 text-4xl font-bold bg-gray-50">
                        {product.name.charAt(0)}
                    </div>
                )}
                {product.isPerishable && (
                    <span className="absolute top-2 right-2 bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded-full">
                        Perecedero
                    </span>
                )}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                        {sellerId && (
                            <a href={`/seller/${sellerId}`} className="text-sm text-gray-500 flex items-center gap-1 hover:text-primary transition-colors">
                                <Store size={14} /> {sellerName}
                            </a>
                        )}
                        {!sellerId && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Store size={14} /> {sellerName}
                            </p>
                        )}
                    </div>
                    <span className="font-bold text-lg text-primary">
                        ${Number(product.salePrice).toFixed(2)}
                    </span>
                </div>
                {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                        {product.description}
                    </p>
                )}

                {(() => {
                    const sellerPhone = (product as any).seller?.phone;
                    const message = encodeURIComponent(`Hola, me interesa tu producto: ${product.name}`);
                    const whatsappUrl = sellerPhone ? `https://wa.me/${sellerPhone}?text=${message}` : '#';

                    return (
                        <Button
                            className="w-full gap-2 transition-transform active:scale-95"
                            disabled={!sellerPhone}
                            onClick={() => {
                                if (sellerPhone) {
                                    window.open(whatsappUrl, '_blank');
                                } else {
                                    // Fallback if no phone: maybe show a toast or alert?
                                    alert('El vendedor no ha registrado un número de contacto.');
                                }
                            }}
                        >
                            Me interesa <ExternalLink size={16} />
                        </Button>
                    );
                })()}
            </div>
        </div>
    );
}
