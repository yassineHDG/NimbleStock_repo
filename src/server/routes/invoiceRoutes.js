
import { readInvoices, writeInvoices, readProducts, writeProducts } from '../utils/fileHelpers.js';

export default function invoiceRoutes(app) {
  // Récupérer toutes les factures
  app.get('/api/invoices', (req, res) => {
    try {
      const invoices = readInvoices();
      res.json(invoices);
    } catch (error) {
      console.error('Erreur lors de la récupération des factures:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // Récupérer une facture par ID
  app.get('/api/invoices/:id', (req, res) => {
    try {
      const invoices = readInvoices();
      const invoice = invoices.find(i => i.id === req.params.id);
      if (!invoice) return res.status(404).json({ error: 'Facture non trouvée' });
      res.json(invoice);
    } catch (error) {
      console.error('Erreur lors de la récupération de la facture:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // Créer une nouvelle facture et mettre à jour les stocks
  app.post('/api/invoices', (req, res) => {
    try {
      console.log('Création de facture:', req.body);
      
      const { customerName, items } = req.body;
      
      if (!customerName || !items || !items.length) {
        return res.status(400).json({ error: 'Informations de facture incomplètes' });
      }
      
      // Vérifier la disponibilité du stock et calculer les totaux
      const products = readProducts();
      let totalHT = 0;
      const updatedProducts = [...products];
      const invoiceItems = [];
      
      // Vérifier les stocks et préparer les mises à jour
      for (const item of items) {
        const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
        
        if (productIndex === -1) {
          return res.status(400).json({ 
            error: `Produit non trouvé: ${item.productId}` 
          });
        }
        
        const product = updatedProducts[productIndex];
        
        if (product.quantity < item.quantity) {
          return res.status(400).json({ 
            error: `Stock insuffisant pour ${product.name}. Disponible: ${product.quantity}, Demandé: ${item.quantity}` 
          });
        }
        
        // Calculer le sous-total pour cet article
        const subTotal = product.price * item.quantity;
        totalHT += subTotal;
        
        // Préparer l'article de facture
        invoiceItems.push({
          productId: product.id,
          name: product.name,
          category: product.category,
          unitPrice: product.price,
          quantity: item.quantity,
          subTotal
        });
        
        // Mettre à jour le stock temporairement
        updatedProducts[productIndex] = {
          ...product,
          quantity: product.quantity - item.quantity
        };
      }
      
      // Calculer la TVA et le total TTC
      const tva = totalHT * 0.2;
      const totalTTC = totalHT + tva;
      
      // Générer un numéro de facture unique
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const invoiceNumber = `FAC-${year}${month}${day}${randomPart}`;
      
      const newInvoice = {
        id: invoiceNumber,
        customerName,
        date: date.toISOString(),
        items: invoiceItems,
        totalHT,
        tva,
        totalTTC,
        createdAt: date.toISOString()
      };
      
      // Enregistrer la facture
      const invoices = readInvoices();
      invoices.push(newInvoice);
      writeInvoices(invoices);
      
      // Mettre à jour les produits avec les nouveaux stocks
      writeProducts(updatedProducts);
      
      console.log('Facture créée avec succès:', invoiceNumber);
      res.status(201).json(newInvoice);
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });
}
