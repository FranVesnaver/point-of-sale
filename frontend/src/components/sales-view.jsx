import { useState } from "react"
import { usePOS } from "../lib/context"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx"
import { Button } from "./ui/button.jsx"
import { Input } from "./ui/input.jsx"
import { Badge } from "./ui/badge.jsx"
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote, Smartphone, X, Check } from "lucide-react"
import { categories } from "../lib/sample-data"
import { cn } from "../lib/utils"

export function SalesView() {
    const { products, cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, addTransaction } = usePOS()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("Todos")
    const [showPayment, setShowPayment] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('cash')
    const [cashReceived, setCashReceived] = useState("")
    const [showSuccess, setShowSuccess] = useState(false)

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.barcode?.includes(searchTerm)
        const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const handlePayment = () => {
        const transaction = {
            id: `TRX${String(Date.now()).slice(-6)}`,
            items: [...cart],
            total: cartTotal,
            paymentMethod,
            date: new Date(),
            ...(paymentMethod === 'cash' && {
                cashReceived: Number.parseFloat(cashReceived),
                change: Number.parseFloat(cashReceived) - cartTotal
            })
        }
        addTransaction(transaction)
        clearCart()
        setShowPayment(false)
        setCashReceived("")
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
    }

    const change = paymentMethod === 'cash' && cashReceived
        ? Number.parseFloat(cashReceived) - cartTotal
        : 0

    return (
        <div className="h-full flex flex-col lg:flex-row gap-4">
            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-2xl p-8 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">¡Venta Completada!</h3>
                        <p className="text-muted-foreground mt-2">La transacción se ha registrado correctamente</p>
                    </div>
                </div>
            )}

            {/* Products Section */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Search */}
                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Buscar producto o código de barras..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-12 text-base bg-card border-border"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            type="button"
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                                selectedCategory === category
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card text-muted-foreground border border-border hover:border-primary hover:text-primary"
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                        {filteredProducts.map((product) => {
                            const inCart = cart.find(item => item.id === product.id)
                            const isOutOfStock = product.stock === 0
                            return (
                                <button
                                    type="button"
                                    key={product.id}
                                    onClick={() => !isOutOfStock && addToCart(product)}
                                    disabled={isOutOfStock}
                                    className={cn(
                                        "p-4 rounded-xl text-left transition-all border",
                                        isOutOfStock
                                            ? "bg-muted border-border opacity-60 cursor-not-allowed"
                                            : inCart
                                                ? "bg-primary/10 border-primary"
                                                : "bg-card border-border hover:border-primary hover:shadow-md"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="secondary" className="text-xs">
                                            {product.category}
                                        </Badge>
                                        {inCart && (
                                            <Badge className="bg-primary text-primary-foreground">
                                                {inCart.quantity}
                                            </Badge>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">{product.name}</h3>
                                    <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                                    <p className={cn(
                                        "text-xs mt-1",
                                        product.stock <= product.lowStockThreshold ? "text-destructive" : "text-muted-foreground"
                                    )}>
                                        {isOutOfStock ? "Sin stock" : `${product.stock} disponibles`}
                                    </p>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Cart Section - Desktop */}
            <Card className="hidden lg:flex flex-col w-96 border shadow-lg">
                <CardHeader className="border-b border-border pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                        Carrito ({cart.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
                    {cart.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                            <ShoppingCart className="w-16 h-16 mb-4 opacity-30" />
                            <p className="text-center">Agrega productos tocando en ellos</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-foreground truncate">{item.name}</p>
                                            <p className="text-sm text-primary font-semibold">${item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 bg-transparent"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </Button>
                                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 bg-transparent"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.stock}
                                            >
                                                <Plus className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-border pt-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-medium text-foreground">Total:</span>
                                    <span className="text-2xl font-bold text-primary">${cartTotal.toFixed(2)}</span>
                                </div>
                                <Button
                                    className="w-full h-14 text-lg font-semibold"
                                    onClick={() => setShowPayment(true)}
                                >
                                    Cobrar
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full bg-transparent"
                                    onClick={clearCart}
                                >
                                    Vaciar Carrito
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Mobile Cart Button */}
            {cart.length > 0 && (
                <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40">
                    <Button
                        className="w-full h-14 text-lg font-semibold shadow-lg"
                        onClick={() => setShowPayment(true)}
                    >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Cobrar ${cartTotal.toFixed(2)} ({cart.length})
                    </Button>
                </div>
            )}

            {/* Payment Modal */}
            {showPayment && (
                <div className="fixed inset-0 bg-foreground/50 flex items-end lg:items-center justify-center z-50">
                    <div className="bg-card w-full lg:w-120 lg:rounded-2xl rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-foreground">Completar Venta</h2>
                            <Button variant="ghost" size="icon" onClick={() => setShowPayment(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Cart Summary */}
                        <div className="bg-secondary/50 rounded-xl p-4 mb-6 max-h-40 overflow-y-auto">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm py-1">
                                    <span className="text-foreground">{item.quantity}x {item.name}</span>
                                    <span className="font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mb-6 p-4 bg-primary/10 rounded-xl">
                            <span className="text-lg font-medium text-foreground">Total a Cobrar:</span>
                            <span className="text-2xl font-bold text-primary">${cartTotal.toFixed(2)}</span>
                        </div>

                        {/* Payment Methods */}
                        <p className="text-sm font-medium text-foreground mb-3">Método de Pago:</p>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('cash')}
                                className={cn(
                                    "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                                    paymentMethod === 'cash'
                                        ? "border-primary bg-primary/10"
                                        : "border-border hover:border-primary/50"
                                )}
                            >
                                <Banknote className={cn("w-6 h-6", paymentMethod === 'cash' ? "text-primary" : "text-muted-foreground")} />
                                <span className={cn("text-sm font-medium", paymentMethod === 'cash' ? "text-primary" : "text-foreground")}>Efectivo</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('card')}
                                className={cn(
                                    "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                                    paymentMethod === 'card'
                                        ? "border-primary bg-primary/10"
                                        : "border-border hover:border-primary/50"
                                )}
                            >
                                <CreditCard className={cn("w-6 h-6", paymentMethod === 'card' ? "text-primary" : "text-muted-foreground")} />
                                <span className={cn("text-sm font-medium", paymentMethod === 'card' ? "text-primary" : "text-foreground")}>Tarjeta</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('transfer')}
                                className={cn(
                                    "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                                    paymentMethod === 'transfer'
                                        ? "border-primary bg-primary/10"
                                        : "border-border hover:border-primary/50"
                                )}
                            >
                                <Smartphone className={cn("w-6 h-6", paymentMethod === 'transfer' ? "text-primary" : "text-muted-foreground")} />
                                <span className={cn("text-sm font-medium", paymentMethod === 'transfer' ? "text-primary" : "text-foreground")}>Transfer</span>
                            </button>
                        </div>

                        {/* Cash Input */}
                        {paymentMethod === 'cash' && (
                            <div className="mb-6">
                                <label className="text-sm font-medium text-foreground mb-2 block">Efectivo Recibido:</label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={cashReceived}
                                    onChange={(e) => setCashReceived(e.target.value)}
                                    className="h-14 text-xl font-bold text-center"
                                />
                                {change > 0 && (
                                    <div className="mt-3 p-4 bg-accent rounded-xl text-center">
                                        <p className="text-sm text-accent-foreground">Cambio a devolver:</p>
                                        <p className="text-2xl font-bold text-accent-foreground">${change.toFixed(2)}</p>
                                    </div>
                                )}

                                {/* Quick amounts */}
                                <div className="grid grid-cols-4 gap-2 mt-3">
                                    {[5, 10, 20, 50].map((amount) => (
                                        <Button
                                            key={amount}
                                            variant="outline"
                                            onClick={() => setCashReceived(String(amount))}
                                            className="h-10"
                                        >
                                            ${amount}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button
                            className="w-full h-14 text-lg font-semibold"
                            onClick={handlePayment}
                            disabled={paymentMethod === 'cash' && (Number.parseFloat(cashReceived) || 0) < cartTotal}
                        >
                            <Check className="w-5 h-5 mr-2" />
                            Confirmar Venta
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
