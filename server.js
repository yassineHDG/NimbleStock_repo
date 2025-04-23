
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3001;

const JSON_FILE_PATH = path.join(__dirname, 'products.json');

app.use(express.json());
app.use(cors());

// Vérifier si le fichier existe sinon le créer
if (!fs.existsSync(JSON_FILE_PATH)) {
  fs.writeFileSync(JSON_FILE_PATH, JSON.stringify([]), 'utf8');
  console.log(`Fichier créé: ${JSON_FILE_PATH}`);
}

// Helper pour lire tous les produits
const readProducts = () => {
  const data = fs.readFileSync(JSON_FILE_PATH, 'utf8');
  return JSON.parse(data || '[]');
};

// Helper pour écrire tous les produits
const writeProducts = (products) => {
  fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(products, null, 2), 'utf8');
};

// Home
app.get('/', (req, res) => {
  res.send('API d\'inventaire - Utilisez /api/products pour accéder aux données');
});

// Lire tous les produits
app.get('/api/products', (req, res) => {
  try {
    const products = readProducts();
    res.json(products);
  } catch (error) {
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
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Ajouter un produit
app.post('/api/products', (req, res) => {
  try {
    const products = readProducts();
    const { name, category, quantity, price } = req.body;
    if (!name || !category || quantity == null || price == null) {
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
    products.push(newProduct);
    writeProducts(products);
    res.json(newProduct);
  } catch {
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
  } catch {
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
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`API des produits disponible sur http://localhost:${PORT}/api/products`);
});
