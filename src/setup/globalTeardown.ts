import { FullConfig } from '@playwright/test';

async function globalTeardown(_config: FullConfig) {
  // Limpieza global que se ejecuta después de todos los tests
  console.log('🧹 Limpieza global iniciada');
  
  // Aquí puedes agregar tareas de limpieza como:
  // - Eliminar archivos temporales
  // - Cerrar conexiones de base de datos
  // - Limpiar directorios de trabajo
  
  console.log('✅ Limpieza global completada');
}

export default globalTeardown;
