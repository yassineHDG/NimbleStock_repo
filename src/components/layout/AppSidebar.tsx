import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  Settings, 
  Plus, 
  ShoppingCart,
  LogOut,
  PanelLeft
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
  SidebarTrigger,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  
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

  const handleLogout = () => {
    logout();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès"
    });
    navigate("/login");
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <div className="flex items-center justify-center px-6 gap-2">
          <Package className="h-6 w-6" />
          {!isCollapsed && <span className="font-semibold text-lg">Nimble Stock</span>}
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
                  <SidebarMenuButton 
                    asChild 
                    className={cn(
                      location.pathname === item.url && "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
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
      <SidebarFooter className="p-4">
        {!isCollapsed && (
          <div className="text-sm mb-2">
            {user && <p>Connecté en tant que: <strong>{user.username}</strong></p>}
          </div>
        )}
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center bg-soft-purple text-white hover:bg-vivid-purple" 
          onClick={handleLogout}
          size={isCollapsed ? "icon" : "default"}
          title="Déconnexion"
        >
          <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
          {!isCollapsed && "Déconnexion"}
        </Button>
        {isCollapsed && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-2" 
            onClick={() => {
              const trigger = document.querySelector('[data-sidebar="trigger"]') as HTMLButtonElement;
              if (trigger) trigger.click();
            }}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
