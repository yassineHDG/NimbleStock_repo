
import { readProducts, writeProducts } from '../utils/fileHelpers.js';

export default function productRoutes(app) {
  // Lire tous les produits
  app.get('/api/products', (req, res) => {
    try {
      const products = readProducts();
      res.json(products);
    } catch (error) {
      console.error('Erreur lors de la lecture des produits:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // Récupérer un produit par ID
  app.get('/api/products/:id', (req, res) => {
    try {
      const products = readProducts();
      const product = products.find(p => p.id == req.params.id);
      if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
      res.json(product);
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // Ajouter un produit
  app.post('/api/products', (req, res) => {
    try {
      console.log('Requête reçue:', req.body);
      const products = readProducts();
      const { name, category, quantity, price } = req.body;
      if (!name || !category || quantity == null || price == null) {
        console.log('Champs manquants:', { name, category, quantity, price });
        return res.status(400).json({ error: 'Champs manquants' });
      }
      
      const newProduct = {
        id: Date.now().toString(),
        name,
        category,
        quantity: Number(quantity),
        price: Number(price),
        created_at: new Date().toISOString()
      };
      
      console.log('Nouveau produit à ajouter:', newProduct);
      products.push(newProduct);
      writeProducts(products);
      console.log('Produit ajouté avec succès');
      res.json(newProduct);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // Mettre à jour un produit
  app.put('/api/products/:id', (req, res) => {
    try {
      const products = readProducts();
      const productIndex = products.findIndex(p => p.id == req.params.id);
      if (productIndex === -1) return res.status(404).json({ error: 'Produit non trouvé' });
      const { name, category, quantity, price } = req.body;
      products[productIndex] = {
        ...products[productIndex],
        ...(name !== undefined ? { name } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(quantity !== undefined ? { quantity: Number(quantity) } : {}),
        ...(price !== undefined ? { price: Number(price) } : {})
      };
      writeProducts(products);
      res.json(products[productIndex]);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // Supprimer un produit
  app.delete('/api/products/:id', (req, res) => {
    try {
      const products = readProducts();
      const productIndex = products.findIndex(p => p.id == req.params.id);
      if (productIndex === -1) return res.status(404).json({ error: 'Produit non trouvé' });
      const deleted = products.splice(productIndex, 1);
      writeProducts(products);
      res.json({ success: true, deleted: deleted[0] });
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });
}
