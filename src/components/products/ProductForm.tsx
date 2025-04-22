
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addProduct, updateProduct } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import { toast } from "@/components/ui/use-toast";

interface ProductFormProps {
  product?: Product;
  isEdit?: boolean;
}

export function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const isFirstLoad = useRef(true);

  // Initialiser le formulaire avec des valeurs par défaut ou celles du produit si en mode édition
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "",
    quantity: product?.quantity?.toString() || "0",
    price: product?.price?.toString() || "0"
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

  // Mise à jour des données du formulaire quand le produit change
  useEffect(() => {
    if (isEdit && product && Object.keys(product).length > 0) {
      console.log("Produit chargé pour édition:", product);
      setFormData({
        name: product.name,
        category: product.category,
        quantity: product.quantity.toString(),
        price: product.price.toString()
      });
    }
  }, [isEdit, product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  // Pour déboguer et voir la catégorie sélectionnée dans le formulaire
  useEffect(() => {
    if (isEdit) {
      console.log("Valeur actuelle de la catégorie:", formData.category);
    }
  }, [formData.category, isEdit]);

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

    const quantity = parseInt(formData.quantity);
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
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price)
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
          <div className="space-y-2">
            <Label htmlFor="name">Nom du produit</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nom du produit"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
              defaultValue={product?.category}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="1"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Prix unitaire (€)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
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
