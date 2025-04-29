
import { useEffect, useState } from 'react';
import { InvoicesTable } from '@/components/invoices/InvoicesTable';
import { getAllInvoices } from '@/services/invoiceService';
import { FileText } from 'lucide-react';
import { Invoice } from '@/types/invoice';

export default function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getAllInvoices();
        setInvoices(data);
      } catch (error) {
        console.error("Erreur lors du chargement des factures:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Factures Réalisées</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Chargement des factures...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center border rounded-lg p-8">
          <FileText className="h-12 w-12 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-500">Aucune facture trouvée</h2>
          <p className="text-gray-400 mt-2">
            Vous n'avez pas encore créé de factures.
          </p>
        </div>
      ) : (
        <InvoicesTable invoices={invoices} />
      )}
    </div>
  );
}
