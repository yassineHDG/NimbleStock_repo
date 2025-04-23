
import { Product } from '@/types';
import { toast } from '@/components/ui/use-toast';

const API_URL = 'http://localhost:3001/api/products';

// Récupérer tous les produits depuis l'API
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    console.log('Fetching products from:', API_URL);
    const response = await fetch(API_URL);
    if (!response.ok) {
      console.error('Error response:', response.status, response.statusText);
      throw new Error('Erreur lors de la récupération des produits');
    }
    const data = await response.json();
    console.log('Products retrieved:', data);
    return data;
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error);
    toast({
      title: "Erreur",
      description: "Impossible de récupérer les produits. Vérifiez que le serveur est en cours d'exécution.",
      variant: "destructive"
    });
    return [];
  }
};

// Récupérer un produit par ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    console.log(`Fetching product with ID: ${id} from ${API_URL}/${id}`);
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      console.error('Error response:', response.status, response.statusText);
      return null;
    }
    const data = await response.json();
    console.log('Product retrieved:', data);
    return data;
  } catch (error) {
    console.error('Erreur lors du chargement du produit:', error);
    return null;
  }
};

// Ajouter un produit
export const addProduct = async (
  product: Omit<Product, 'id' | 'created_at'>
): Promise<Product> => {
  try {
    console.log('Adding product:', product, 'to', API_URL);
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    
    if (!response.ok) {
      console.error('Error response:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`Erreur lors de la sauvegarde du produit: ${response.status} ${response.statusText}`);
    }
    
    const newProduct = await response.json();
    console.log('Product added successfully:', newProduct);
    
    toast({
      title: "Produit ajouté",
      description: `${newProduct.name} a été ajouté avec succès.`,
    });
    
    return newProduct;
  } catch (error) {
    console.error('Error in addProduct:', error);
    
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de l'enregistrement du produit. Vérifiez que le serveur est en cours d'exécution.",
      variant: "destructive"
    });
    
    throw error;
  }
};

// Modifier un produit
export const updateProduct = async (
  id: string,
  updates: Partial<Omit<Product, 'id' | 'created_at'>>
): Promise<Product> => {
  try {
    console.log(`Updating product ${id} with:`, updates);
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      console.error('Error response:', response.status, response.statusText);
      toast({
        title: "Erreur",
        description: "Produit non trouvé.",
        variant: "destructive"
      });
      throw new Error("Product not found");
    }
    
    const updatedProduct = await response.json();
    console.log('Product updated successfully:', updatedProduct);
    
    toast({
      title: "Produit mis à jour",
      description: `${updatedProduct.name} a été mis à jour avec succès.`,
    });
    
    return updatedProduct;
  } catch (error) {
    console.error('Error in updateProduct:', error);
    
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de la mise à jour du produit.",
      variant: "destructive"
    });
    
    throw error;
  }
};

// Supprimer un produit
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    console.log(`Deleting product with ID: ${id}`);
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      console.error('Error response:', response.status, response.statusText);
      toast({
        title: "Erreur",
        description: "Produit non trouvé.",
        variant: "destructive"
      });
      throw new Error("Product not found");
    }
    
    console.log('Product deleted successfully');
    
    toast({
      title: "Produit supprimé",
      description: "Le produit a été supprimé avec succès.",
    });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de la suppression du produit.",
      variant: "destructive"
    });
    
    throw error;
  }
};

// Obtenir les produits avec stock faible
export const getLowStockProducts = async (): Promise<Product[]> => {
  try {
    console.log('Getting low stock products');
    const products = await getAllProducts();
    const lowStock = products.filter(p => p.quantity < 5);
    console.log('Low stock products:', lowStock);
    return lowStock;
  } catch (error) {
    console.error('Error getting low stock products:', error);
    return [];
  }
};

// Recherche produits via query ou catégorie
export const searchProducts = async (query: string, category?: string): Promise<Product[]> => {
  try {
    console.log(`Searching products with query: "${query}", category: "${category || 'all'}"`);
    const allProducts = await getAllProducts();
    let filtered = allProducts;

    // Recherche par nom ou catégorie
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery)
      );
    }
    // Filtrer par catégorie (si précisée)
    if (category && category !== "all") {
      filtered = filtered.filter(p => p.category === category);
    }

    console.log('Filtered products:', filtered);
    return filtered;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};
