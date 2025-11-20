import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/soroban-app',
  
  // Stellar & Soroban
  STELLAR_NETWORK: process.env.STELLAR_NETWORK || 'testnet',
  HORIZON_URL: process.env.HORIZON_URL || 'https://horizon-testnet.stellar.org',
  SOROBAN_RPC_URL: process.env.SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org',
  
  // Security
  JWT_SECRET: process.env.JWT_SECRET,
  DEPLOYER_SECRET: process.env.DEPLOYER_SECRET,
  
  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
};

// Validación de variables críticas
const required = ['JWT_SECRET'];
for (const key of required) {
  if (!config[key]) {
    throw new Error(`Falta la variable de entorno requerida: ${key}`);
  }
}
export default config;