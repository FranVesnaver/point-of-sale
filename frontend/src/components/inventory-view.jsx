import { useState } from "react"
import { usePOS } from "../lib/context"
import { Card, CardContent } from "./ui/card.jsx"
import { Button } from "./ui/button.jsx"
import { Input } from "./ui/input.jsx"
import { Badge } from "./ui/badge.jsx"
import { Search, Plus, Minus, Package, AlertTriangle, Edit2, Check, X } from "lucide-react"
import { categories } from "../lib/sample-data"
import { cn } from "../lib/utils"

export function InventoryView() {
    const { products, setProducts, updateProductStock } = usePOS()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("Todos")
    const [editingProductStock, setEditingProductStock] = useState(null)
    const [editStock, setEditStock] = useState("")
    const [showAddProduct, setShowAddProduct] = useState(false)
    const [showEditProduct, setShowEditProduct] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: 0,
        stock: 0,
        category: "Abarrotes",
        lowStockThreshold: 10
    })

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.barcode?.includes(searchTerm)
        const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length

    const handleSaveStock = (productId) => {
        const newStockValue = Number.parseInt(editStock)
        if (!Number.isNaN(newStockValue) && newStockValue >= 0) {
            updateProductStock(productId, newStockValue)
        }
        setEditingProductStock(null)
        setEditStock("")
    }

    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.price) return

        const product = {
            id: String(Date.now()),
            name: newProduct.name,
            price: newProduct.price,
            stock: newProduct.stock || 0,
            category: newProduct.category || "Abarrotes",
            lowStockThreshold: newProduct.lowStockThreshold || 10,
            barcode: newProduct.barcode
        }

        setProducts([...products, product])
        setShowAddProduct(false)
        setNewProduct({
            name: "",
            price: 0,
            stock: 0,
            category: "Abarrotes",
            lowStockThreshold: 10
        })
    }

    const handleEditProduct = () => {
        if (!editingProduct.name || !editingProduct.price) return

        const product = products.find(product => product.id === editingProduct.id)
        products.splice(products.indexOf(product), 1)

        setProducts([...products, editingProduct])

        setShowEditProduct(false)
        setEditingProduct(null)
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Inventario</h1>
                    <p className="text-muted-foreground">Gestiona tus productos y stock</p>
                </div>
                <Button onClick={() => setShowAddProduct(true)} className="shrink-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Producto
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Total Productos</p>
                                <p className="text-xl font-bold text-foreground">{products.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={cn("border shadow-sm", lowStockCount > 0 && "border-destructive/50")}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", lowStockCount > 0 ? "bg-destructive/10" : "bg-secondary")}>
                                <AlertTriangle className={cn("w-5 h-5", lowStockCount > 0 ? "text-destructive" : "text-muted-foreground")} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Stock Bajo</p>
                                <p className="text-xl font-bold text-foreground">{lowStockCount}</p>
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
                        placeholder="Buscar producto o código..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-12 text-base bg-card"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
            </div>

            {/* Products List */}
            <div className="space-y-3">
                {filteredProducts.map((product) => {
                    const isLowStock = product.stock <= product.lowStockThreshold
                    const isEditingStock = editingProductStock === product.id

                    return (
                        <Card key={product.id} className={cn("border shadow-sm transition-all", isLowStock && "border-destructive/30")}>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                                            <Badge variant="secondary" className="text-xs shrink-0">
                                                {product.category}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => {
                                                    setEditingProduct(product)
                                                    setShowEditProduct(true)
                                                }}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                                        {product.barcode && (
                                            <p className="text-xs text-muted-foreground mt-1">Código: {product.barcode}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        {isEditingStock ? (
                                            <div className="flex items-center gap-2">
                                                <div className="items-center inline-block text-center">
                                                    <p className="text-xs text-muted-foreground">Stock</p>
                                                    <Input
                                                        type="number"
                                                        value={editStock}
                                                        onChange={(e) => setEditStock(e.target.value)}
                                                        className="w-20 h-10 text-center"
                                                        min="0"
                                                        autoFocus
                                                    />
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 text-primary"
                                                    onClick={() => handleSaveStock(product.id)}
                                                >
                                                    <Check className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10"
                                                    onClick={() => {
                                                        setEditingProductStock(null)
                                                        setEditStock("")
                                                    }}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "px-3 py-2 rounded-lg text-center min-w-20",
                                                    isLowStock ? "bg-destructive/10 text-destructive" : "bg-secondary"
                                                )}>
                                                    <p className="text-xs text-muted-foreground">Stock</p>
                                                    <p className="font-bold text-lg">{product.stock}</p>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 bg-transparent"
                                                        onClick={() => updateProductStock(product.id, product.stock + 1)}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 bg-transparent"
                                                        onClick={() => updateProductStock(product.id, Math.max(0, product.stock - 1))}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => {
                                                        setEditingProductStock(product.id)
                                                        setEditStock(String(product.stock))
                                                    }}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                        {isLowStock && (
                                            <Badge variant="destructive" className="text-xs">
                                                Stock bajo (mín: {product.lowStockThreshold})
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Add Product Modal */}
            {showAddProduct && (
                <div className="fixed inset-0 bg-foreground/50 flex items-end lg:items-center justify-center z-50">
                    <div className="bg-card w-full lg:w-120 lg:rounded-2xl rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-foreground">Nuevo Producto</h2>
                            <Button variant="ghost" size="icon" onClick={() => setShowAddProduct(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Nombre del Producto *</label>
                                <Input
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                    placeholder="Ej: Leche Entera 1L"
                                    className="h-12"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Precio *</label>
                                    <Input
                                        type="number"
                                        value={newProduct.price || ""}
                                        onChange={(e) => setNewProduct({...newProduct, price: Number.parseFloat(e.target.value)})}
                                        placeholder="0.00"
                                        className="h-12"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Stock Inicial</label>
                                    <Input
                                        type="number"
                                        value={newProduct.stock || ""}
                                        onChange={(e) => setNewProduct({...newProduct, stock: Number.parseInt(e.target.value)})}
                                        placeholder="0"
                                        className="h-12"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Categoría</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {categories.filter(c => c !== "Todos").map((category) => (
                                        <button
                                            type="button"
                                            key={category}
                                            onClick={() => setNewProduct({...newProduct, category})}
                                            className={cn(
                                                "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                                newProduct.category === category
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-secondary text-foreground hover:bg-secondary/80"
                                            )}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Código de Barras</label>
                                <Input
                                    value={newProduct.barcode || ""}
                                    onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                                    placeholder="Ej: 7501234567890"
                                    className="h-12"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Alerta Stock Mínimo</label>
                                <Input
                                    type="number"
                                    value={newProduct.lowStockThreshold || ""}
                                    onChange={(e) => setNewProduct({...newProduct, lowStockThreshold: Number.parseInt(e.target.value)})}
                                    placeholder="10"
                                    className="h-12"
                                    min="1"
                                />
                            </div>

                            <Button
                                className="w-full h-14 text-lg font-semibold mt-4"
                                onClick={handleAddProduct}
                                disabled={!newProduct.name || !newProduct.price}
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Agregar Producto
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {showEditProduct && (
                <div className="fixed inset-0 bg-foreground/50 flex items-end lg:items-center justify-center z-50">
                    <div className="bg-card w-full lg:w-120 lg:rounded-2xl rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-foreground">Editar Producto</h2>
                            <Button variant="ghost" size="icon" onClick={() => setShowEditProduct(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Nombre del Producto *</label>
                                <Input
                                    value={editingProduct.name}
                                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                    placeholder="Ej: Leche Entera 1L"
                                    className="h-12"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Precio *</label>
                                    <Input
                                        type="number"
                                        value={editingProduct.price || ""}
                                        onChange={(e) => setEditingProduct({...editingProduct, price: Number.parseFloat(e.target.value)})}
                                        placeholder="0.00"
                                        className="h-12"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Stock Inicial</label>
                                    <Input
                                        type="number"
                                        value={editingProduct.stock || ""}
                                        onChange={(e) => setEditingProduct({...editingProduct, stock: Number.parseInt(e.target.value)})}
                                        placeholder="0"
                                        className="h-12"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Categoría</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {categories.filter(c => c !== "Todos").map((category) => (
                                        <button
                                            type="button"
                                            key={category}
                                            onClick={() => setEditingProduct({...editingProduct, category})}
                                            className={cn(
                                                "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                                editingProduct.category === category
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-secondary text-foreground hover:bg-secondary/80"
                                            )}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Código de Barras</label>
                                <Input
                                    value={editingProduct.barcode || ""}
                                    onChange={(e) => setEditingProduct({...editingProduct, barcode: e.target.value})}
                                    placeholder="Ej: 7501234567890"
                                    className="h-12"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Alerta Stock Mínimo</label>
                                <Input
                                    type="number"
                                    value={editingProduct.lowStockThreshold || ""}
                                    onChange={(e) => setEditingProduct({...editingProduct, lowStockThreshold: Number.parseInt(e.target.value)})}
                                    placeholder="10"
                                    className="h-12"
                                    min="1"
                                />
                            </div>

                            <Button
                                className="w-full h-14 text-lg font-semibold mt-4"
                                onClick={handleEditProduct}
                                disabled={!editingProduct.name || !editingProduct.price}
                            >
                                <Edit2 className="w-5 h-5 mr-2" />
                                Guardar Producto
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
