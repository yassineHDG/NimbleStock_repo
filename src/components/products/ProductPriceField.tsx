
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProductPriceFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductPriceField({ value, onChange }: ProductPriceFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="price">Prix unitaire (€)</Label>
      <Input
        id="price"
        name="price"
        type="number"
        min="0.01"
        step="0.01"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="0.00"
        required
      />
    </div>
  );
}
