// services/transactionService.ts
import { StellarTransaction } from '@/types/stellar';

export class TransactionService {
  private static readonly HORIZON_TESTNET = 'https://horizon-testnet.stellar.org';

  /**
   * Obtiene transacciones reales usando fetch directo (sin SDK)
   */
  static async getTransactions(address: string, limit: number = 10): Promise<StellarTransaction[]> {
    try {
      console.log('🔍 Buscando transacciones REALES para:', address);

      if (!this.isValidStellarAddress(address)) {
        throw new Error('Dirección Stellar inválida');
      }

      // Usar solo testnet ya que parece que tu cuenta está en testnet
      const apiUrl = this.HORIZON_TESTNET;
      console.log('🌐 Usando Testnet API');

      const response = await fetch(
        `${apiUrl}/accounts/${address}/transactions?limit=${limit}&order=desc`
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.log('📭 Cuenta no encontrada en testnet');
          return [];
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`📊 ${data._embedded.records.length} transacciones encontradas`);

      // Mapear las transacciones
      const transactions = await Promise.all(
        data._embedded.records.map((tx: any) => 
          this.mapTransactionFromHorizon(tx, address, apiUrl)
        )
      );

      return transactions.filter((tx): tx is StellarTransaction => tx !== null);

    } catch (error) {
      console.error('❌ Error en getTransactions:', error);
      // En caso de error, devolver array vacío en lugar de throw
      return [];
    }
  }

  /**
   * Mapea una transacción desde Horizon API
   */
  private static async mapTransactionFromHorizon(
    tx: any, 
    userAddress: string, 
    apiUrl: string
  ): Promise<StellarTransaction | null> {
    try {
      // Obtener operaciones para determinar tipo y monto
      const operations = await this.fetchTransactionOperations(tx.hash, apiUrl);
      const operationInfo = this.analyzeOperations(operations, userAddress);

      // Manejar correctamente el campo successful (puede ser string o boolean)
      const successful = this.parseSuccessfulField(tx.successful);

      return {
        id: tx.id,
        hash: tx.hash,
        ledger: tx.ledger_attr || 0,
        createdAt: tx.created_at,
        timestamp: tx.created_at,
        sourceAccount: tx.source_account,
        type: operationInfo.type,
        amount: operationInfo.amount,
        asset: operationInfo.asset,
        fee: tx.fee_charged || '100',
        memo: tx.memo || '',
        successful: successful,
        status: successful ? 'success' : 'failed',
        from: operationInfo.from,
        to: operationInfo.to,
        signatures: tx.signatures || []
      };

    } catch (error) {
      console.error('Error mapeando transacción:', error);
      return null;
    }
  }

  /**
   * Parsea el campo successful que puede venir como string o boolean
   */
  private static parseSuccessfulField(successful: any): boolean {
    if (typeof successful === 'boolean') {
      return successful;
    }
    if (typeof successful === 'string') {
      return successful.toLowerCase() === 'true';
    }
    // Por defecto, considerar como exitosa
    return true;
  }

  /**
   * Obtiene las operaciones de una transacción
   */
  private static async fetchTransactionOperations(
    transactionHash: string, 
    apiUrl: string
  ): Promise<any[]> {
    try {
      const response = await fetch(
        `${apiUrl}/transactions/${transactionHash}/operations`
      );

      if (response.ok) {
        const data = await response.json();
        return data._embedded?.records || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching operations:', error);
      return [];
    }
  }

  /**
   * Analiza las operaciones para determinar tipo de transacción
   */
  private static analyzeOperations(operations: any[], userAddress: string): {
    type: 'send' | 'receive' | 'payment' | 'create_account' | 'other';
    amount: string;
    asset: string;
    from: string;
    to: string;
  } {
    if (operations.length === 0) {
      return {
        type: 'other',
        amount: '0',
        asset: 'XLM',
        from: '',
        to: ''
      };
    }

    const operation = operations[0];

    switch (operation.type) {
      case 'payment':
        const isSend = operation.from === userAddress;
        return {
          type: isSend ? 'send' : 'receive',
          amount: operation.amount || '0',
          asset: operation.asset_type === 'native' ? 'XLM' : (operation.asset_code || 'XLM'),
          from: operation.from || '',
          to: operation.to || ''
        };

      case 'create_account':
        return {
          type: 'create_account',
          amount: operation.starting_balance || '0',
          asset: 'XLM',
          from: operation.funder || '',
          to: operation.account || ''
        };

      case 'path_payment_strict_receive':
      case 'path_payment_strict_send':
        return {
          type: 'payment',
          amount: operation.amount || operation.source_amount || '0',
          asset: operation.asset_type === 'native' ? 'XLM' : (operation.asset_code || 'XLM'),
          from: operation.from || '',
          to: operation.to || operation.destination || ''
        };

      default:
        console.log('Operación no manejada:', operation.type);
        return {
          type: 'other',
          amount: '0',
          asset: 'XLM',
          from: '',
          to: ''
        };
    }
  }

  /**
   * Valida dirección Stellar
   */
  private static isValidStellarAddress(address: string): boolean {
  if (typeof address !== 'string') return false;
  if (!address) return false;
  return address.startsWith('G') && address.length === 56;
}

  /**
   * Verifica si una cuenta existe
   */
  static async checkAccountExists(address: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.HORIZON_TESTNET}/accounts/${address}`
      );
      return response.ok;
    } catch (error) {
      console.error('Error verificando cuenta:', error);
      return false;
    }
  }

  /**
   * Obtiene el balance de la cuenta
   */
  static async getAccountBalance(address: string): Promise<string> {
    try {
      const response = await fetch(
        `${this.HORIZON_TESTNET}/accounts/${address}`
      );

      if (response.ok) {
        const data = await response.json();
        const xlmBalance = data.balances.find((b: any) => b.asset_type === 'native');
        return xlmBalance ? xlmBalance.balance : '0';
      }
      return '0';
    } catch (error) {
      console.error('Error obteniendo balance:', error);
      return '0';
    }
  }
}