
import productRoutes from './productRoutes.js';
import userRoutes from './userRoutes.js';
import invoiceRoutes from './invoiceRoutes.js';

export function configureRoutes(app) {
  // Home
  app.get('/', (req, res) => {
    res.send('API d\'inventaire - Utilisez /api/products pour accéder aux données');
  });

  // Test route
  app.get('/api/test', (req, res) => {
    res.json({ message: 'API fonctionne correctement' });
  });

  // Configure all route groups
  productRoutes(app);
  userRoutes(app);
  invoiceRoutes(app);
}
