
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ProductCategoryFieldProps {
  value: string;
  categories: { id: string; name: string }[];
  onChange: (value: string) => void;
}

export function ProductCategoryField({
  value,
  categories,
  onChange
}: ProductCategoryFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Catégorie</Label>
      <Select value={value} onValueChange={onChange}>
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
  );
}
