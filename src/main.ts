import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { LoginManager } from './login';
import { CreateAppFlow } from './flows/createApp';
import { StoreListingFlow } from './flows/storeListing';
import { PoliciesAndAdsFlow } from './flows/policiesAndAds';
import { TargetAudienceFlow } from './flows/targetAudience';
import { ContentRatingFlow } from './flows/contentRating';
import { DataSafetyFlow } from './flows/dataSafety';
import { InternalTestingFlow } from './flows/internalTesting';
import { AppConfig, LoginCredentials, BotConfig, FlowResult } from './types';

class PlayStoreRPABot {
  private config!: AppConfig;
  private botConfig!: BotConfig;
  private credentials!: LoginCredentials;
  private loginManager!: LoginManager;

  constructor() {
    this.loadConfiguration();
    this.loginManager = new LoginManager(this.credentials, this.botConfig);
  }

  /**
   * Carga la configuración desde archivos
   */
  private loadConfiguration(): void {
    // Cargar variables de entorno
    dotenv.config();

    // Cargar configuración del bot
    const configPath = path.join(process.cwd(), 'config.json');
    if (!fs.existsSync(configPath)) {
      throw new Error('Archivo config.json no encontrado');
    }

    this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Cargar credenciales desde variables de entorno
    this.credentials = {
      email: process.env['GOOGLE_EMAIL'] || '',
      password: process.env['GOOGLE_PASSWORD'] || ''
    };

    if (!this.credentials.email || !this.credentials.password) {
      throw new Error('Credenciales de Google no configuradas en .env');
    }

    // Configuración del bot
    this.botConfig = {
      headless: process.env['HEADLESS'] === 'true',
      slowMo: parseInt(process.env['SLOW_MO'] || '1000'),
      timeout: parseInt(process.env['TIMEOUT'] || '30000'),
      playConsoleUrl: process.env['PLAY_CONSOLE_URL'] || 'https://play.google.com/console',
      playStoreUrl: process.env['PLAY_STORE_URL'] || 'https://play.google.com/store'
    };

    console.log('⚙️ Configuración cargada exitosamente');
  }

  /**
   * Ejecuta el flujo completo de creación de aplicación
   */
  async executeFullFlow(): Promise<void> {
    let page = null;

    try {
      console.log('🚀 Iniciando PlayStore RPA Bot...');
      console.log(`📱 Aplicación: ${this.config.app.name}`);
      console.log(`📦 Paquete: ${this.config.app.packageName}`);

      // Paso 1: Login
      console.log('\n🔐 Paso 1: Autenticación...');
      page = await this.loginManager.login();

      // Paso 2: Crear aplicación
      console.log('\n🚀 Paso 2: Creando aplicación...');
      const createAppFlow = new CreateAppFlow(page, this.config);
      const createResult = await createAppFlow.execute();
      
      if (!createResult.success) {
        throw new Error(`Error creando aplicación: ${createResult.message}`);
      }

      // Paso 3: Configurar Store Listing
      console.log('\n🏪 Paso 3: Configurando Store Listing...');
      const storeListingFlow = new StoreListingFlow(page, this.config);
      const storeResult = await storeListingFlow.execute();
      
      if (!storeResult.success) {
        throw new Error(`Error configurando Store Listing: ${storeResult.message}`);
      }

      // Paso 4: Configurar Políticas y Anuncios
      console.log('\n📋 Paso 4: Configurando políticas y anuncios...');
      const policiesFlow = new PoliciesAndAdsFlow(page, this.config);
      const policiesResult = await policiesFlow.execute();
      
      if (!policiesResult.success) {
        throw new Error(`Error configurando políticas: ${policiesResult.message}`);
      }

      // Paso 5: Configurar Audiencia Objetivo
      console.log('\n🎯 Paso 5: Configurando audiencia objetivo...');
      const audienceFlow = new TargetAudienceFlow(page, this.config);
      const audienceResult = await audienceFlow.execute();
      
      if (!audienceResult.success) {
        throw new Error(`Error configurando audiencia: ${audienceResult.message}`);
      }

      // Paso 6: Configurar Calificación de Contenido
      console.log('\n📊 Paso 6: Configurando calificación de contenido...');
      const ratingFlow = new ContentRatingFlow(page, this.config);
      const ratingResult = await ratingFlow.execute();
      
      if (!ratingResult.success) {
        throw new Error(`Error configurando calificación: ${ratingResult.message}`);
      }

      // Paso 7: Configurar Seguridad de Datos
      console.log('\n🔒 Paso 7: Configurando seguridad de datos...');
      const safetyFlow = new DataSafetyFlow(page, this.config);
      const safetyResult = await safetyFlow.execute();
      
      if (!safetyResult.success) {
        throw new Error(`Error configurando seguridad: ${safetyResult.message}`);
      }

      // Paso 8: Configurar Testing Interno
      console.log('\n🧪 Paso 8: Configurando testing interno...');
      const testingFlow = new InternalTestingFlow(page, this.config);
      const testingResult = await testingFlow.execute();
      
      if (!testingResult.success) {
        throw new Error(`Error configurando testing: ${testingResult.message}`);
      }

      console.log('\n🎉 ¡Flujo completado exitosamente!');
      console.log(`✅ Aplicación "${this.config.app.name}" configurada completamente`);
      
      // Generar reporte final
      await this.generateFinalReport();

    } catch (error) {
      console.error('\n❌ Error durante la ejecución del flujo:', error);
      
      // Tomar screenshot del error
      if (page) {
        try {
          const screenshotPath = await this.takeErrorScreenshot(page);
          console.log(`📸 Screenshot del error guardado en: ${screenshotPath}`);
        } catch (screenshotError) {
          console.warn('⚠️ No se pudo tomar screenshot del error:', screenshotError);
        }
      }
      
      throw error;
    } finally {
      // Cerrar el browser
      await this.loginManager.close();
    }
  }

