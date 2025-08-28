// Ejemplo de uso del PlayStore RPA Bot
// Este archivo muestra cómo usar el bot programáticamente

const { PlayStoreRPABot } = require('./dist/main');

async function ejemploUso() {
  try {
    console.log('🚀 Ejemplo de uso del PlayStore RPA Bot');
    
    // Crear instancia del bot
    const bot = new PlayStoreRPABot();
    
    // Ejecutar flujo completo
    console.log('\n📋 Ejecutando flujo completo...');
    await bot.executeFullFlow();
    
    console.log('\n✅ Ejemplo completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en el ejemplo:', error);
  }
}

async function ejemploFlujoEspecifico() {
  try {
    console.log('🎯 Ejemplo de flujo específico');
    
    const bot = new PlayStoreRPABot();
    
    // Ejecutar solo el store listing
    console.log('\n🏪 Ejecutando solo Store Listing...');
    const result = await bot.executeSpecificFlow('storelisting');
    
    if (result.success) {
      console.log('✅ Store Listing configurado:', result.message);
    } else {
      console.log('❌ Error:', result.message);
    }
    
  } catch (error) {
    console.error('❌ Error en flujo específico:', error);
  }
}

async function ejemploLimpieza() {
  try {
    console.log('🧹 Ejemplo de limpieza de sesión');
    
    const bot = new PlayStoreRPABot();
    
    // Limpiar sesión guardada
    await bot.clearSession();
    console.log('✅ Sesión limpiada');
    
  } catch (error) {
    console.error('❌ Error limpiando sesión:', error);
  }
}

// Ejecutar ejemplos
async function ejecutarEjemplos() {
  console.log('🎬 Iniciando ejemplos...\n');
  
  // Ejemplo 1: Flujo completo
  await ejemploUso();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Ejemplo 2: Flujo específico
  await ejemploFlujoEspecifico();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Ejemplo 3: Limpieza
  await ejemploLimpieza();
  
  console.log('\n🎉 Todos los ejemplos completados!');
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  ejecutarEjemplos();
}

module.exports = {
  ejemploUso,
  ejemploFlujoEspecifico,
  ejemploLimpieza
};
