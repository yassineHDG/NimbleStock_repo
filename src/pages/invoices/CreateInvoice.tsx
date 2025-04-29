
import { InvoiceForm } from '@/components/invoices/InvoiceForm';

export default function CreateInvoice() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Nouvelle Facture</h1>
      <InvoiceForm />
    </div>
  );
}
