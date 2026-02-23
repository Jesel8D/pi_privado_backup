'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Package, Edit, Trash2, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { productsService, Product } from '@/services/products.service';
import { toast } from 'sonner';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const data = await productsService.getAll();
            setProducts(data);
        } catch (error) {
            toast.error('Error al cargar productos');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`¿Estás seguro de eliminar "${name}"? Esta acción no se puede deshacer.`)) {
            try {
                await productsService.delete(id);
                toast.success('Producto eliminado con éxito');
                loadProducts();
            } catch (error) {
                toast.error('Error al eliminar producto');
            }
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-10 space-y-10 font-display min-h-screen bg-neo-white selection:bg-neo-red selection:text-white pb-24">
            {/* Header Neo-Brutalista */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b-4 border-black pb-8">
                <div className="space-y-2">
                    <div className="inline-block bg-neo-red text-white border-2 border-black px-3 py-1 font-black uppercase text-xs tracking-widest shadow-neo-sm transform -rotate-1 mb-2">
                        MI TIENDA / CATÁLOGO
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-black">
                        MI <span className="text-neo-red">STOCK</span>
                    </h1>
                    <p className="text-lg font-bold text-slate-500 uppercase tracking-tight max-w-md border-l-4 border-neo-yellow pl-4">
                        Gestiona tus productos, precios y controla tus existencias.
                    </p>
                </div>
                <Link href="/products/new" className="w-full lg:w-auto">
                    <button className="group w-full lg:w-auto px-8 py-5 bg-black text-white font-black uppercase text-xl border-4 border-black shadow-[6px_6px_0_0_#FFC72C] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all flex items-center justify-center gap-3 active:scale-95">
                        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                        NUEVO PRODUCTO
                    </button>
                </Link>
            </div>

            {/* Barra de Filtros */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Search className="h-6 w-6 text-black" />
                    </div>
                    <input
                        type="text"
                        placeholder="BUSCAR EN EL INVENTARIO..."
                        className="w-full h-16 pl-14 pr-4 border-4 border-black font-black uppercase tracking-wider text-black bg-white focus:bg-neo-yellow/5 focus:outline-none placeholder:text-slate-300 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-0 border-4 border-black translate-x-1.5 translate-y-1.5 -z-10 group-focus-within:translate-x-0 group-focus-within:translate-y-0 transition-transform bg-neo-yellow"></div>
                </div>
            </div>

            {/* Grid de Productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {isLoading ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-16 h-16 animate-spin text-black" />
                        <p className="font-black uppercase tracking-widest text-slate-400">Escaneando Almacén...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="col-span-full py-20 border-4 border-black border-dashed bg-white text-center">
                        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-2xl font-black uppercase text-slate-400">Sin existencias registradas</h3>
                        <p className="font-bold text-slate-400 uppercase text-xs mt-2">Empieza agregando tu primer producto estrella</p>
                    </div>
                ) : (
                    filteredProducts.map((product) => {
                        const margin = product.salePrice - product.unitCost;
                        const marginPercent = ((margin / product.salePrice) * 100).toFixed(0);
                        const isStockLow = (product.stock || 0) <= 5;

                        return (
                            <div key={product.id} className="bg-white border-4 border-black shadow-neo hover:-translate-y-2 transition-all group flex flex-col relative overflow-hidden">
                                {/* Badge de Perecedero */}
                                {product.isPerishable && (
                                    <div className="absolute top-4 right-4 bg-neo-red text-white border-2 border-black px-2 py-0.5 font-black text-[10px] uppercase tracking-widest z-10 -rotate-3">
                                        Perecedero
                                    </div>
                                )}

                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-14 h-14 border-4 border-black bg-neo-yellow flex items-center justify-center group-hover:rotate-6 transition-transform">
                                            <Package className="w-8 h-8 text-black" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Precio Venta</p>
                                            <p className="text-3xl font-black text-black tracking-tighter">${Number(product.salePrice).toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black uppercase leading-none mb-2 line-clamp-1" title={product.name}>
                                        {product.name}
                                    </h3>

                                    <div className="flex items-center gap-4 py-3 border-y-2 border-black border-dashed my-4">
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Costo</p>
                                            <p className="font-black text-black">${Number(product.unitCost).toFixed(2)}</p>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Margen</p>
                                            <p className={`font-black uppercase flex items-center gap-1 ${Number(marginPercent) > 30 ? 'text-neo-green' : 'text-neo-red'}`}>
                                                <TrendingUp size={12} /> {marginPercent}%
                                            </p>
                                        </div>
                                    </div>

                                    <div className={`p-3 border-2 border-black font-black uppercase text-sm flex justify-between items-center ${isStockLow ? 'bg-neo-red text-white' : 'bg-slate-50'}`}>
                                        <span>Stock Actual</span>
                                        <span className="text-2xl tracking-tighter">{product.stock || 0}</span>
                                    </div>
                                </div>

                                <div className="mt-auto border-t-4 border-black flex divide-x-4 divide-black">
                                    <Link href={`/products/${product.id}/stock`} className="flex-1">
                                        <button className="w-full py-4 font-black uppercase text-[10px] tracking-widest hover:bg-neo-yellow transition-colors flex items-center justify-center gap-2">
                                            <Package size={14} /> Stock
                                        </button>
                                    </Link>
                                    <Link href={`/products/${product.id}`} className="flex-1">
                                        <button className="w-full py-4 font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                                            <Edit size={14} /> Editar
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id, product.name)}
                                        className="flex-none px-4 py-4 text-neo-red hover:bg-neo-red hover:text-white transition-all active:scale-90"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
