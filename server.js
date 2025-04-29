
import express from 'express';
import { promises as fs } from 'fs';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const app = express();
const PORT = 3001;

// En ESM, __dirname n'est pas disponible, donc on le recrée 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const JSON_FILE_PATH = join(__dirname, 'products.json');
const USERS_FILE_PATH = join(__dirname, 'users.json');

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // Autoriser toutes les origines en développement
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Vérifier si le fichier existe sinon le créer
if (!existsSync(JSON_FILE_PATH)) {
  writeFileSync(JSON_FILE_PATH, JSON.stringify([]), 'utf8');
  console.log(`Fichier créé: ${JSON_FILE_PATH}`);
}

// Vérifier si users.json existe, sinon le créer
if (!existsSync(USERS_FILE_PATH)) {
  writeFileSync(USERS_FILE_PATH, JSON.stringify([]), 'utf8');
  console.log(`Fichier créé: ${USERS_FILE_PATH}`);
}

// Helper pour lire tous les produits
const readProducts = () => {
  const data = readFileSync(JSON_FILE_PATH, 'utf8');
  return JSON.parse(data || '[]');
};

// Helper pour écrire tous les produits
const writeProducts = (products) => {
  writeFileSync(JSON_FILE_PATH, JSON.stringify(products, null, 2), 'utf8');
};

// Helper pour lire les utilisateurs
const readUsers = () => {
  const data = readFileSync(USERS_FILE_PATH, 'utf8');
  return JSON.parse(data || '[]');
};

// Helper pour écrire les utilisateurs
const writeUsers = (users) => {
  writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf8');
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
    console.error('Erreur lors de la lecture des produits:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route de test pour /api/register (GET - uniquement pour les tests)
app.get('/api/register', (req, res) => {
  res.json({ 
    message: "Cette route est disponible uniquement avec la méthode POST pour l'inscription.", 
    note: "Utilisez un client HTTP comme Postman pour envoyer une requête POST avec username, password et confirmPassword dans le body"
  });
});

// Route de test pour /api/login (GET - uniquement pour les tests)
app.get('/api/login', (req, res) => {
  res.json({ 
    message: "Cette route est disponible uniquement avec la méthode POST pour la connexion.",
    note: "Utilisez un client HTTP comme Postman pour envoyer une requête POST avec username et password dans le body"
  });
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

// Enregistrement d'un utilisateur
app.post('/api/register', (req, res) => {
  try {
    console.log('Requête d\'inscription reçue:', req.body);
    const { username, password, confirmPassword } = req.body;
    if (!username || !password || !confirmPassword) {
      console.log('Champs manquants:', { username, password, confirmPassword });
      return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }
    if (password !== confirmPassword) {
      console.log('Les mots de passe ne correspondent pas');
      return res.status(400).json({ error: "Les mots de passe ne correspondent pas" });
    }
    const users = readUsers();
    const exists = users.some(u => u.username === username);
    if (exists) {
      console.log('Nom d\'utilisateur déjà pris:', username);
      return res.status(400).json({ error: "Nom d'utilisateur déjà pris" });
    }
    // Ajouter l'utilisateur (mot de passe en clair pour commencer)
    const newUser = { username, password };
    users.push(newUser);
    writeUsers(users);
    console.log('Utilisateur créé avec succès:', username);
    return res.status(201).json({ success: true, message: "Inscription réussie" });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route pour tester si l'API fonctionne
app.get('/api/test', (req, res) => {
  res.json({ message: 'API fonctionne correctement' });
});

// Route de connexion
app.post('/api/login', (req, res) => {
  try {
    console.log('Tentative de connexion:', req.body);
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }
    
    const users = readUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      return res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
    }
    
    // Dans une vraie application, vous généreriez un token JWT ici
    return res.json({ 
      success: true, 
      message: "Connexion réussie",
      user: { id: Date.now().toString(), username: user.username }
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`API des produits disponible sur http://localhost:${PORT}/api/products`);
  console.log(`API des utilisateurs disponible sur http://localhost:${PORT}/api/register`);
  console.log(`API de connexion disponible sur http://localhost:${PORT}/api/login`);
});
