
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { addProduct, updateProduct } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import { toast } from "@/components/ui/use-toast";
import { ProductNameField } from "./ProductNameField";
import { ProductCategoryField } from "./ProductCategoryField";
import { ProductQuantityField } from "./ProductQuantityField";
import { ProductPriceField } from "./ProductPriceField";

interface ProductFormProps {
  product?: Product;
  isEdit?: boolean;
}

export function ProductFormContainer({ product, isEdit = false }: ProductFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "",
    quantity: product?.quantity?.toString() || "0",
    price: product?.price?.toString() || "0",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les catégories.",
          variant: "destructive"
        });
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (isEdit && product && Object.keys(product).length > 0) {
      setFormData({
        name: product.name,
        category: product.category,
        quantity: product.quantity.toString(),
        price: product.price.toString()
      });
    }
  }, [isEdit, product]);

  const handleValueChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du produit est obligatoire.",
        variant: "destructive"
      });
      return;
    }
    if (!formData.category) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une catégorie.",
        variant: "destructive"
      });
      return;
    }
    const quantity = parseInt(formData.quantity, 10);
    if (isNaN(quantity) || quantity < 0) {
      toast({
        title: "Erreur",
        description: "La quantité doit être un nombre positif.",
        variant: "destructive"
      });
      return;
    }
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Erreur",
        description: "Le prix doit être un nombre positif.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        quantity,
        price
      };

      if (isEdit && product) {
        await updateProduct(product.id, productData);
      } else {
        await addProduct(productData);
      }
      navigate('/products');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du produit.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? "Modifier le produit" : "Ajouter un produit"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <ProductNameField
            value={formData.name}
            onChange={(val) => handleValueChange("name", val)}
          />
          <ProductCategoryField
            value={formData.category}
            categories={categories}
            onChange={(val) => handleValueChange("category", val)}
          />
          <div className="grid grid-cols-2 gap-4">
            <ProductQuantityField
              value={formData.quantity}
              onChange={(val) => handleValueChange("quantity", val)}
            />
            <ProductPriceField
              value={formData.price}
              onChange={(val) => handleValueChange("price", val)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/products')}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Ajouter"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
