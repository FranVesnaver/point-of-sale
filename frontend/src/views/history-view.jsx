import { useState } from "react";
import { usePOS } from "../lib/context.jsx";
import { Card, CardContent } from "../components/ui/card.jsx";
import { StatsCard } from "../components/stats-card.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { Calendar, CreditCard, Banknote, Smartphone, ChevronDown, ChevronUp, DollarSign, ShoppingBag, CircleQuestionMark } from "lucide-react";
import { SearchBar } from "../components/search-bar.jsx";
import { FilterChips } from "../components/filter-chips.jsx";

export function HistoryView() {
    const { transactions } = usePOS();
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedTransaction, setExpandedTransaction] = useState(null);
    const [filterPayment, setFilterPayment] = useState('all');

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = String(transaction.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesPayment = filterPayment === 'all' || transaction.paymentMethod === filterPayment;
        return matchesSearch && matchesPayment;
    })

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTransactions = transactions.filter(t => new Date(t.date) >= today);
    const todaySales = todayTransactions.reduce((sum, t) => sum + t.total, 0);

    const getPaymentIcon = (method) => {
        switch (method) {
            case "CASH": return Banknote
            case "CARD": return CreditCard
            case "TRANSFER": return Smartphone
            default: return CircleQuestionMark
        }
    }

    const getPaymentLabel = (method) => {
        switch (method) {
            case "CASH": return 'Efectivo'
            case "CARD": return 'Tarjeta'
            case "TRANSFER": return 'Transferencia'
            default: return 'Otro'
        }
    }

    const formatDate = (date) => {
        const d = new Date(date);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();

        if (isToday) {
            return `Hoy, ${d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}`;
        }

        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = d.toDateString() === yesterday.toDateString();

        if (isYesterday) {
            return `Ayer, ${d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}`;
        }

        return d.toLocaleDateString('es', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                <StatsCard
                    label="Ventas Hoy"
                    value={`$${todaySales.toFixed(2)}`}
                    icon={DollarSign}
                    variant="primary"
                />
                <StatsCard
                    label="Total Transacciones"
                    value={transactions.length}
                    icon={ShoppingBag}
                />
            </div>

            {/* Search and Filter */}
            <div className="space-y-3">
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    placeholder="Buscar por ID o producto..."
                ></SearchBar>
                <FilterChips
                    items={[
                        { id: "all", label: "Todos" },
                        { id: "CASH", label: "Efectivo", icon: Banknote },
                        { id: "CARD", label: "Tarjeta", icon: CreditCard },
                        { id: "TRANSFER", label: "Transfer", icon: Smartphone },
                    ]}
                    selectedId={filterPayment}
                    onSelect={setFilterPayment}
                />
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
                                                        <p className="font-semibold text-foreground">Venta {transaction.id}</p>
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
                                                    <span className="text-foreground">{item.quantity}x {item.productName}</span>
                                                    <span className="font-medium text-foreground">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t border-border mt-3 pt-3 space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Subtotal</span>
                                                <span className="font-medium text-foreground">${transaction.total.toFixed(2)}</span>
                                            </div>
                                            {transaction.paymentMethod === "CASH" && transaction.cashReceived && (
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
