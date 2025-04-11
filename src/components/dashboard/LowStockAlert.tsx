
import { Product } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LowStockAlertProps {
  products: Product[];
  threshold: number;
}

export function LowStockAlert({ products, threshold }: LowStockAlertProps) {
  const navigate = useNavigate();
  
  if (products.length === 0) {
    return null;
  }
  
  const handleViewProducts = () => {
    navigate('/products', { state: { lowStockFilter: true } });
  };
  
  return (
    <Alert className="bg-warning/20 border-warning">
      <AlertTriangle className="h-4 w-4 text-warning" />
      <AlertTitle className="text-warning-foreground">Stock faible détecté</AlertTitle>
      <AlertDescription className="text-warning-foreground/80">
        <p>{products.length} produit{products.length > 1 ? 's ont' : ' a'} un stock inférieur à {threshold} unités.</p>
        <div className="mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-warning text-warning-foreground hover:bg-warning/20"
            onClick={handleViewProducts}
          >
            Voir les produits concernés
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
