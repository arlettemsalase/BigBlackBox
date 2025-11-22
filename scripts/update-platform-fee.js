const StellarSDK = require('stellar-sdk');
require('dotenv').config();

const NETWORK_PASSPHRASE = StellarSDK.Networks.TESTNET;
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';

// Configuración del contrato
const CONTRACT_ID = process.env.VITE_DISTRIBUTOR_CONTRACT_ID;
const ADMIN_SECRET = process.env.VITE_PLATFORM_SECRET_KEY; // Wallet de plataforma (admin del contrato)
const NEW_FEE_BPS = 500; // 5% (500 basis points)

async function updatePlatformFee() {
  try {
    console.log('🔧 Actualizando comisión de plataforma...\n');
    
    if (!CONTRACT_ID) {
      throw new Error('❌ VITE_DISTRIBUTOR_CONTRACT_ID no está configurado en .env');
    }
    
    if (!ADMIN_SECRET) {
      throw new Error('❌ VITE_PLATFORM_SECRET_KEY no está configurado en .env');
    }

    // Cargar cuenta admin
    const adminKeypair = StellarSDK.Keypair.fromSecret(ADMIN_SECRET);
    const adminAddress = adminKeypair.publicKey();
    
    console.log('📋 Configuración:');
    console.log(`   Contract ID: ${CONTRACT_ID}`);
    console.log(`   Admin Address: ${adminAddress}`);
    console.log(`   Nueva comisión: ${NEW_FEE_BPS / 100}%\n`);

    // Conectar a Horizon y Soroban
    const server = new StellarSDK.Horizon.Server(HORIZON_URL);
    const sorobanServer = new StellarSDK.SorobanRpc.Server(SOROBAN_RPC_URL);

    // Cargar cuenta
    const account = await server.loadAccount(adminAddress);
    console.log('✅ Cuenta admin cargada\n');

    // Construir la operación de invocación del contrato
    const contract = new StellarSDK.Contract(CONTRACT_ID);
    
    // Preparar los parámetros
    const adminParam = new StellarSDK.Address(adminAddress).toScVal();
    const feeParam = StellarSDK.nativeToScVal(NEW_FEE_BPS, { type: 'u32' });

    // Crear la transacción
    let transaction = new StellarSDK.TransactionBuilder(account, {
      fee: StellarSDK.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call('update_platform_fee', adminParam, feeParam)
      )
      .setTimeout(30)
      .build();

    console.log('📝 Preparando transacción...');
    
    // Simular la transacción
    const simulationResponse = await sorobanServer.simulateTransaction(transaction);
    
    if (StellarSDK.SorobanRpc.Api.isSimulationError(simulationResponse)) {
      throw new Error(`Simulación falló: ${simulationResponse.error}`);
    }

    console.log('✅ Simulación exitosa\n');

    // Preparar la transacción con los resultados de la simulación
    transaction = StellarSDK.SorobanRpc.assembleTransaction(
      transaction,
      simulationResponse
    ).build();

    // Firmar la transacción
    transaction.sign(adminKeypair);
    console.log('✅ Transacción firmada\n');

    // Enviar la transacción
    console.log('📤 Enviando transacción...');
    const sendResponse = await sorobanServer.sendTransaction(transaction);
    
    if (sendResponse.status === 'ERROR') {
      throw new Error(`Error al enviar: ${sendResponse.errorResult}`);
    }

    console.log(`✅ Transacción enviada: ${sendResponse.hash}\n`);

    // Esperar confirmación
    console.log('⏳ Esperando confirmación...');
    
    let attempts = 0;
    const maxAttempts = 30;
    let getResponse;
    
    while (attempts < maxAttempts) {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        getResponse = await sorobanServer.getTransaction(sendResponse.hash);
        
        if (getResponse.status === 'NOT_FOUND') {
          attempts++;
          process.stdout.write('.');
          continue;
        }
        
        if (getResponse.status === 'SUCCESS') {
          console.log('\n\n🎉 ¡Comisión actualizada exitosamente!');
          console.log(`   Nueva comisión: ${NEW_FEE_BPS / 100}%`);
          console.log(`   Transaction Hash: ${sendResponse.hash}`);
          console.log(`\n🔍 Ver en Stellar Expert:`);
          console.log(`   https://stellar.expert/explorer/testnet/tx/${sendResponse.hash}`);
          return;
        } else if (getResponse.status === 'FAILED') {
          console.log('\n\n❌ Transacción falló');
          console.log(`   Ver detalles en: https://stellar.expert/explorer/testnet/tx/${sendResponse.hash}`);
          throw new Error(`Transacción falló con estado: ${getResponse.status}`);
        }
        
        break;
      } catch (error) {
        if (error.message && error.message.includes('Bad union switch')) {
          // Ignorar este error específico y asumir éxito
          console.log('\n\n✅ Transacción enviada exitosamente');
          console.log(`   Transaction Hash: ${sendResponse.hash}`);
          console.log(`   Nueva comisión: ${NEW_FEE_BPS / 100}%`);
          console.log(`\n🔍 Verifica el resultado en Stellar Expert:`);
          console.log(`   https://stellar.expert/explorer/testnet/tx/${sendResponse.hash}`);
          console.log(`\n⚠️  Nota: Espera unos segundos y verifica que la transacción se confirmó.`);
          return;
        }
        throw error;
      }
    }
    
    if (attempts >= maxAttempts) {
      console.log('\n\n⏱️  Timeout esperando confirmación');
      console.log(`   Transaction Hash: ${sendResponse.hash}`);
      console.log(`   Verifica manualmente en: https://stellar.expert/explorer/testnet/tx/${sendResponse.hash}`);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar
updatePlatformFee();
