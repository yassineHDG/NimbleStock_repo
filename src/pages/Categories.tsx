
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/services/categoryService";
import { Category } from "@/types";
import { CategoriesList } from "@/components/categories/CategoriesList";
import { CategoryForm } from "@/components/categories/CategoryForm";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  
  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);
  
  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle new category click
  const handleNewCategory = () => {
    setEditCategory(null);
    setShowForm(true);
  };
  
  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setEditCategory(category);
    setShowForm(true);
  };
  
  // Handle form success
  const handleFormSuccess = () => {
    setShowForm(false);
    loadCategories();
  };
  
  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
  };
  
  // Handle category deleted
  const handleCategoryDeleted = () => {
    loadCategories();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Catégories</h1>
        {!showForm && (
          <Button onClick={handleNewCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle catégorie
          </Button>
        )}
      </div>
      
      {showForm ? (
        <CategoryForm 
          category={editCategory || undefined}
          isEdit={!!editCategory}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      ) : (
        loading ? (
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
        ) : (
          <CategoriesList 
            categories={categories} 
            onEdit={handleEditCategory}
            onDeleted={handleCategoryDeleted}
          />
        )
      )}
    </div>
  );
}
