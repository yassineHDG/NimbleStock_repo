
import { existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// En ESM, __dirname n'est pas disponible, donc on le recrée 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// File paths
export const JSON_FILE_PATH = join(dirname(dirname(__dirname)), 'products.json');
export const USERS_FILE_PATH = join(dirname(dirname(__dirname)), 'users.json');
export const INVOICES_FILE_PATH = join(dirname(dirname(__dirname)), 'invoices.json');

export function setupFileSystem() {
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

  // Vérifier si invoices.json existe, sinon le créer
  if (!existsSync(INVOICES_FILE_PATH)) {
    writeFileSync(INVOICES_FILE_PATH, JSON.stringify([]), 'utf8');
    console.log(`Fichier créé: ${INVOICES_FILE_PATH}`);
  }
}
