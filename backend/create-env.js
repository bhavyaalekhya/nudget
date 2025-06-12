// create-env.js
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_PORT = 5050;

const backendEnvPath = path.join(__dirname, '../backend/.env');
let existingBackendPort = null;

if (existsSync(backendEnvPath)) {
  const parsed = dotenv.parse(readFileSync(backendEnvPath));
  existingBackendPort = Number(parsed.PORT);
}

const PORT = existingBackendPort || DEFAULT_PORT;

const backendEnv = `DATABASE_URL="file:./data/nudget.db"\nPORT=${PORT}\n`;
writeFileSync(backendEnvPath, backendEnv);
console.log(`Created backend/.env with PORT=${PORT}`);

const frontendEnvPath = path.join(__dirname, '../frontend/.env');
const frontendEnv = `NEXT_PUBLIC_API_URL=http://127.0.0.1:${PORT}\n`;
writeFileSync(frontendEnvPath, frontendEnv);
console.log(`Created frontend/.env.`);