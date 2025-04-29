
import { Product } from './index';

export interface InvoiceItem {
  productId: string;
  name: string;
  category: string;
  unitPrice: number;
  quantity: number;
  subTotal: number;
}

export interface Invoice {
  id: string;
  customerName: string;
  date: string;
  items: InvoiceItem[];
  totalHT: number;
  tva: number;
  totalTTC: number;
  createdAt: string;
}

export interface CreateInvoiceItem {
  productId: string;
  quantity: number;
}

export interface CreateInvoiceRequest {
  customerName: string;
  items: CreateInvoiceItem[];
}
