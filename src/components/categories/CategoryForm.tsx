
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addCategory, updateCategory } from "@/services/categoryService";
import { Category } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface CategoryFormProps {
  category?: Category;
  isEdit?: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({ category, isEdit = false, onSuccess, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(category?.name || "");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie est obligatoire.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (isEdit && category) {
        await updateCategory(category.id, name);
      } else {
        await addCategory(name);
      }
      
      onSuccess();
    } catch (error) {
      // Error handling already done in the service with toast
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Modifier la catégorie" : "Ajouter une catégorie"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="categoryName">Nom de la catégorie</Label>
            <Input
              id="categoryName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom de la catégorie"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
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
