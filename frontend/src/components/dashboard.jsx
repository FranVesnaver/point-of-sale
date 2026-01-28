import {Card, CardContent, CardHeader, CardTitle} from "./ui/card.jsx";
import {AlertTriangle, DollarSign, ShoppingBag, Package, TrendingUp, Clock} from "lucide-react";

import {sampleProducts, sampleTransactions} from "../lib/sample-data.js";

function Dashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // sample data
    const transactions = sampleTransactions;

    const products = sampleProducts;

    const todayTransactions = transactions.filter(transaction => new Date(transaction.date) >= today);
    const todaySales = todayTransactions.reduce((sum, transaction) => sum + transaction.total, 0);
    const lowStockProducts = products.filter(product => product.stock <= product.lowStockThreshold);

    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">¡Buen día!</h1>
                <p className="text-muted-foreground mt-1">Aquí está el resumen de tu negocio</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-primary text-primary-foreground border-0 shadow-lg shadow-primary/20">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div>
                                <p className="text-xs md:text-sm opacity-80">Ventas Hoy</p>
                                <p className="text-xl md:text-2xl font-bold">${todaySales.toFixed(2)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-accent-foreground" />
                            </div>
                            <div>
                                <p className="text-xs md:text-sm text-muted-foreground">Transacciones</p>
                                <p className="text-xl md:text-2xl font-bold text-foreground">{todayTransactions.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary flex items-center justify-center">
                                <Package className="w-5 h-5 md:w-6 md:h-6 text-secondary-foreground" />
                            </div>
                            <div>
                                <p className="text-xs md:text-sm text-muted-foreground">Productos</p>
                                <p className="text-xl md:text-2xl font-bold text-foreground">{products.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={lowStockProducts.length > 0 ? "border-destructive/50 bg-destructive/5 border" : "border shadow-sm"}>
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${lowStockProducts.length > 0 ? "bg-destructive/20" : "bg-secondary"}`}>
                                <AlertTriangle className={`w-5 h-5 md:w-6 md:h-6 ${lowStockProducts.length > 0 ? "text-destructive" : "text-secondary-foreground"}`} />
                            </div>
                            <div>
                                <p className="text-xs md:text-sm text-muted-foreground">Stock Bajo</p>
                                <p className="text-xl md:text-2xl font-bold text-foreground">{lowStockProducts.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>


            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Sales */}
                <Card className="border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Clock className="w-5 h-5 text-primary" />
                            Ventas Recientes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentTransactions.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No hay ventas recientes</p>
                        ) : (
                            <div className="space-y-3">
                                {recentTransactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center">
                                                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-foreground">{transaction.id}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {transaction.items.length} producto{transaction.items.length !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-primary">${transaction.total.toFixed(2)}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(transaction.date).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Low Stock Alert */}
                <Card className="border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                            Productos con Stock Bajo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {lowStockProducts.length === 0 ? (
                            <div className="text-center py-8">
                                <TrendingUp className="w-12 h-12 mx-auto text-primary mb-2" />
                                <p className="text-muted-foreground">¡Excelente! Todos los productos tienen buen stock</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {lowStockProducts.slice(0, 5).map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between p-3 rounded-xl bg-destructive/5 border border-destructive/20"
                                    >
                                        <div>
                                            <p className="font-medium text-sm text-foreground">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">{product.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-destructive">{product.stock} unid.</p>
                                            <p className="text-xs text-muted-foreground">Mín: {product.lowStockThreshold}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>


    )
}

export default Dashboard;