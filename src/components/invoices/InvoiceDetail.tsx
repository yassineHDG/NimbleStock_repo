
import { Invoice } from '@/types/invoice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ArrowLeft, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InvoiceDetailProps {
  invoice: Invoice;
}

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="space-y-6 print:p-8">
      <div className="flex justify-between items-center print:hidden">
        <Button variant="outline" onClick={() => navigate('/facture/released')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux factures
        </Button>
        
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimer
        </Button>
      </div>
      
      <div className="border rounded-lg p-6 bg-white print:border-0">
        <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Facture</h1>
            <p className="text-gray-500">Numéro de facture: {invoice.id}</p>
            <p className="text-gray-500">Date: {formatDate(invoice.date)}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Client:</p>
            <p>{invoice.customerName}</p>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="text-right">Prix unitaire</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">{item.unitPrice.toFixed(2)} €</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.subTotal.toFixed(2)} €</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total HT:</span>
              <span>{invoice.totalHT.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">TVA (20%):</span>
              <span>{invoice.tva.toFixed(2)} €</span>
            </div>
            <div className="h-px bg-gray-200 my-2"></div>
            <div className="flex justify-between font-bold">
              <span>Total TTC:</span>
              <span>{invoice.totalTTC.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
