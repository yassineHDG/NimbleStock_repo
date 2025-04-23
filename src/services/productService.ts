
import { Product } from '@/types';
import { toast } from '@/components/ui/use-toast';

const API_URL = 'http://localhost:3001/api/products';

// Récupérer tous les produits depuis l’API
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erreur lors de la récupération des produits');
    return await response.json();
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error);
    toast({
      title: "Erreur",
      description: "Impossible de récupérer les produits.",
      variant: "destructive"
    });
    return [];
  }
};

// Récupérer un produit par ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) return null;
    return await response.json();
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
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Erreur lors de la sauvegarde du produit');
    const newProduct = await response.json();
    toast({
      title: "Produit ajouté",
      description: `${newProduct.name} a été ajouté avec succès.`,
    });
    return newProduct;
  } catch (error) {
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de l'enregistrement du produit.",
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
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      toast({
        title: "Erreur",
        description: "Produit non trouvé.",
        variant: "destructive"
      });
      throw new Error("Product not found");
    }
    const updatedProduct = await response.json();
    toast({
      title: "Produit mis à jour",
      description: `${updatedProduct.name} a été mis à jour avec succès.`,
    });
    return updatedProduct;
  } catch (error) {
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
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      toast({
        title: "Erreur",
        description: "Produit non trouvé.",
        variant: "destructive"
      });
      throw new Error("Product not found");
    }
    toast({
      title: "Produit supprimé",
      description: "Le produit a été supprimé avec succès.",
    });
  } catch (error) {
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
    const products = await getAllProducts();
    return products.filter(p => p.quantity < 5);
  } catch {
    return [];
  }
};

// Recherche produits via query ou catégorie
export const searchProducts = async (query: string, category?: string): Promise<Product[]> => {
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

  return filtered;
};
