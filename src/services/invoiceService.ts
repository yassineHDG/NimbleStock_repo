
import { Invoice, CreateInvoiceRequest } from '@/types/invoice';
import { toast } from '@/components/ui/use-toast';

const API_URL = 'http://localhost:3001/api/invoices';

// Récupérer toutes les factures
export const getAllInvoices = async (): Promise<Invoice[]> => {
  try {
    console.log('Fetching invoices from:', API_URL);
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      console.error('Error response:', response.status, response.statusText);
      throw new Error('Erreur lors de la récupération des factures');
    }
    
    const data = await response.json();
    console.log('Invoices retrieved:', data);
    return data;
  } catch (error) {
    console.error('Erreur lors du chargement des factures:', error);
    toast({
      title: "Erreur",
      description: "Impossible de récupérer les factures. Vérifiez que le serveur est en cours d'exécution.",
      variant: "destructive"
    });
    return [];
  }
};

// Récupérer une facture par son ID
export const getInvoiceById = async (id: string): Promise<Invoice | null> => {
  try {
    console.log(`Fetching invoice with ID: ${id}`);
    const response = await fetch(`${API_URL}/${id}`);
    
    if (!response.ok) {
      console.error('Error response:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    console.log('Invoice retrieved:', data);
    return data;
  } catch (error) {
    console.error('Erreur lors du chargement de la facture:', error);
    return null;
  }
};

// Créer une nouvelle facture
export const createInvoice = async (invoiceData: CreateInvoiceRequest): Promise<Invoice | null> => {
  try {
    console.log('Creating invoice:', invoiceData);
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invoiceData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', response.status, response.statusText, errorData);
      toast({
        title: "Erreur",
        description: errorData.error || "Erreur lors de la création de la facture",
        variant: "destructive"
      });
      return null;
    }
    
    const newInvoice = await response.json();
    console.log('Invoice created successfully:', newInvoice);
    
    toast({
      title: "Facture créée",
      description: `La facture ${newInvoice.id} a été créée avec succès.`,
    });
    
    return newInvoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de la création de la facture.",
      variant: "destructive"
    });
    
    return null;
  }
};
