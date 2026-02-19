'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import { Search, ShoppingBag, Store, ExternalLink, Loader2 } from 'lucide-react';
import { productsService, Product } from '@/services/products.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ProductCard } from '@/components/product-card';

export default function MarketplacePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch] = useDebounce(searchTerm, 500);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await productsService.getMarketplace(debouncedSearch);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching marketplace:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [debouncedSearch]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar Simple */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-primary text-white p-1.5 rounded-lg">
                            <Store size={20} />
                        </div>
                        <span className="font-bold text-xl text-gray-900">TienditaCampus</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost">Soy Vendedor</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header & Search */}
                <div className="mb-8 space-y-4">
                    <h1 className="text-3xl font-bold text-gray-900">¿Qué se te antoja hoy? 😋</h1>
                    <div className="relative max-w-xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                            placeholder="Buscar snacks, postres, bebidas..."
                            className="pl-10 h-12 text-lg shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid de Productos */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No encontramos productos</h3>
                        <p className="text-gray-500">Intenta buscar con otro término.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
