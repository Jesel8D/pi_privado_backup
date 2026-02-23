'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Store, Calendar, MapPin, Loader2, MessageCircle } from 'lucide-react';
import { usersService, PublicUser } from '@/services/users.service';
import { Product } from '@/services/products.service';
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
                const userData = await usersService.getPublicProfile(params.id);
                setSeller(userData);
                setProducts(userData.products || []);
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
        <div className="min-h-screen bg-[#f7f7f7] pb-20">
            {/* Navbar Simple */}
            <nav className="bg-white sticky top-0 z-30 border-b-2 border-slate-900 dark:border-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link
                        href="/marketplace"
                        className="px-3 py-1.5 text-sm font-black uppercase tracking-wide text-slate-900 border-2 border-slate-900 dark:border-white hover:bg-[#FFC72C] transition-colors"
                    >
                        Volver
                    </Link>
                    <Link href="/" className="font-black text-lg sm:text-xl uppercase tracking-tight text-slate-900">
                        Tiendita<span className="text-[#E31837]">Campus</span>
                    </Link>
                </div>
            </nav>

            {/* Header Profile */}
            <div className="bg-white border-b-2 border-slate-900 dark:border-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="border-2 border-slate-900 dark:border-white shadow-[6px_6px_0px_0px_#E31837] bg-white p-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                            <Avatar className="w-24 h-24 border-2 border-slate-900 dark:border-white shadow-[4px_4px_0px_0px_#FFC72C] rounded-none">
                                <AvatarImage src={seller.avatarUrl || ''} alt={seller.firstName} />
                                <AvatarFallback className="text-2xl font-black bg-[#FFC72C] text-slate-900 rounded-none">
                                    {seller.firstName.charAt(0)}{seller.lastName.charAt(0)}
                                </AvatarFallback>
                            </Avatar>

                        <div className="flex-1 space-y-2">
                            <div className="flex flex-col md:flex-row items-center gap-3">
                                <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">
                                    {seller.firstName} {seller.lastName}
                                </h1>
                                {hasActiveStock ? (
                                    <Badge className="bg-[#FFC72C] text-slate-900 hover:bg-[#FFC72C] border-2 border-slate-900 dark:border-white px-3 py-1 rounded-none font-black uppercase tracking-wide">
                                        <span className="w-2 h-2 bg-green-500 mr-2" />
                                        Vendiendo Ahora
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="px-3 py-1 rounded-none border-2 border-slate-900 dark:border-white font-black uppercase tracking-wide">
                                        Sin venta activa
                                    </Badge>
                                )}
                            </div>

                            <p className="text-slate-700 flex items-center justify-center md:justify-start gap-4 text-sm font-medium">
                                <span className="flex items-center gap-1">
                                    <Store size={16} className="text-slate-900" /> Vendedor Verificado
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={16} className="text-slate-900" /> Miembro desde {joinedDate}
                                </span>
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button className="gap-2 bg-[#E31837] hover:bg-[#c9122e] border-2 border-slate-900 dark:border-white font-black uppercase shadow-[4px_4px_0px_0px_#FFC72C]">
                                <MessageCircle size={18} />
                                Contactar
                            </Button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="inline-flex items-center gap-2 border-2 border-slate-900 dark:border-white bg-[#FFC72C] px-3 py-1 text-xs font-black uppercase tracking-widest">
                        Menú de hoy: {products.length}
                    </div>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="border-2 border-slate-900 dark:border-white bg-white shadow-[6px_6px_0px_0px_#E31837] p-10 text-center">
                        <div className="mx-auto mb-4 w-fit border-2 border-slate-900 dark:border-white bg-[#FFC72C] px-3 py-1 text-xs font-black uppercase tracking-widest">
                            Sin productos
                        </div>
                        <Store size={44} className="mx-auto text-slate-900 mb-4" />
                        <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">No hay productos disponibles</h3>
                        <p className="mt-2 text-slate-700 font-medium">
                            {seller.firstName} no ha publicado nada para vender en este momento.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