  /**
   * Ejecuta solo un flujo específico
   */
  async executeSpecificFlow(flowName: string): Promise<FlowResult> {
    let page = null;

    try {
      console.log(`🎯 Ejecutando flujo específico: ${flowName}`);
      
      // Login
      page = await this.loginManager.login();

      let result: FlowResult;

      switch (flowName.toLowerCase()) {
        case 'createapp':
          const createFlow = new CreateAppFlow(page, this.config);
          result = await createFlow.execute();
          break;
          
        case 'storelisting':
          const storeFlow = new StoreListingFlow(page, this.config);
          result = await storeFlow.execute();
          break;
          
        case 'policies':
          const policiesFlow = new PoliciesAndAdsFlow(page, this.config);
          result = await policiesFlow.execute();
          break;
          
        case 'audience':
          const audienceFlow = new TargetAudienceFlow(page, this.config);
          result = await audienceFlow.execute();
          break;
          
        case 'rating':
          const ratingFlow = new ContentRatingFlow(page, this.config);
          result = await ratingFlow.execute();
          break;
          
        case 'safety':
          const safetyFlow = new DataSafetyFlow(page, this.config);
          result = await safetyFlow.execute();
          break;
          
        case 'testing':
          const testingFlow = new InternalTestingFlow(page, this.config);
          result = await testingFlow.execute();
          break;
          
        default:
          throw new Error(`Flujo desconocido: ${flowName}`);
      }

      return result;

    } catch (error) {
      return {
        success: false,
        message: `Error ejecutando flujo ${flowName}`,
        error: error instanceof Error ? error : new Error('Error desconocido')
      };
    } finally {
      await this.loginManager.close();
    }
  }

  /**
   * Toma un screenshot en caso de error
   */
  private async takeErrorScreenshot(page: any): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotDir = './screenshots';
    const fileName = `error_${timestamp}.png`;
    
    // Crear directorio si no existe
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    const filePath = path.join(screenshotDir, fileName);
    await page.screenshot({ path: filePath, fullPage: true });
    
    return filePath;
  }

  /**
   * Genera un reporte final de la ejecución
   */
  private async generateFinalReport(): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      appName: this.config.app.name,
      packageName: this.config.app.packageName,
      status: 'completed',
      flows: [
        'createApp',
        'storeListing',
        'policiesAndAds',
        'targetAudience',
        'contentRating',
        'dataSafety',
        'internalTesting'
      ],
      configuration: this.config
    };

    const reportDir = './reports';
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, `report_${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Reporte generado en: ${reportPath}`);
  }

  /**
   * Limpia la sesión guardada
   */
  async clearSession(): Promise<void> {
    await this.loginManager.clearSession();
    console.log('🗑️ Sesión limpiada');
  }
}

// Función principal
async function main() {
  try {
    const bot = new PlayStoreRPABot();
    
    // Verificar argumentos de línea de comandos
    const args = process.argv.slice(2);
    
    if (args.length > 0) {
      // Ejecutar flujo específico
      const flowName = args[0];
      if (flowName) {
        console.log(`🎯 Ejecutando flujo específico: ${flowName}`);
        
        const result = await bot.executeSpecificFlow(flowName);
        
        if (result.success) {
          console.log(`✅ ${result.message}`);
        } else {
          console.error(`❌ ${result.message}`);
          process.exit(1);
        }
      }
    } else {
      // Ejecutar flujo completo
      await bot.executeFullFlow();
    }
    
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

export { PlayStoreRPABot };
