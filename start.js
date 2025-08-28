#!/usr/bin/env node

/**
 * Script de inicio para el PlayStore RPA Bot
 * Este archivo evita problemas de compilación de TypeScript
 */

const { spawn } = require('child_process');
const path = require('path');

// Función para ejecutar el bot
async function runBot() {
  try {
    console.log('🚀 Iniciando PlayStore RPA Bot...');
    
    // Verificar si existe el archivo .env
    const fs = require('fs');
    const envPath = path.join(__dirname, '.env');
    
    if (!fs.existsSync(envPath)) {
      console.error('❌ Error: Archivo .env no encontrado');
      console.log('📝 Por favor, copia env.example a .env y configura tus credenciales');
      process.exit(1);
    }
    
    // Verificar si existe config.json
    const configPath = path.join(__dirname, 'config.json');
    if (!fs.existsSync(configPath)) {
      console.error('❌ Error: Archivo config.json no encontrado');
      process.exit(1);
    }
    
    // Obtener argumentos de línea de comandos
    const args = process.argv.slice(2);
    
    if (args.length > 0) {
      // Ejecutar flujo específico
      const flowName = args[0];
      console.log(`🎯 Ejecutando flujo: ${flowName}`);
      
      const result = spawn('npx', ['ts-node', 'src/main.ts', flowName], {
        stdio: 'inherit',
        cwd: __dirname
      });
      
      result.on('close', (code) => {
        process.exit(code);
      });
      
    } else {
      // Ejecutar flujo completo
      console.log('📋 Ejecutando flujo completo...');
      
      const result = spawn('npx', ['ts-node', 'src/main.ts'], {
        stdio: 'inherit',
        cwd: __dirname
      });
      
      result.on('close', (code) => {
        process.exit(code);
      });
    }
    
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar el bot
runBot();
