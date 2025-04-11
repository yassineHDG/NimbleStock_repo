
import { useState, useEffect } from "react";
import { Search, Filter, X, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { getAllCategories } from "@/services/categoryService";

interface ProductsFilterProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
  onLowStockFilter: (enabled: boolean) => void;
  initialLowStock?: boolean;
}

export function ProductsFilter({ 
  onSearch, 
  onCategoryFilter, 
  onLowStockFilter,
  initialLowStock = false
}: ProductsFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lowStockOnly, setLowStockOnly] = useState(initialLowStock);
  const [filtersActive, setFiltersActive] = useState(false);
  
  useEffect(() => {
    // Load categories
    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    
    loadCategories();
    
    // Apply initial low stock filter if needed
    if (initialLowStock) {
      onLowStockFilter(true);
    }
  }, [initialLowStock, onLowStockFilter]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
    updateFiltersActive(query, selectedCategory, lowStockOnly);
  };
  
  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    onCategoryFilter(value);
    updateFiltersActive(searchQuery, value, lowStockOnly);
  };
  
  // Handle low stock filter toggle
  const handleLowStockToggle = () => {
    const newValue = !lowStockOnly;
    setLowStockOnly(newValue);
    onLowStockFilter(newValue);
    updateFiltersActive(searchQuery, selectedCategory, newValue);
  };
  
  // Update filters active state
  const updateFiltersActive = (search: string, category: string, lowStock: boolean) => {
    setFiltersActive(!!search || category !== "all" || lowStock);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setLowStockOnly(false);
    onSearch("");
    onCategoryFilter("all");
    onLowStockFilter(false);
    setFiltersActive(false);
  };
  
  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          variant={lowStockOnly ? "secondary" : "outline"}
          onClick={handleLowStockToggle}
          className="gap-2"
        >
          <AlertTriangle className="h-4 w-4" />
          Stock faible uniquement
        </Button>
      </div>
      
      {filtersActive && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtres actifs:</span>
            {searchQuery && (
              <Badge variant="secondary">{searchQuery}</Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary">{selectedCategory}</Badge>
            )}
            {lowStockOnly && (
              <Badge variant="secondary">Stock faible</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Effacer les filtres
          </Button>
        </div>
      )}
    </div>
  );
}
