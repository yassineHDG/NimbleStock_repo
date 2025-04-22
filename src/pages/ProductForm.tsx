
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "@/services/productService";
import { Product } from "@/types";
import { ProductForm as ProductFormComponent } from "@/components/products/ProductForm";

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const isEditMode = !!id;
  
  useEffect(() => {
    // Si en mode édition, charger le produit
    if (isEditMode) {
      const loadProduct = async () => {
        setLoading(true);
        try {
          const data = await getProductById(id);
          console.log("Produit chargé:", data); // Ajout d'un log pour déboguer
          setProduct(data);
        } catch (error) {
          console.error("Error loading product:", error);
        } finally {
          setLoading(false);
        }
      };
      
      loadProduct();
    }
  }, [id, isEditMode]);
  
  if (isEditMode && loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {isEditMode ? "Modifier le produit" : "Nouveau produit"}
      </h1>
      
      <ProductFormComponent 
        product={product || undefined} 
        isEdit={isEditMode} 
      />
    </div>
  );
}
