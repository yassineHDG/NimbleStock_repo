
import { Product } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface ProductValueChartProps {
  products: Product[];
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export function ProductValueChart({ products }: ProductValueChartProps) {
  // Calculate total value by category
  const categoryValues = products.reduce<Record<string, number>>((acc, product) => {
    const category = product.category;
    const productValue = product.price * product.quantity;
    
    if (!acc[category]) {
      acc[category] = 0;
    }
    
    acc[category] += productValue;
    return acc;
  }, {});
  
  // Generate chart colors based on categories
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];
  
  // Prepare data for the chart
  const data: ChartData[] = Object.entries(categoryValues).map(([category, value], index) => ({
    name: category,
    value: parseFloat(value.toFixed(2)), // Format to 2 decimal places
    color: COLORS[index % COLORS.length]
  }));
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-md rounded border text-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-primary">{`${payload[0].value.toLocaleString()} €`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Répartition de la valeur du stock</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
