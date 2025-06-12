const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const DEFAULT_PORT = 5050;

// Try to read existing backend .env
const backendEnvPath = path.join(__dirname, '../backend/.env');
let existingBackendPort = null;

if (fs.existsSync(backendEnvPath)) {
  const parsed = dotenv.parse(fs.readFileSync(backendEnvPath));
  existingBackendPort = Number(parsed.PORT);
}

// Use existing valid port or fallback
const PORT = existingBackendPort || DEFAULT_PORT;

// Write backend .env
const backendEnv = `DATABASE_URL="file:./data/nudget.db" \nPORT=${PORT}\n`;
fs.writeFileSync(backendEnvPath, backendEnv);
console.log(`Created backend/.env with PORT=${PORT}`);

// Write frontend .env
const frontendEnvPath = path.join(__dirname, '../frontend/.env');
const frontendEnv = `NEXT_PUBLIC_API_URL=http://127.0.0.1:${PORT}\n`;
fs.writeFileSync(frontendEnvPath, frontendEnv);
console.log(`Created frontend/.env.`);
