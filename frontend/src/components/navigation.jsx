import {LayoutDashboard, Package, ShoppingCart, History, Store} from "lucide-react";
import {cn} from "../lib/utils.js";

const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'sales', label: 'Ventas', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'history', label: 'Historial', icon: History }
]

export function Navigation(currentView, onNavigate) {
    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                            <Store className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-foreground">MiTienda</h1>
                            <p className="text-xs text-muted-foreground">Punto de Venta</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <button
                                type="button"
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 font-medium",
                                    currentView === item.id
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-base">{item.label}</span>
                            </button>
                        )
                    })}
                </nav>
                <div className="p-4 border-t border-border">
                    <div className="bg-secondary rounded-xl p-4">
                        <p className="text-sm font-medium text-foreground">¿Necesitas ayuda?</p>
                        <p className="text-xs text-muted-foreground mt-1">Toca cualquier botón para ver más opciones</p>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom">
                <div className="flex justify-around items-center py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <button
                                type="button"
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={cn(
                                    "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-17.5",
                                    currentView === item.id
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <div className={cn(
                                    "p-2 rounded-xl transition-all",
                                    currentView === item.id && "bg-primary/10"
                                )}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-medium">{item.label}</span>
                            </button>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}