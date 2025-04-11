
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { LOW_STOCK_THRESHOLD } from "@/services/mockData";
import { toast } from "@/components/ui/use-toast";

export default function Settings() {
  const [lowStockThreshold, setLowStockThreshold] = useState(LOW_STOCK_THRESHOLD.toString());
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  
  const handleSaveSettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres ont été mis à jour avec succès.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground mt-2">
          Configurez les préférences de votre application de gestion de stock.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres généraux</CardTitle>
            <CardDescription>
              Configurer les paramètres de base de l'application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nom de l'entreprise</Label>
              <Input id="company-name" defaultValue="Ma Boutique" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Input id="currency" defaultValue="EUR" />
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="low-stock-threshold">Seuil de stock faible</Label>
                <Input 
                  id="low-stock-threshold" 
                  type="number"
                  min="1" 
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  className="w-20 text-right" 
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Les produits avec un stock inférieur à ce seuil seront marqués comme "stock faible".
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configurer les préférences de notification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Activer les notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications dans l'application.
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Notifications par email</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications par email pour les événements importants.
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                disabled={!notificationsEnabled}
              />
            </div>
            
            {emailNotifications && notificationsEnabled && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input id="email" type="email" placeholder="votre@email.com" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Enregistrer les paramètres</Button>
      </div>
    </div>
  );
}
