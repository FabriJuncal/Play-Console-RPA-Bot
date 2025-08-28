import { Browser, BrowserContext, Page } from '@playwright/test';
import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { LoginCredentials, BotConfig } from './types';

export class LoginManager {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private credentials: LoginCredentials;
  private config: BotConfig;
  private sessionPath: string;

  constructor(credentials: LoginCredentials, config: BotConfig) {
    this.credentials = credentials;
    this.config = config;
    this.sessionPath = path.join(process.cwd(), 'session');
  }

  /**
   * Inicia el proceso de login
   */
  async login(): Promise<Page> {
    try {
      console.log('🔐 Iniciando proceso de login...');

      // Verificar si existe una sesión guardada
      if (await this.loadExistingSession()) {
        console.log('✅ Sesión existente cargada');
        return this.page!;
      }

      // Si no hay sesión, hacer login manual
      console.log('📝 No se encontró sesión, iniciando login manual...');
      await this.performManualLogin();

      // Guardar la sesión para futuros usos
      await this.saveSession();
      console.log('💾 Sesión guardada exitosamente');

      return this.page!;

    } catch (error) {
      console.error('❌ Error durante el login:', error);
      throw error;
    }
  }

  /**
   * Carga una sesión existente si está disponible
   */
  private async loadExistingSession(): Promise<boolean> {
    try {
      if (!fs.existsSync(this.sessionPath)) {
        return false;
      }

      // Iniciar browser con la sesión guardada usando Chrome
      this.context = await chromium.launchPersistentContext(this.sessionPath, {
        headless: this.config.headless,
        slowMo: this.config.slowMo,
        channel: 'chrome', // Usar Chrome instalado en el sistema
      });

      this.page = await this.context.newPage();

      // Verificar si la sesión sigue siendo válida
      await this.page.goto('https://play.google.com/console');
      await this.page.waitForLoadState('networkidle');

      // Verificar si estamos logueados
      if (await this.isLoggedIn()) {
        return true;
      }

      // Si no estamos logueados, cerrar y continuar con login manual
      await this.close();
      return false;

    } catch (error) {
      console.warn('⚠️ Error cargando sesión existente:', error);
      return false;
    }
  }

  /**
   * Realiza el login manual
   */
  private async performManualLogin(): Promise<void> {
    // Iniciar browser usando Chrome
    this.browser = await chromium.launch({
      headless: this.config.headless,
      slowMo: this.config.slowMo,
      channel: 'chrome', // Usar Chrome instalado en el sistema
    });

    this.context = await this.browser.newContext();

    this.page = await this.context.newPage();

    // Navegar a la página de login
    await this.page.goto('https://accounts.google.com/signin');
    await this.page.waitForLoadState('networkidle');

    // Llenar email
    const emailInput = this.page.locator('input[type="email"], input[name="identifier"]');
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill(this.credentials.email);
    
    // Hacer clic en siguiente
    const nextButton = this.page.locator('button:has-text("Next"), button[type="submit"]');
    await nextButton.click();
    await this.page.waitForTimeout(2000);

    // Llenar contraseña
    const passwordInput = this.page.locator('input[type="password"], input[name="password"]');
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.fill(this.credentials.password);
    
    // Hacer clic en siguiente
    const passwordNextButton = this.page.locator('button:has-text("Next"), button[type="submit"]');
    await passwordNextButton.click();

    // Esperar a que se complete el login
    await this.page.waitForTimeout(5000);

    // Verificar si el login fue exitoso
    if (!(await this.isLoggedIn())) {
      throw new Error('Login falló - verificar credenciales');
    }

    console.log('✅ Login exitoso');
  }

  /**
   * Verifica si el usuario está logueado
   */
  private async isLoggedIn(): Promise<boolean> {
    try {
      if (!this.page) return false;
      
      // Verificar si estamos en Play Console o si hay elementos de usuario
      const url = this.page.url();
      
      if (url.includes('play.google.com/console')) {
        // Buscar elementos que indiquen que estamos logueados
        const loggedInIndicators = [
          'text=Create app',
          'text=My apps',
          '[data-testid="user-menu"]',
          '.user-profile',
          'text=Dashboard'
        ];

        for (const selector of loggedInIndicators) {
          try {
            const element = this.page!.locator(selector);
            if (await element.isVisible()) {
              return true;
            }
          } catch {
            // Continuar con el siguiente selector
          }
        }
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Guarda la sesión actual
   */
  private async saveSession(): Promise<void> {
    try {
      if (this.context) {
        await this.context.storageState({ path: path.join(this.sessionPath, 'auth.json') });
      }
    } catch (error) {
      console.warn('⚠️ Error guardando sesión:', error);
    }
  }

  /**
   * Cierra el browser y contexto
   */
  async close(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      
      if (this.context) {
        await this.context.close();
        this.context = null;
      }
      
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
    } catch (error) {
      console.warn('⚠️ Error cerrando browser:', error);
    }
  }

  /**
   * Obtiene la página actual
   */
  getPage(): Page | null {
    return this.page;
  }

  /**
   * Verifica si hay una sesión válida
   */
  async hasValidSession(): Promise<boolean> {
    try {
      if (!this.page) return false;
      
      await this.page.goto('https://play.google.com/console');
      await this.page.waitForLoadState('networkidle');
      
      return await this.isLoggedIn();
    } catch {
      return false;
    }
  }

  /**
   * Limpia la sesión guardada
   */
  async clearSession(): Promise<void> {
    try {
      if (fs.existsSync(this.sessionPath)) {
        fs.rmSync(this.sessionPath, { recursive: true, force: true });
        console.log('🗑️ Sesión limpiada');
      }
    } catch (error) {
      console.warn('⚠️ Error limpiando sesión:', error);
    }
  }
}
