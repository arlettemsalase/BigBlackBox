import { config } from './environment.js';
import { rpc, Networks } from '@stellar/stellar-sdk';

export const sorobanConfig = {
  network: config.STELLAR_NETWORK,
  networkPassphrase: config.STELLAR_NETWORK === 'testnet' 
    ? Networks.TESTNET 
    : Networks.PUBLIC,
  rpcUrl: config.SOROBAN_RPC_URL,
  horizonUrl: config.HORIZON_URL
};

// Cliente RPC para Soroban
export const sorobanClient = new rpc.Server(sorobanConfig.rpcUrl, {
  allowHttp: sorobanConfig.network === 'testnet'
});

export const getServer = () => sorobanClient;

// Función para verificar conexión con Soroban
export const checkSorobanConnection = async () => {
  try {
    await sorobanClient.getHealth();
    return { 
      connected: true, 
      network: sorobanConfig.network,
      rpcUrl: sorobanConfig.rpcUrl 
    };
  } catch (error) {
    return { 
      connected: false, 
      error: error.message,
      network: sorobanConfig.network,
      rpcUrl: sorobanConfig.rpcUrl 
    };
  }
};