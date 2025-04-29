
import { readUsers, writeUsers } from '../utils/fileHelpers.js';

export default function userRoutes(app) {
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
}
