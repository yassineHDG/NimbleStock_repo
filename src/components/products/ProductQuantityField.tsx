
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProductQuantityFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductQuantityField({ value, onChange }: ProductQuantityFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="quantity">Quantité</Label>
      <Input
        id="quantity"
        name="quantity"
        type="number"
        min="0"
        step="1"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="0"
        required
      />
    </div>
  );
}
