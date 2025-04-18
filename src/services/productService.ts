
import { Product } from '@/types';
import { mockProducts, LOW_STOCK_THRESHOLD } from './mockData';
import { toast } from '@/components/ui/use-toast';

// Le chemin vers notre fichier JSON
const JSON_FILE_PATH = '/api/products.json';

// Fonction pour récupérer les produits depuis l'API
const getProductsFromAPI = async (): Promise<Product[]> => {
  try {
    const response = await fetch(JSON_FILE_PATH);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des produits');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error);
    // Si le fichier n'existe pas encore ou autre erreur, utiliser les données de démonstration
    return mockProducts;
  }
};

// Fonction pour sauvegarder les produits via l'API
const saveProductsToAPI = async (products: Product[]): Promise<void> => {
  try {
    const response = await fetch(JSON_FILE_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(products),
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la sauvegarde des produits');
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des produits:', error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de l'enregistrement des données.",
      variant: "destructive"
    });
  }
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const products = await getProductsFromAPI();
      resolve(products);
    }, 300); // Simulate network delay
  });
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const products = await getProductsFromAPI();
      const product = products.find(p => p.id === id) || null;
      resolve(product);
    }, 300);
  });
};

// Add a new product
export const addProduct = async (product: Omit<Product, 'id' | 'created_at'>): Promise<Product> => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const products = await getProductsFromAPI();
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      
      products.push(newProduct);
      await saveProductsToAPI(products);
      
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
    setTimeout(async () => {
      const products = await getProductsFromAPI();
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
      await saveProductsToAPI(products);
      
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
    setTimeout(async () => {
      const products = await getProductsFromAPI();
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
      await saveProductsToAPI(products);
      
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
    setTimeout(async () => {
      const products = await getProductsFromAPI();
      const lowStockProducts = products.filter(p => p.quantity < LOW_STOCK_THRESHOLD);
      resolve(lowStockProducts);
    }, 300);
  });
};

// Search products
export const searchProducts = async (query: string, category?: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      let products = await getProductsFromAPI();
      
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
