
import { Product } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";

interface CategoryDistributionChartProps {
  products: Product[];
}

export function CategoryDistributionChart({ products }: CategoryDistributionChartProps) {
  // Compter le nombre de produits et la quantité par catégorie
  const categoryData = products.reduce<Record<string, { count: number; quantity: number }>>((acc, product) => {
    const category = product.category;
    
    if (!acc[category]) {
      acc[category] = { count: 0, quantity: 0 };
    }
    
    // Incrémenter le compteur de produits uniques pour cette catégorie
    acc[category].count += 1;
    // Ajouter la quantité en stock de ce produit
    acc[category].quantity += product.quantity;
    
    return acc;
  }, {});
  
  console.log("Données par catégorie:", categoryData); // Ajout d'un log pour déboguer
  
  // Préparer les données pour le graphique
  const data = Object.entries(categoryData).map(([category, { count, quantity }]) => ({
    name: category,
    count,
    quantity
  }));
  
  // Trier les données par quantité en ordre décroissant
  data.sort((a, b) => b.quantity - a.quantity);
  
  console.log("Données pour le graphique:", data); // Ajout d'un log pour déboguer
  
  // Générer les couleurs des barres
  const barColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  // Personnaliser l'infobulle pour le graphique
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-md rounded border text-sm">
          <p className="font-medium">{label}</p>
          <p className="text-primary">{`${payload[0].value} produits différents`}</p>
          <p className="text-success">{`${payload[1].value} unités en stock`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Distribution par catégorie</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Types de produits">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
            <Bar dataKey="quantity" name="Unités en stock" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
