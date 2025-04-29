
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/index';
import { CreateInvoiceItem } from '@/types/invoice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import { createInvoice } from '@/services/invoiceService';
import { getAllProducts } from '@/services/productService';
import { toast } from '@/components/ui/use-toast';

export function InvoiceForm() {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<Array<CreateInvoiceItem & { error?: string }>>([
    { productId: '', quantity: 1 }
  ]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Générer un numéro de facture pour prévisualisation
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `FAC-${year}${month}${day}${randomPart}`;
  };

  const [previewInvoiceNumber] = useState(generateInvoiceNumber());
  const currentDate = new Date().toLocaleDateString('fr-FR');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleProductChange = (index: number, productId: string) => {
    const newInvoiceItems = [...invoiceItems];
    newInvoiceItems[index].productId = productId;
    
    // Vérifier la disponibilité du stock
    const product = products.find(p => p.id === productId);
    if (product && newInvoiceItems[index].quantity > product.quantity) {
      newInvoiceItems[index].error = `Quantité demandée supérieure au stock disponible (max: ${product.quantity} unités).`;
    } else {
      delete newInvoiceItems[index].error;
    }
    
    setInvoiceItems(newInvoiceItems);
  };

  const handleQuantityChange = (index: number, value: string) => {
    const quantity = parseInt(value) || 1;
    const newInvoiceItems = [...invoiceItems];
    newInvoiceItems[index].quantity = quantity;
    
    // Vérifier la disponibilité du stock
    const productId = newInvoiceItems[index].productId;
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.quantity) {
      newInvoiceItems[index].error = `Quantité demandée supérieure au stock disponible (max: ${product.quantity} unités).`;
    } else {
      delete newInvoiceItems[index].error;
    }
    
    setInvoiceItems(newInvoiceItems);
  };

  const addInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, { productId: '', quantity: 1 }]);
  };

  const removeInvoiceItem = (index: number) => {
    if (invoiceItems.length > 1) {
      const newInvoiceItems = [...invoiceItems];
      newInvoiceItems.splice(index, 1);
      setInvoiceItems(newInvoiceItems);
    }
  };

  const calculateSubtotal = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.price * quantity : 0;
  };

  const calculateTotal = () => {
    let total = 0;
    invoiceItems.forEach(item => {
      if (item.productId) {
        total += calculateSubtotal(item.productId, item.quantity);
      }
    });
    return total;
  };

  const totalHT = calculateTotal();
  const tva = totalHT * 0.2;
  const totalTTC = totalHT + tva;

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const hasErrors = () => {
    return invoiceItems.some(item => item.error || !item.productId || item.quantity <= 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir le nom de l'entreprise cliente.",
        variant: "destructive"
      });
      return;
    }
    
    if (invoiceItems.some(item => !item.productId)) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un produit pour chaque ligne.",
        variant: "destructive"
      });
      return;
    }
    
    if (hasErrors()) {
      toast({
        title: "Erreur",
        description: "Veuillez corriger les erreurs avant de valider la facture.",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const result = await createInvoice({
        customerName,
        items: invoiceItems.map(({ productId, quantity }) => ({ productId, quantity }))
      });
      
      if (result) {
        navigate('/facture/released');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement des produits...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Nom de l'entreprise cliente</Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nom de l'entreprise"
            required
            className="w-full md:w-80"
          />
        </div>
        <div className="space-y-2 text-right">
          <p className="text-gray-500">Date: <span className="font-medium">{currentDate}</span></p>
          <p className="text-gray-500">Numéro de facture: <span className="font-medium">{previewInvoiceNumber}</span></p>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-500">
              <div className="col-span-4">Produit</div>
              <div className="col-span-2">Catégorie</div>
              <div className="col-span-2">Prix unitaire</div>
              <div className="col-span-2">Quantité</div>
              <div className="col-span-1">Total</div>
              <div className="col-span-1"></div>
            </div>
            
            {invoiceItems.map((item, index) => {
              const product = item.productId ? getProductById(item.productId) : null;
              const subtotal = calculateSubtotal(item.productId, item.quantity);
              
              return (
                <div key={index} className="space-y-2">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <Select
                        value={item.productId}
                        onValueChange={(value) => handleProductChange(index, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un produit" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} ({product.quantity} en stock)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 truncate">
                      {product?.category || '-'}
                    </div>
                    <div className="col-span-2">
                      {product ? `${product.price.toFixed(2)} €` : '-'}
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        disabled={!item.productId}
                      />
                    </div>
                    <div className="col-span-1 font-medium">
                      {subtotal > 0 ? `${subtotal.toFixed(2)} €` : '-'}
                    </div>
                    <div className="col-span-1">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeInvoiceItem(index)}
                        disabled={invoiceItems.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {item.error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erreur</AlertTitle>
                      <AlertDescription>{item.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              );
            })}
            
            <Button type="button" variant="outline" className="w-full" onClick={addInvoiceItem}>
              <Plus className="h-4 w-4 mr-2" /> Ajouter un produit
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col items-end space-y-2">
        <div className="grid grid-cols-2 gap-10 text-right w-64">
          <div className="text-gray-500">Total HT:</div>
          <div className="font-medium">{totalHT.toFixed(2)} €</div>
          
          <div className="text-gray-500">TVA (20%):</div>
          <div className="font-medium">{tva.toFixed(2)} €</div>
          
          <div className="text-gray-500 font-semibold">Total TTC:</div>
          <div className="font-bold text-lg">{totalTTC.toFixed(2)} €</div>
        </div>
        
        <Button type="submit" className="mt-4" disabled={submitting || hasErrors()}>
          {submitting ? 'Validation en cours...' : 'Valider la facture'}
        </Button>
      </div>
    </form>
  );
}
