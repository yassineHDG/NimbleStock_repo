
import { readFileSync, writeFileSync } from 'fs';
import { JSON_FILE_PATH, USERS_FILE_PATH, INVOICES_FILE_PATH } from './fileSystem.js';

// Helper pour lire tous les produits
export const readProducts = () => {
  const data = readFileSync(JSON_FILE_PATH, 'utf8');
  return JSON.parse(data || '[]');
};

// Helper pour écrire tous les produits
export const writeProducts = (products) => {
  writeFileSync(JSON_FILE_PATH, JSON.stringify(products, null, 2), 'utf8');
};

// Helper pour lire les utilisateurs
export const readUsers = () => {
  const data = readFileSync(USERS_FILE_PATH, 'utf8');
  return JSON.parse(data || '[]');
};

// Helper pour écrire les utilisateurs
export const writeUsers = (users) => {
  writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf8');
};

// Helper pour lire les factures
export const readInvoices = () => {
  const data = readFileSync(INVOICES_FILE_PATH, 'utf8');
  return JSON.parse(data || '[]');
};

// Helper pour écrire les factures
export const writeInvoices = (invoices) => {
  writeFileSync(INVOICES_FILE_PATH, JSON.stringify(invoices, null, 2), 'utf8');
};
