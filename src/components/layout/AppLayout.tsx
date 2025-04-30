
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Package } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

// Map des titres de pages basé sur les routes
const pageTitles: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/products": "Produits",
  "/products/new": "Nouveau produit",
  "/categories": "Catégories",
  "/facture": "Nouvelle Facture",
  "/facture/released": "Factures Réalisées",
  "/facture/details": "Détails de la facture",
  "/settings": "Paramètres"
};

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  
  useEffect(() => {
    // Extraire le chemin de base pour les routes avec paramètres dynamiques
    const path = location.pathname.split('/').slice(0, 3).join('/');
    
    // Titre par défaut
    let pageTitle = "Nimble Stock";
    
    // Vérifier si nous avons un titre spécifique pour cette route
    if (pageTitles[location.pathname]) {
      pageTitle = `${pageTitles[location.pathname]} | Nimble Stock`;
    } else if (location.pathname.startsWith('/facture/details/')) {
      pageTitle = "Détails de la facture | Nimble Stock";
    } else if (location.pathname.startsWith('/products/edit/')) {
      pageTitle = "Modifier le produit | Nimble Stock";
    }
    
    // Mettre à jour le titre de la page
    document.title = pageTitle;
  }, [location]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="flex items-center bg-white border-b p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">Nimble Stock</span>
            </div>
          </div>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
