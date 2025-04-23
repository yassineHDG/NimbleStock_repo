
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProductNameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductNameField({ value, onChange }: ProductNameFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Nom du produit</Label>
      <Input
        id="name"
        name="name"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Nom du produit"
        required
      />
    </div>
  );
}
