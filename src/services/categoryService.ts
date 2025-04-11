
import { Category } from '@/types';
import { mockCategories } from './mockData';
import { toast } from '@/components/ui/use-toast';

// Local storage key
const STORAGE_KEY = 'inventory_categories';

// Helper to get categories from storage or initial mock data
const getStoredCategories = (): Category[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initialize with mock data if nothing in storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCategories));
  return mockCategories;
};

// Save categories to storage
const saveCategories = (categories: Category[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
};

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredCategories());
    }, 300); // Simulate network delay
  });
};

// Add a new category
export const addCategory = async (name: string): Promise<Category> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const categories = getStoredCategories();
      
      // Check if category already exists
      if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        toast({
          title: "Erreur",
          description: "Cette catégorie existe déjà.",
          variant: "destructive"
        });
        reject(new Error("Category already exists"));
        return;
      }
      
      const newCategory: Category = {
        id: Date.now().toString(),
        name
      };
      
      categories.push(newCategory);
      saveCategories(categories);
      
      toast({
        title: "Catégorie ajoutée",
        description: `${name} a été ajoutée avec succès.`,
      });
      
      resolve(newCategory);
    }, 300);
  });
};

// Update a category
export const updateCategory = async (id: string, name: string): Promise<Category> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const categories = getStoredCategories();
      const index = categories.findIndex(c => c.id === id);
      
      if (index === -1) {
        toast({
          title: "Erreur",
          description: "Catégorie non trouvée.",
          variant: "destructive"
        });
        reject(new Error("Category not found"));
        return;
      }
      
      // Check if the new name already exists in another category
      if (categories.some(c => c.id !== id && c.name.toLowerCase() === name.toLowerCase())) {
        toast({
          title: "Erreur",
          description: "Une catégorie avec ce nom existe déjà.",
          variant: "destructive"
        });
        reject(new Error("Category name already exists"));
        return;
      }
      
      const updatedCategory = {
        ...categories[index],
        name
      };
      
      categories[index] = updatedCategory;
      saveCategories(categories);
      
      toast({
        title: "Catégorie mise à jour",
        description: `La catégorie a été renommée en ${name}.`,
      });
      
      resolve(updatedCategory);
    }, 300);
  });
};

// Delete a category
export const deleteCategory = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const categories = getStoredCategories();
      const index = categories.findIndex(c => c.id === id);
      
      if (index === -1) {
        toast({
          title: "Erreur",
          description: "Catégorie non trouvée.",
          variant: "destructive"
        });
        reject(new Error("Category not found"));
        return;
      }
      
      const categoryName = categories[index].name;
      categories.splice(index, 1);
      saveCategories(categories);
      
      toast({
        title: "Catégorie supprimée",
        description: `${categoryName} a été supprimée.`,
      });
      
      resolve();
    }, 300);
  });
};
