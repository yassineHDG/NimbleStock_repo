
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInvoiceById } from '@/services/invoiceService';
import { InvoiceDetail } from '@/components/invoices/InvoiceDetail';
import { Invoice } from '@/types/invoice';
import { AlertCircle } from 'lucide-react';

export default function InvoiceDetails() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) {
        setError("ID de facture manquant");
        setLoading(false);
        return;
      }

      try {
        const data = await getInvoiceById(id);
        if (!data) {
          setError("Facture non trouvée");
        } else {
          setInvoice(data);
        }
      } catch (err) {
        console.error("Erreur lors du chargement de la facture:", err);
        setError("Erreur lors du chargement de la facture");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-500">Chargement de la facture...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">{error || "Facture non trouvée"}</h2>
        <p className="text-gray-500 mt-2">
          La facture demandée n'a pas pu être chargée ou n'existe pas.
        </p>
      </div>
    );
  }

  return <InvoiceDetail invoice={invoice} />;
}
