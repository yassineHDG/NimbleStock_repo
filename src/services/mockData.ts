
import { Product, Category, DashboardStats } from '@/types';

// Sample categories
export const mockCategories: Category[] = [
  { id: "1", name: "Électronique" },
  { id: "2", name: "Alimentation" },
  { id: "3", name: "Vêtements" },
  { id: "4", name: "Bureautique" },
  { id: "5", name: "Mobilier" },
];

// Sample products with specific categories
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Ordinateur portable",
    category: "Électronique",
    quantity: 15,
    price: 799.99,
    created_at: "2025-04-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Café en grains",
    category: "Alimentation",
    quantity: 45,
    price: 12.99,
    created_at: "2025-04-05T14:30:00Z",
  },
  {
    id: "3",
    name: "Chemise blanche",
    category: "Vêtements",
    quantity: 3,
    price: 29.99,
    created_at: "2025-04-07T09:15:00Z",
  },
  {
    id: "4",
    name: "Stylos gel",
    category: "Bureautique",
    quantity: 150,
    price: 2.49,
    created_at: "2025-04-02T11:45:00Z",
  },
  {
    id: "5",
    name: "Écran 27 pouces",
    category: "Électronique",
    quantity: 8,
    price: 249.99,
    created_at: "2025-04-03T16:20:00Z",
  },
  {
    id: "6",
    name: "Clavier mécanique",
    category: "Électronique",
    quantity: 4,
    price: 89.99,
    created_at: "2025-04-04T13:10:00Z",
  },
  {
    id: "7",
    name: "Chaise de bureau",
    category: "Mobilier",
    quantity: 7,
    price: 129.99,
    created_at: "2025-04-06T15:40:00Z",
  },
  {
    id: "8",
    name: "Souris sans fil",
    category: "Électronique",
    quantity: 12,
    price: 24.99,
    created_at: "2025-04-08T10:30:00Z",
  },
  {
    id: "9",
    name: "Thé vert",
    category: "Alimentation",
    quantity: 30,
    price: 5.99,
    created_at: "2025-04-09T12:00:00Z",
  },
  {
    id: "10",
    name: "Bureau ajustable",
    category: "Mobilier",
    quantity: 2,
    price: 349.99,
    created_at: "2025-04-10T14:15:00Z",
  },
];

export const mockDashboardStats: DashboardStats = {
  totalProducts: mockProducts.length,
  totalStock: mockProducts.reduce((sum, product) => sum + product.quantity, 0),
  totalValue: mockProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0),
  lowStockItems: mockProducts.filter(product => product.quantity < 5).length,
  categoriesCount: mockCategories.length
};

// Stock threshold - below this value is considered "low stock"
export const LOW_STOCK_THRESHOLD = 5;
