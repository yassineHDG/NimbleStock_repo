
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllProducts, searchProducts, getLowStockProducts } from "@/services/productService";
import { Product } from "@/types";
import { ProductsTable } from "@/components/products/ProductsTable";
import { ProductsFilter } from "@/components/products/ProductsFilter";

export default function ProductsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialLowStock = location.state?.lowStockFilter || false;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [lowStockOnly, setLowStockOnly] = useState(initialLowStock);
  
  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await getAllProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  // Apply filters whenever filter values change
  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true);
      try {
        let result: Product[];
        
        if (lowStockOnly) {
          // Get low stock products first
          result = await getLowStockProducts();
          
          // Then apply search and category filters
          if (searchQuery || categoryFilter !== "all") {
            result = await searchProducts(
              searchQuery, 
              categoryFilter !== "all" ? categoryFilter : undefined
            );
            
            // Ensure we only show low stock items from the search results
            result = result.filter(p => p.quantity < 5);
          }
        } else {
          // Normal search
          result = await searchProducts(
            searchQuery, 
            categoryFilter !== "all" ? categoryFilter : undefined
          );
        }
        
        setFilteredProducts(result);
      } catch (error) {
        console.error("Error applying filters:", error);
      } finally {
        setLoading(false);
      }
    };
    
    applyFilters();
  }, [searchQuery, categoryFilter, lowStockOnly]);
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
  };
  
  // Handle low stock filter
  const handleLowStockFilter = (enabled: boolean) => {
    setLowStockOnly(enabled);
  };
  
  // Handle product deleted
  const handleProductDeleted = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
      
      // Re-apply filters after product is deleted
      if (searchQuery || categoryFilter !== "all" || lowStockOnly) {
        let result: Product[];
        
        if (lowStockOnly) {
          result = await getLowStockProducts();
          
          if (searchQuery || categoryFilter !== "all") {
            result = await searchProducts(
              searchQuery, 
              categoryFilter !== "all" ? categoryFilter : undefined
            );
            result = result.filter(p => p.quantity < 5);
          }
        } else {
          result = await searchProducts(
            searchQuery, 
            categoryFilter !== "all" ? categoryFilter : undefined
          );
        }
        
        setFilteredProducts(result);
      } else {
        setFilteredProducts(data);
      }
    } catch (error) {
      console.error("Error reloading products:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
        <Button onClick={() => navigate('/products/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau produit
        </Button>
      </div>
      
      <ProductsFilter 
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
        onLowStockFilter={handleLowStockFilter}
        initialLowStock={initialLowStock}
      />
      
      {loading ? (
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      ) : (
        <ProductsTable 
          products={filteredProducts} 
          onProductDeleted={handleProductDeleted} 
        />
      )}
    </div>
  );
}
