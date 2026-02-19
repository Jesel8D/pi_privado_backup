import {
    DollarSign,
    Package,
    TrendingUp,
    Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming these exist mostly

export default function DashboardPage() {
    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    {/* Calendar Date Picker Placeholder */}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Revenue Card */}
                <Card className="hover-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Ingresos Totales
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">$12,345.00</div>
                        <p className="text-xs text-muted-foreground">
                            +15% respecto al mes pasado
                        </p>
                    </CardContent>
                </Card>

                {/* Sales Card */}
                <Card className="hover-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Ventas
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">+573</div>
                        <p className="text-xs text-muted-foreground">
                            +201 desde la última hora
                        </p>
                    </CardContent>
                </Card>

                {/* Products Card */}
                <Card className="hover-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Productos Activos
                        </CardTitle>
                        <Package className="h-4 w-4 text-violet-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">24</div>
                        <p className="text-xs text-muted-foreground">
                            2 bajo inventario
                        </p>
                    </CardContent>
                </Card>

                {/* Customers Card (Optional) */}
                <Card className="hover-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Clientes Recurrentes
                        </CardTitle>
                        <Users className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">12</div>
                        <p className="text-xs text-muted-foreground">
                            +2 nuevos esta semana
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 hover-card">
                    <CardHeader>
                        <CardTitle>Resumen de Ventas</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {/* Chart placeholder */}
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg">
                            Gráfica de Ventas (Próximamente)
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 hover-card">
                    <CardHeader>
                        <CardTitle>Ventas Recientes</CardTitle>
                        {/* Description */}
                    </CardHeader>
                    <CardContent>
                        {/* List of recent sales placeholder */}
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none text-foreground">Cliente #{i}</p>
                                        <p className="text-xs text-muted-foreground">compra@ejemplo.com</p>
                                    </div>
                                    <div className="ml-auto font-medium text-foreground">+$150.00</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
