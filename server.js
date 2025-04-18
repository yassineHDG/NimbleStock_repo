
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Définir le chemin vers le fichier JSON
const JSON_FILE_PATH = path.join(__dirname, 'products.json');

// Middleware pour parser le JSON et activer CORS
app.use(express.json());
app.use(cors());

// Vérifier si le fichier JSON existe, sinon le créer avec un tableau vide
if (!fs.existsSync(JSON_FILE_PATH)) {
  fs.writeFileSync(JSON_FILE_PATH, JSON.stringify([]), 'utf8');
  console.log(`Fichier créé: ${JSON_FILE_PATH}`);
}

// Route pour la racine (/)
app.get('/', (req, res) => {
  res.send('API d\'inventaire - Utilisez /api/products pour accéder aux données');
});

// Route GET pour récupérer tous les produits
app.get('/api/products', (req, res) => {
  try {
    const productsData = fs.readFileSync(JSON_FILE_PATH, 'utf8');
    const products = JSON.parse(productsData || '[]');
    res.json(products);
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des produits' });
  }
});

// Route POST pour sauvegarder les produits
app.post('/api/products', (req, res) => {
  try {
    const products = req.body;
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(products, null, 2), 'utf8');
    res.json({ success: true, message: 'Produits sauvegardés avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'écriture du fichier:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la sauvegarde des produits' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`API des produits disponible sur http://localhost:${PORT}/api/products`);
});
