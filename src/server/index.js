
import express from 'express';
import cors from 'cors';
import { setupFileSystem } from './utils/fileSystem.js';
import { configureRoutes } from './routes/index.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Setup file system (create JSON files if they don't exist)
setupFileSystem();

// Configure all routes
configureRoutes(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`API des produits disponible sur http://localhost:${PORT}/api/products`);
  console.log(`API des utilisateurs disponible sur http://localhost:${PORT}/api/register`);
  console.log(`API de connexion disponible sur http://localhost:${PORT}/api/login`);
  console.log(`API des factures disponible sur http://localhost:${PORT}/api/invoices`);
});
