'use client';

import { useState, useEffect } from 'react';
import { productsService, Product } from '@/services/products.service';
import { Search, ShoppingBag, Store, Zap, Plus, ArrowRight, Loader2, Filter } from 'lucide-react';
import Link from 'next/link';

export default function MarketplacePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Todos');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async (q?: string) => {
        try {
            setLoading(true);
            const data = await productsService.getMarketplace(q);
            setProducts(data);
        } catch (error) {
            console.error("Error loading products", error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Todos', 'Comida', 'Snacks', 'Bebidas', 'Postres', 'Papelería'];

    return (
        <div className="bg-neo-white font-display min-h-screen selection:bg-neo-red selection:text-white pb-24 mt-16">
            {/* Search Header */}
            <header className="sticky top-[64px] z-40 w-full border-b-4 border-black bg-white shadow-neo-sm">
                <div className="max-w-7xl mx-auto flex h-20 items-center justify-between gap-4 px-4 md:px-8">
                    <div className="relative flex-1 group max-w-2xl">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <Search className="h-6 w-6 text-black" />
                        </div>
                        <input
                            type="text"
                            placeholder="¿QUÉ SE TE ANTOJA HOY?..."
                            className="w-full h-14 pl-14 pr-4 border-4 border-black font-black uppercase tracking-wider text-black bg-white focus:bg-neo-yellow/10 focus:outline-none placeholder:text-slate-300 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && loadProducts(searchQuery)}
                        />
                        <div className="absolute inset-0 border-4 border-black translate-x-1.5 translate-y-1.5 -z-10 group-focus-within:translate-x-0 group-focus-within:translate-y-0 transition-transform bg-neo-yellow"></div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-10 md:px-8 space-y-12">
                {/* Hero Banner Marketplace */}
                <section className="bg-black border-4 border-black p-8 md:p-12 shadow-neo-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neo-red rounded-full opacity-20 blur-3xl -mr-20 -mt-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative z-10 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-neo-yellow text-black border-2 border-black px-4 py-1 font-black uppercase text-xs tracking-widest -rotate-2">
                            <Zap size={16} /> EXPLORA TU COMUNIDAD
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.85] italic underline decoration-neo-red decoration-8 underline-offset-8">
                            TIENDITA <br /> CAMPUS
                        </h2>
                        <p className="max-w-lg text-lg font-bold text-slate-400 uppercase tracking-tight">
                            Encuentra los mejores productos directo de manos de otros estudiantes. Sin salir de la uni.
                        </p>
                    </div>
                    {/* Floating Icons decoration */}
                    <div className="absolute right-10 bottom-10 opacity-10 font-black text-9xl text-white select-none pointer-events-none rotate-12">
                        UNAM
                    </div>
                </section>

                {/* Categories */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 border-b-4 border-black pb-2">
                        <Filter className="text-neo-red" />
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-black">Categorías</h3>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex shrink-0 items-center gap-2 px-8 py-4 border-4 border-black font-black uppercase text-sm tracking-widest transition-all ${activeCategory === cat
                                    ? 'bg-neo-yellow text-black shadow-neo-sm translate-y-[-4px]'
                                    : 'bg-white text-slate-400 border-slate-200 hover:border-black hover:text-black'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 pb-20">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-[400px] border-4 border-black bg-white shadow-neo animate-pulse flex flex-col items-center justify-center gap-4 text-slate-100">
                                <Store size={64} />
                            </div>
                        ))
                    ) : products.length === 0 ? (
                        <div className="col-span-full border-4 border-black border-dashed p-20 text-center bg-white">
                            <Store className="w-20 h-20 mx-auto mb-6 text-slate-200" />
                            <h3 className="text-3xl font-black uppercase text-slate-300 tracking-tighter">Sin productos disponibles</h3>
                            <p className="font-bold text-slate-400 uppercase mt-2">Prueba con otra búsqueda o regresa más tarde.</p>
                        </div>
                    ) : (
                        products.map(product => (
                            <article key={product.id} className="group relative bg-white border-4 border-black shadow-neo hover:-translate-y-2 transition-all flex flex-col overflow-hidden">
                                {/* Badge de Precio */}
                                <div className="absolute top-4 right-4 z-10 bg-neo-yellow text-black border-2 border-black px-4 py-1.5 font-black text-xl tracking-tighter shadow-neo-sm rotate-2 group-hover:rotate-0 transition-transform">
                                    ${Number(product.salePrice).toFixed(2)}
                                </div>

                                {/* Image Placeholder / Preview */}
                                <div className="aspect-square bg-slate-50 border-b-4 border-black relative overflow-hidden">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover grayscale md:group-hover:grayscale-0 transition-all duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center grayscale">
                                            <ShoppingBag size={80} className="text-slate-200" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-neo-red/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <h4 className="text-xl font-black uppercase leading-tight text-black line-clamp-1 group-hover:text-neo-red transition-colors mb-2" title={product.name}>
                                        {product.name}
                                    </h4>

                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-6 h-6 border-2 border-black bg-black text-white flex items-center justify-center font-black text-[10px] uppercase">
                                            {product.seller?.fullName?.charAt(0) || 'V'}
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest truncate">
                                            @{product.seller?.fullName?.replace(/\s/g, '').toLowerCase() || 'vendedor'}
                                        </span>
                                    </div>

                                    <div className="mt-auto flex gap-3">
                                        <Link href={`/marketplace/product/${product.id}`} className="flex-1">
                                            <button className="w-full h-12 bg-black text-white font-black uppercase text-xs tracking-widest border-2 border-black hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                                                VER <ArrowRight size={14} />
                                            </button>
                                        </Link>
                                        <Link href={`/checkout?productId=${product.id}`}>
                                            <button className="h-12 w-12 bg-neo-red border-2 border-black text-white shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center active:scale-90">
                                                <Plus size={20} />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            </main>
        </div>
    );
}
