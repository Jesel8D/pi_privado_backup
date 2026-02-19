'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Store, Calendar, MapPin, Loader2, MessageCircle } from 'lucide-react';
import { usersService, PublicUser } from '@/services/users.service';
import { productsService, Product } from '@/services/products.service';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function SellerProfilePage({ params }: { params: { id: string } }) {
    const [seller, setSeller] = useState<PublicUser | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [userData, productsData] = await Promise.all([
                    usersService.getPublicProfile(params.id),
                    productsService.getMarketplace('', params.id)
                ]);
                setSeller(userData);
                setProducts(productsData);
            } catch (err: any) {
                console.error(err);
                setError('No pudimos cargar la información del vendedor.');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            loadData();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (error || !seller) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Ups... 😕</h1>
                <p className="text-gray-600">{error || 'Vendedor no encontrado'}</p>
                <Link href="/marketplace">
                    <Button variant="outline">Volver al Marketplace</Button>
                </Link>
            </div>
        );
    }

    const hasActiveStock = products.length > 0; // El endpoint getMarketplace ya filtra stock > 0
    const joinedDate = new Date(seller.createdAt).toLocaleDateString('es-MX', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Navbar Simple */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/marketplace" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                        ← Volver a la Tienda
                    </Link>
                    <Link href="/" className="font-bold text-xl text-gray-900">
                        TienditaCampus
                    </Link>
                </div>
            </nav>

            {/* Header Profile */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                        <Avatar className="w-24 h-24 border-4 border-gray-50 shadow-md">
                            <AvatarImage src={seller.avatarUrl || ''} alt={seller.firstName} />
                            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                                {seller.firstName.charAt(0)}{seller.lastName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                            <div className="flex flex-col md:flex-row items-center gap-3">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {seller.firstName} {seller.lastName}
                                </h1>
                                {hasActiveStock ? (
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 px-3 py-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                                        Vendiendo Ahora
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="px-3 py-1">
                                        Sin venta activa
                                    </Badge>
                                )}
                            </div>

                            <p className="text-gray-500 flex items-center justify-center md:justify-start gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                    <Store size={16} /> Vendedor Verificado
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={16} /> Miembro desde {joinedDate}
                                </span>
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button className="gap-2 bg-green-600 hover:bg-green-700">
                                <MessageCircle size={18} />
                                Contactar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        Menú de Hoy ({products.length})
                    </h2>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                        <Store size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No hay productos disponibles</h3>
                        <p className="text-gray-500">
                            {seller.firstName} no ha publicado nada para vender en este momento.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
