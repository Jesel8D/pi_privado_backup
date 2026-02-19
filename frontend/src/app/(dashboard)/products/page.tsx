'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Package, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'; // Assuming these exist, if not I will use simple divs or create them
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

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                await productsService.delete(id);
                toast.success('Producto eliminado');
                loadProducts(); // Reload list
            } catch (error) {
                toast.error('Error al eliminar producto');
            }
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventario</h1>
                    <p className="text-muted-foreground">Gestiona tu catálogo de productos, precios y stock.</p>
                </div>
                <Link href="/products/new">
                    <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
                    </Button>
                </Link>
            </div>

            <Card className="border-none shadow-md bg-card">
                <CardHeader className="pb-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar productos..."
                            className="pl-9 bg-background border-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p>No se encontraron productos.</p>
                        </div>
                    ) : (
                        <div className="rounded-md border border-border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Costo</TableHead>
                                        <TableHead>Precio Venta</TableHead>
                                        <TableHead>Margen</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => {
                                        const margin = product.salePrice - product.unitCost;
                                        const marginPercent = ((margin / product.salePrice) * 100).toFixed(1);

                                        return (
                                            <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-medium">
                                                    <div className="flex flex-col">
                                                        <span className="text-foreground">{product.name}</span>
                                                        {product.isPerishable && (
                                                            <span className="text-[10px] text-orange-500 font-semibold uppercase tracking-wider">Perecedero</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>${Number(product.unitCost).toFixed(2)}</TableCell>
                                                <TableCell className="font-bold text-primary">${Number(product.salePrice).toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <span className={Number(marginPercent) > 30 ? "text-green-600" : "text-yellow-600"}>
                                                        {marginPercent}%
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/products/${product.id}/stock`}>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-green-600" title="Gestionar Stock">
                                                                <Package className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/products/${product.id}`}>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                            onClick={() => handleDelete(product.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
