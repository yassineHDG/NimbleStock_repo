
import { Product } from '@/types';
import { mockProducts, LOW_STOCK_THRESHOLD } from './mockData';
import { toast } from '@/components/ui/use-toast';

// Local storage key
const STORAGE_KEY = 'inventory_products';

// Helper to get products from storage or initial mock data
const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initialize with mock data if nothing in storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
  return mockProducts;
};

// Save products to storage
const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredProducts());
    }, 300); // Simulate network delay
  });
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getStoredProducts();
      const product = products.find(p => p.id === id) || null;
      resolve(product);
    }, 300);
  });
};

// Add a new product
export const addProduct = async (product: Omit<Product, 'id' | 'created_at'>): Promise<Product> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getStoredProducts();
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      
      products.push(newProduct);
      saveProducts(products);
      
      toast({
        title: "Produit ajouté",
        description: `${newProduct.name} a été ajouté avec succès.`,
      });
      
      resolve(newProduct);
    }, 300);
  });
};

// Update a product
export const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const products = getStoredProducts();
      const index = products.findIndex(p => p.id === id);
      
      if (index === -1) {
        toast({
          title: "Erreur",
          description: "Produit non trouvé.",
          variant: "destructive"
        });
        reject(new Error("Product not found"));
        return;
      }
      
      const updatedProduct = {
        ...products[index],
        ...updates
      };
      
      products[index] = updatedProduct;
      saveProducts(products);
      
      toast({
        title: "Produit mis à jour",
        description: `${updatedProduct.name} a été mis à jour avec succès.`,
      });
      
      resolve(updatedProduct);
    }, 300);
  });
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const products = getStoredProducts();
      const index = products.findIndex(p => p.id === id);
      
      if (index === -1) {
        toast({
          title: "Erreur",
          description: "Produit non trouvé.",
          variant: "destructive"
        });
        reject(new Error("Product not found"));
        return;
      }
      
      const productName = products[index].name;
      products.splice(index, 1);
      saveProducts(products);
      
      toast({
        title: "Produit supprimé",
        description: `${productName} a été supprimé.`,
      });
      
      resolve();
    }, 300);
  });
};

// Get low stock products
export const getLowStockProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getStoredProducts();
      const lowStockProducts = products.filter(p => p.quantity < LOW_STOCK_THRESHOLD);
      resolve(lowStockProducts);
    }, 300);
  });
};

// Search products
export const searchProducts = async (query: string, category?: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let products = getStoredProducts();
      
      // Filter by search query
      if (query) {
        const lowerQuery = query.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(lowerQuery) || 
          p.category.toLowerCase().includes(lowerQuery)
        );
      }
      
      // Filter by category
      if (category && category !== 'all') {
        products = products.filter(p => p.category === category);
      }
      
      resolve(products);
    }, 300);
  });
};
