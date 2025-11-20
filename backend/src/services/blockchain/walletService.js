import { Keypair } from '@stellar/stellar-sdk';
import { sorobanConfig } from '../../config/soroban.js';
import { logger } from '../../utils/logger.js';
import { WALLET_ERRORS } from '../../utils/constants.js';

export class WalletService {
  
  /**
   * Genera un nuevo par de claves (solo testnet)
   */
  static generateTestWallet() {
    try {
      const keypair = Keypair.random();
      
      return {
        publicKey: keypair.publicKey(),
        secret: keypair.secret(),
        // ⚠️ ADVERTENCIA: En producción NUNCA devolver el secret
        // Esto es solo para desarrollo/testnet
      };
    } catch (error) {
      logger.error('❌ Error generando wallet:', error);
      throw new Error(WALLET_ERRORS.INVALID_SECRET);
    }
  }
  
  /**
   * Valida una dirección Stellar
   */
  static isValidPublicKey(publicKey) {
    try {
      Keypair.fromPublicKey(publicKey);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Valida un secret key
   */
  static isValidSecret(secret) {
    try {
      Keypair.fromSecret(secret);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Obtiene balance de una cuenta usando Horizon
   */
  static async getBalance(publicKey) {
    try {
      if (!this.isValidPublicKey(publicKey)) {
        throw new Error(WALLET_ERRORS.INVALID_PUBLIC_KEY);
      }
      
      // Usar fetch para obtener datos de Horizon
      const response = await fetch(`${sorobanConfig.horizonUrl}/accounts/${publicKey}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return {
            account: publicKey,
            balances: [{ asset: 'XLM', balance: '0' }],
            sequence: '0',
            exists: false,
            message: 'Cuenta no activada en la blockchain'
          };
        }
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const accountData = await response.json();
      
      const balances = accountData.balances.map(balance => ({
        asset: balance.asset_type === 'native' ? 'XLM' : balance.asset_code,
        balance: balance.balance,
        buying_liabilities: balance.buying_liabilities || '0',
        selling_liabilities: balance.selling_liabilities || '0'
      }));
      
      return {
        account: publicKey,
        balances,
        sequence: accountData.sequence,
        exists: true
      };
      
    } catch (error) {
      logger.error(`❌ Error obteniendo balance para ${publicKey}:`, error);
      
      // Si es error de cuenta no encontrada, retornar balance vacío
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        return {
          account: publicKey,
          balances: [{ asset: 'XLM', balance: '0' }],
          sequence: '0',
          exists: false,
          message: 'Cuenta no activada en la blockchain'
        };
      }
      
      throw new Error(WALLET_ERRORS.BALANCE_FETCH_FAILED);
    }
  }
  
  /**
   * Crea una cuenta de prueba en testnet usando friendbot
   */
  static async createTestnetAccount(publicKey) {
    try {
      if (!this.isValidPublicKey(publicKey)) {
        throw new Error(WALLET_ERRORS.INVALID_PUBLIC_KEY);
      }
      
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
      );
      
      if (!response.ok) {
        throw new Error('Friendbot no disponible');
      }
      
      const result = await response.json();
      
      logger.info(`✅ Cuenta de testnet creada: ${publicKey}`);
      
      return {
        success: true,
        message: 'Cuenta fondada con éxito en testnet',
        transaction: result
      };
      
    } catch (error) {
      logger.error(`❌ Error creando cuenta testnet:`, error);
      throw new Error('No se pudo crear la cuenta de testnet');
    }
  }
}