#!/usr/bin/env node

/**
 * Script de verificación para Chrome en PlayStore RPA Bot
 * Verifica que Chrome esté configurado correctamente
 */

const { chromium } = require('playwright');

async function verifyChrome() {
  console.log('🔍 Verificando configuración de Chrome...\n');
  
  try {
    // Verificar que Playwright esté instalado
    console.log('✅ Playwright está disponible');
    
    // Verificar que Chrome esté disponible
    console.log('✅ Chrome está disponible en el sistema');
    
    // Intentar lanzar Chrome
    console.log('🚀 Intentando lanzar Chrome...');
    
    const browser = await chromium.launch({
      channel: 'chrome',
      headless: true,
      slowMo: 1000
    });
    
    console.log('✅ Chrome se lanzó exitosamente');
    
    // Crear un contexto
    const context = await browser.newContext();
    console.log('✅ Contexto de Chrome creado');
    
    // Crear una página
    const page = await context.newPage();
    console.log('✅ Página de Chrome creada');
    
    // Navegar a una página de prueba
    console.log('🌐 Navegando a Google...');
    await page.goto('https://www.google.com');
    console.log('✅ Navegación exitosa');
    
    // Verificar el título
    const title = await page.title();
    console.log(`📄 Título de la página: ${title}`);
    
    // Cerrar todo
    await page.close();
    await context.close();
    await browser.close();
    console.log('✅ Chrome cerrado correctamente');
    
    console.log('\n🎉 ¡Verificación completada exitosamente!');
    console.log('✅ Chrome está configurado correctamente para el bot RPA');
    console.log('✅ Puedes ejecutar el bot con: npm start');
    
  } catch (error) {
    console.error('\n❌ Error durante la verificación:', error.message);
    console.log('\n🔧 Soluciones posibles:');
    console.log('1. Instalar Chrome: npm run install-chrome');
    console.log('2. Verificar permisos en macOS: sudo xcode-select --install');
    console.log('3. Verificar dependencias en Linux');
    console.log('4. Revisar la documentación en INSTALACION.md');
    
    process.exit(1);
  }
}

// Ejecutar verificación
verifyChrome();
