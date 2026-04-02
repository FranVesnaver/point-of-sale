import { useState } from "react";
import { usePOS } from "../lib/context.jsx";
import { Card, CardContent } from "../components/ui/card.jsx";
import { StatsCard } from "../components/stats-card.jsx";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { Plus, Minus, Package, AlertTriangle, Edit2, Check, X } from "lucide-react";
import { cn } from "../lib/utils.js";
import { addProduct, updateProduct } from "../api/productsApi.js";
import { filterProducts, formatQuantity, getLowStock } from "../domain/product.js";
import { SearchBar } from "../components/search-bar.jsx";
import { FilterChips } from "../components/filter-chips.jsx";

export function InventoryView() {
    const { products, setProducts, updateProductStock, categories } = usePOS();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [editingProductStock, setEditingProductStock] = useState(null);
    const [editStock, setEditStock] = useState("");
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showEditProduct, setShowEditProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: 0,
        stock: 0,
        category: "OTHER",
        minStock: 10,
        allowFractionalSale: false
    });

    const filteredProducts = filterProducts(products, searchTerm, selectedCategory);
    const lowStockCount = getLowStock(products).length;
    const stockInputStep = editingProduct?.allowFractionalSale ? "0.001" : "1";
    const newProductStockStep = newProduct.allowFractionalSale ? "0.001" : "1";

    const parseQuantityValue = (value, allowFractionalSale) => {
        if (value === "") return ""
        const parsedValue = allowFractionalSale
            ? Number.parseFloat(value)
            : Number.parseInt(value, 10)

        return Number.isNaN(parsedValue) ? "" : parsedValue
    }

    const handleSaveStock = (productId) => {
        const product = products.find(item => item.id === productId)
        const newStockValue = product?.allowFractionalSale
            ? Number.parseFloat(editStock)
            : Number.parseInt(editStock, 10)

        if (!Number.isNaN(newStockValue) && newStockValue >= 0) {
            updateProductStock(productId, newStockValue);
        }
        setEditingProductStock(null);
        setEditStock("");
    }

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.price) return;

        setIsAddingProduct(true);

        try {
            const createdProduct = await addProduct(
                newProduct.name,
                newProduct.price,
                newProduct.stock,
                newProduct.minStock,
                newProduct.barcode,
                newProduct.category,
                newProduct.allowFractionalSale
            );

            setProducts(prev => [...prev, {
                ...createdProduct,
                category: createdProduct.category || newProduct.category || "OTHER",
            }]);

            setShowAddProduct(false);
            setNewProduct({
                name: "",
                price: 0,
                stock: 0,
                category: "OTHER",
                minStock: 10,
                allowFractionalSale: false
            });

        } catch (error) {
            throw new Error("Error adding product: " + error);
        } finally {
            setIsAddingProduct(false);
        }
    }

    const handleEditProduct = async () => {
        if (!editingProduct.name || !editingProduct.price) return;

        setIsUpdatingProduct(true);
        try {
            const updatedProduct = await updateProduct(
                editingProduct.id,
                editingProduct.name,
                editingProduct.price,
                editingProduct.stock,
                editingProduct.minStock,
                editingProduct.barcode,
                editingProduct.category,
                editingProduct.allowFractionalSale
            );

            setProducts(prev =>
                prev.map(p => (Number(p.id) === updatedProduct.id) ? {...p, ...updatedProduct} : p)
            );

            setShowEditProduct(false);
            setEditingProduct(null);

        } catch (error) {
            throw new Error("Error updating product: " + error);
        } finally {
            setIsUpdatingProduct(false);
        }
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
                <StatsCard
                    label="Total Productos"
                    value={products.length}
                    icon={Package}
                />
                <StatsCard
                    label="Stock Bajo"
                    value={lowStockCount}
                    icon={AlertTriangle}
                    variant={lowStockCount > 0 ? "warning" : "default"}
                />
            </div>

            {/* Search and Filter */}
            <div className="space-y-3">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar producto o código..."
                ></SearchBar>
                <FilterChips
                    items={(categories.keys()).map((category) => ({
                        id: category,
                        label: categories.get(category),
                    }))}
                    selectedId={selectedCategory}
                    onSelect={setSelectedCategory}
                    className="scrollbar-hide"
                />
            </div>

            {/* Products List */}
            <div className="space-y-3">
                {filteredProducts.map((product) => {
                    const isLowStock = product.stock <= product.minStock
                    const isEditingStock = editingProductStock === product.id

                    return (
                        <Card key={product.id} className={cn("border shadow-sm transition-all", isLowStock && "border-destructive/30")}>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                                            <Badge variant="secondary" className="text-xs shrink-0">
                                                {categories.get(product.category)}
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
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {product.allowFractionalSale ? "Venta fraccionada habilitada" : "Venta por unidad"}
                                        </p>
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
                                                        step={product.allowFractionalSale ? "0.001" : "1"}
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
                                                    <p className="font-bold text-lg">{formatQuantity(product.stock)}</p>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 bg-transparent"
                                                        onClick={() => updateProductStock(product.id, product.stock + (product.allowFractionalSale ? 0.5 : 1))}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 bg-transparent"
                                                        onClick={() => updateProductStock(product.id, Math.max(0, product.stock - (product.allowFractionalSale ? 0.5 : 1)))}
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
                                                Stock bajo (mín: {formatQuantity(product.minStock)})
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
                                        onChange={(e) => setNewProduct({...newProduct, stock: parseQuantityValue(e.target.value, newProduct.allowFractionalSale)})}
                                        placeholder="0"
                                        className="h-12"
                                        min="0"
                                        step={newProductStockStep}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Tipo de Venta</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setNewProduct({...newProduct, allowFractionalSale: false, stock: Math.trunc(Number(newProduct.stock) || 0), minStock: Math.trunc(Number(newProduct.minStock) || 0)})}
                                        className={cn(
                                            "px-3 py-3 rounded-lg text-sm font-medium transition-all",
                                            !newProduct.allowFractionalSale
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary text-foreground hover:bg-secondary/80"
                                        )}
                                    >
                                        Por unidad
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewProduct({...newProduct, allowFractionalSale: true})}
                                        className={cn(
                                            "px-3 py-3 rounded-lg text-sm font-medium transition-all",
                                            newProduct.allowFractionalSale
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary text-foreground hover:bg-secondary/80"
                                        )}
                                    >
                                        Fraccionado
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Categoría</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {categories.keys().filter(c => c !== "ALL").map((category) => (
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
                                            {categories.get(category)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Alerta Stock Mínimo</label>
                                <Input
                                    type="number"
                                    value={newProduct.minStock || ""}
                                    onChange={(e) => setNewProduct({...newProduct, minStock: parseQuantityValue(e.target.value, newProduct.allowFractionalSale)})}
                                    placeholder="10"
                                    className="h-12"
                                    min="0"
                                    step={newProductStockStep}
                                />
                            </div>

                            <Button
                                className="w-full h-14 text-lg font-semibold mt-4"
                                onClick={handleAddProduct}
                                disabled={!newProduct.name || !newProduct.price || isAddingProduct}
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                {isAddingProduct ? "Agregando..." : "Agregar Producto"}
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
                                        onChange={(e) => setEditingProduct({...editingProduct, stock: parseQuantityValue(e.target.value, editingProduct.allowFractionalSale)})}
                                        placeholder="0"
                                        className="h-12"
                                        min="0"
                                        step={stockInputStep}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Tipo de Venta</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingProduct({
                                            ...editingProduct,
                                            allowFractionalSale: false,
                                            stock: Math.trunc(Number(editingProduct.stock) || 0),
                                            minStock: Math.trunc(Number(editingProduct.minStock) || 0)
                                        })}
                                        className={cn(
                                            "px-3 py-3 rounded-lg text-sm font-medium transition-all",
                                            !editingProduct.allowFractionalSale
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary text-foreground hover:bg-secondary/80"
                                        )}
                                    >
                                        Por unidad
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingProduct({...editingProduct, allowFractionalSale: true})}
                                        className={cn(
                                            "px-3 py-3 rounded-lg text-sm font-medium transition-all",
                                            editingProduct.allowFractionalSale
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary text-foreground hover:bg-secondary/80"
                                        )}
                                    >
                                        Fraccionado
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Categoría</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {categories.keys().filter(c => c !== "ALL").map((category) => (
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
                                            {categories.get(category)}
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
                                    value={editingProduct.minStock || ""}
                                    onChange={(e) => setEditingProduct({...editingProduct, minStock: parseQuantityValue(e.target.value, editingProduct.allowFractionalSale)})}
                                    placeholder="10"
                                    className="h-12"
                                    min="0"
                                    step={stockInputStep}
                                />
                            </div>

                            <Button
                                className="w-full h-14 text-lg font-semibold mt-4"
                                onClick={handleEditProduct}
                                disabled={!editingProduct.name || !editingProduct.price || isUpdatingProduct}
                            >
                                <Edit2 className="w-5 h-5 mr-2" />
                                {isUpdatingProduct ? "Guardando..." : "Guardar Producto" }
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
