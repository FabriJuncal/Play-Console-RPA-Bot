import { FullConfig } from '@playwright/test';

async function globalSetup(_config: FullConfig) {
  // Configuración global que se ejecuta antes de todos los tests
  console.log('🚀 Configuración global iniciada');
  console.log('🌐 Usando Chrome como navegador principal');
  
  // Aquí puedes agregar configuraciones globales como:
  // - Limpiar directorios temporales
  // - Configurar variables de entorno
  // - Preparar datos de prueba
  
  console.log('✅ Configuración global completada');
}

export default globalSetup;
