
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, BarChart3, DollarSign, AlertTriangle, Plus } from "lucide-react";
import { getAllProducts } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import { Product } from "@/types";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { ProductValueChart } from "@/components/dashboard/ProductValueChart";
import { CategoryDistributionChart } from "@/components/dashboard/CategoryDistributionChart";
import { LowStockAlert } from "@/components/dashboard/LowStockAlert";
import { LOW_STOCK_THRESHOLD } from "@/services/mockData";

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
        
        // Get low stock products
        const lowStock = productsData.filter(p => p.quantity < LOW_STOCK_THRESHOLD);
        setLowStockProducts(lowStock);
        
        // Get categories count
        const categories = await getAllCategories();
        setCategoriesCount(categories.length);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Calculate dashboard stats
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.quantity, 0);
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  
  // Format total value for display
  const formatTotalValue = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <Button onClick={() => navigate('/products/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau produit
        </Button>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          {lowStockProducts.length > 0 && (
            <LowStockAlert 
              products={lowStockProducts} 
              threshold={LOW_STOCK_THRESHOLD} 
            />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total produits"
              value={totalProducts}
              icon={<Package />}
            />
            <StatCard
              title="Catégories"
              value={categoriesCount}
              icon={<BarChart3 />}
            />
            <StatCard
              title="Unités en stock"
              value={totalStock}
              icon={<Package />}
            />
            <StatCard
              title="Valeur totale"
              value={formatTotalValue(totalValue)}
              icon={<DollarSign />}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductValueChart products={products} />
            <CategoryDistributionChart products={products} />
          </div>
        </>
      )}
    </div>
  );
}
