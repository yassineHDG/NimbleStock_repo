
export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface StockAlert {
  id: string;
  productId: string;
  message: string;
  type: 'warning' | 'error';
  threshold: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  totalValue: number;
  lowStockItems: number;
  categoriesCount: number;
}
