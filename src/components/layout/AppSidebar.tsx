
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  Settings, 
  Plus, 
  ShoppingCart 
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Tableau de bord",
      url: "/",
      icon: BarChart3,
    },
    {
      title: "Produits",
      url: "/products",
      icon: Package,
    },
    {
      title: "Nouveau produit",
      url: "/products/new",
      icon: Plus,
    },
    {
      title: "Catégories",
      url: "/categories",
      icon: ShoppingCart,
    },
    {
      title: "Paramètres",
      url: "/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="py-4">
        <div className="flex items-center justify-center px-6 gap-2">
          <Package className="h-6 w-6" />
          <span className="font-semibold text-lg">Nimble Stock</span>
        </div>
        <SidebarTrigger className="absolute right-2 top-4 sm:right-4 text-sidebar-foreground hover:text-sidebar-primary-foreground" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestion</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={cn(
                    location.pathname === item.url && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
