export const sampleProducts = [
    { id: '1', name: 'Leche Entera 1L', price: 1.50, stock: 24, category: 'Lácteos', barcode: '7501234567890', lowStockThreshold: 10 },
    { id: '2', name: 'Pan de Molde', price: 2.00, stock: 15, category: 'Panadería', barcode: '7501234567891', lowStockThreshold: 5 },
    { id: '3', name: 'Huevos (docena)', price: 3.50, stock: 8, category: 'Lácteos', barcode: '7501234567892', lowStockThreshold: 10 },
    { id: '4', name: 'Arroz 1kg', price: 2.25, stock: 30, category: 'Abarrotes', barcode: '7501234567893', lowStockThreshold: 15 },
    { id: '5', name: 'Aceite Vegetal 1L', price: 4.00, stock: 18, category: 'Abarrotes', barcode: '7501234567894', lowStockThreshold: 8 },
    { id: '6', name: 'Azúcar 1kg', price: 1.75, stock: 25, category: 'Abarrotes', barcode: '7501234567895', lowStockThreshold: 10 },
    { id: '7', name: 'Café Molido 250g', price: 5.50, stock: 12, category: 'Bebidas', barcode: '7501234567896', lowStockThreshold: 6 },
    { id: '8', name: 'Jabón de Baño', price: 1.25, stock: 40, category: 'Higiene', barcode: '7501234567897', lowStockThreshold: 15 },
    { id: '9', name: 'Papel Higiénico 4pack', price: 3.00, stock: 20, category: 'Higiene', barcode: '7501234567898', lowStockThreshold: 10 },
    { id: '10', name: 'Atún en Lata', price: 2.50, stock: 35, category: 'Abarrotes', barcode: '7501234567899', lowStockThreshold: 12 },
    { id: '11', name: 'Galletas María', price: 1.00, stock: 45, category: 'Snacks', barcode: '7501234567900', lowStockThreshold: 20 },
    { id: '12', name: 'Refresco Cola 2L', price: 2.75, stock: 28, category: 'Bebidas', barcode: '7501234567901', lowStockThreshold: 15 },
    { id: '13', name: 'Agua Mineral 1.5L', price: 1.00, stock: 50, category: 'Bebidas', barcode: '7501234567902', lowStockThreshold: 20 },
    { id: '14', name: 'Frijoles 500g', price: 1.80, stock: 22, category: 'Abarrotes', barcode: '7501234567903', lowStockThreshold: 10 },
    { id: '15', name: 'Pasta Spaghetti', price: 1.50, stock: 30, category: 'Abarrotes', barcode: '7501234567904', lowStockThreshold: 12 },
    { id: '16', name: 'Salsa de Tomate', price: 2.00, stock: 25, category: 'Abarrotes', barcode: '7501234567905', lowStockThreshold: 10 },
    { id: '17', name: 'Yogurt Natural', price: 1.25, stock: 4, category: 'Lácteos', barcode: '7501234567906', lowStockThreshold: 8 },
    { id: '18', name: 'Queso Fresco 250g', price: 3.75, stock: 6, category: 'Lácteos', barcode: '7501234567907', lowStockThreshold: 8 },
]

export const sampleTransactions = [
    {
        id: 'TRX001',
        items: [
            { ...sampleProducts[0], quantity: 2 },
            { ...sampleProducts[1], quantity: 1 },
        ],
        total: 5.00,
        paymentMethod: 'cash',
        date: new Date(Date.now() - 1000 * 60 * 30),
        cashReceived: 10.00,
        change: 5.00
    },
    {
        id: 'TRX002',
        items: [
            { ...sampleProducts[3], quantity: 2 },
            { ...sampleProducts[5], quantity: 1 },
            { ...sampleProducts[11], quantity: 2 },
        ],
        total: 11.75,
        paymentMethod: 'card',
        date: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
        id: 'TRX003',
        items: [
            { ...sampleProducts[6], quantity: 1 },
            { ...sampleProducts[8], quantity: 2 },
        ],
        total: 11.50,
        paymentMethod: 'cash',
        date: new Date(Date.now() - 1000 * 60 * 90),
        cashReceived: 15.00,
        change: 3.50
    },
    {
        id: 'TRX004',
        items: [
            { ...sampleProducts[9], quantity: 3 },
            { ...sampleProducts[10], quantity: 2 },
            { ...sampleProducts[12], quantity: 4 },
        ],
        total: 13.50,
        paymentMethod: 'transfer',
        date: new Date(Date.now() - 1000 * 60 * 120),
    },
    {
        id: 'TRX005',
        items: [
            { ...sampleProducts[2], quantity: 1 },
            { ...sampleProducts[16], quantity: 2 },
        ],
        total: 6.00,
        paymentMethod: 'cash',
        date: new Date(Date.now() - 1000 * 60 * 180),
        cashReceived: 10.00,
        change: 4.00
    },
]

export const categories = ['Todos', 'Lácteos', 'Panadería', 'Abarrotes', 'Bebidas', 'Higiene', 'Snacks']
