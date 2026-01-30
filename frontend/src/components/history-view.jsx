import { useState } from "react"
import { usePOS } from "../lib/context"
import { Card, CardContent } from "./ui/card.jsx"
import { Input } from "./ui/input.jsx"
import { Badge } from "./ui/badge.jsx"
import { Search, Calendar, CreditCard, Banknote, Smartphone, ChevronDown, ChevronUp, DollarSign, ShoppingBag } from "lucide-react"
import { cn } from "../lib/utils"

export function HistoryView() {
    const { transactions } = usePOS()
    const [searchTerm, setSearchTerm] = useState("")
    const [expandedTransaction, setExpandedTransaction] = useState(null)
    const [filterPayment, setFilterPayment] = useState('all')

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesPayment = filterPayment === 'all' || transaction.paymentMethod === filterPayment
        return matchesSearch && matchesPayment
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayTransactions = transactions.filter(t => new Date(t.date) >= today)
    const todaySales = todayTransactions.reduce((sum, t) => sum + t.total, 0)

    const getPaymentIcon = (method) => {
        switch (method) {
            case 'cash': return Banknote
            case 'card': return CreditCard
            case 'transfer': return Smartphone
        }
    }

    const getPaymentLabel = (method) => {
        switch (method) {
            case 'cash': return 'Efectivo'
            case 'card': return 'Tarjeta'
            case 'transfer': return 'Transferencia'
        }
    }

    const formatDate = (date) => {
        const d = new Date(date)
        const now = new Date()
        const isToday = d.toDateString() === now.toDateString()

        if (isToday) {
            return `Hoy, ${d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}`
        }

        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        const isYesterday = d.toDateString() === yesterday.toDateString()

        if (isYesterday) {
            return `Ayer, ${d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}`
        }

        return d.toLocaleDateString('es', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Historial de Ventas</h1>
                <p className="text-muted-foreground">Revisa todas tus transacciones</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-primary text-primary-foreground border-0 shadow-lg shadow-primary/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs opacity-80">Ventas Hoy</p>
                                <p className="text-xl font-bold">${todaySales.toFixed(2)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-secondary-foreground" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Total Transacciones</p>
                                <p className="text-xl font-bold text-foreground">{transactions.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filter */}
            <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Buscar por ID o producto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-12 text-base bg-card"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {[
                        { id: 'all', label: 'Todos' },
                        { id: 'cash', label: 'Efectivo', icon: Banknote },
                        { id: 'card', label: 'Tarjeta', icon: CreditCard },
                        { id: 'transfer', label: 'Transfer', icon: Smartphone },
                    ].map((filter) => (
                        <button
                            type="button"
                            key={filter.id}
                            onClick={() => setFilterPayment(filter.id)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2",
                                filterPayment === filter.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card text-muted-foreground border border-border hover:border-primary hover:text-primary"
                            )}
                        >
                            {filter.icon && <filter.icon className="w-4 h-4" />}
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transactions List */}
            <div className="space-y-3">
                {filteredTransactions.length === 0 ? (
                    <Card className="border shadow-sm">
                        <CardContent className="p-8 text-center">
                            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-muted-foreground">No se encontraron transacciones</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredTransactions.map((transaction) => {
                        const Icon = getPaymentIcon(transaction.paymentMethod)
                        const isExpanded = expandedTransaction === transaction.id

                        return (
                            <Card key={transaction.id} className="border shadow-sm overflow-hidden">
                                <button
                                    type="button"
                                    className="w-full text-left"
                                    onClick={() => setExpandedTransaction(isExpanded ? null : transaction.id)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                                                    <Icon className="w-5 h-5 text-secondary-foreground" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-foreground">{transaction.id}</p>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {getPaymentLabel(transaction.paymentMethod)}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {transaction.items.length} producto{transaction.items.length !== 1 ? 's' : ''} • {formatDate(transaction.date)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-lg font-bold text-primary">${transaction.total.toFixed(2)}</p>
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </button>

                                {isExpanded && (
                                    <div className="border-t border-border bg-secondary/30 p-4 animate-in slide-in-from-top-2 duration-200">
                                        <p className="text-sm font-medium text-foreground mb-3">Detalle de productos:</p>
                                        <div className="space-y-2">
                                            {transaction.items.map((item, index) => (
                                                <div key={`${item.id}-${index}`} className="flex justify-between text-sm">
                                                    <span className="text-foreground">{item.quantity}x {item.name}</span>
                                                    <span className="font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t border-border mt-3 pt-3 space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Subtotal</span>
                                                <span className="font-medium text-foreground">${transaction.total.toFixed(2)}</span>
                                            </div>
                                            {transaction.paymentMethod === 'cash' && transaction.cashReceived && (
                                                <>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Efectivo recibido</span>
                                                        <span className="text-foreground">${transaction.cashReceived.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Cambio</span>
                                                        <span className="text-primary font-medium">${transaction.change?.toFixed(2)}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
