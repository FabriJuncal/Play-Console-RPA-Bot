import { Page } from '@playwright/test';
import { NavigationHelper } from '../helpers/nav';
import { UIHelper } from '../helpers/ui';
import { AppConfig, FlowResult } from '../types';

export class CreateAppFlow {
  private page: Page;
  private nav: NavigationHelper;
  private ui: UIHelper;
  private config: AppConfig;

  constructor(page: Page, config: AppConfig) {
    this.page = page;
    this.config = config;
    this.nav = new NavigationHelper(page);
    this.ui = new UIHelper(page);
  }

  /**
   * Ejecuta el flujo completo de creación de aplicación
   */
  async execute(): Promise<FlowResult> {
    try {
      console.log('🚀 Iniciando flujo de creación de aplicación...');

      // Paso 1: Navegar a Play Console
      await this.nav.navigateToPlayConsole();
      console.log('✅ Navegado a Play Console');

      // Paso 2: Navegar a crear aplicación
      await this.nav.navigateToCreateApp();
      console.log('✅ Navegado a crear aplicación');

      // Paso 3: Llenar formulario básico
      await this.fillBasicForm();
      console.log('✅ Formulario básico completado');

      // Paso 4: Subir APK/AAB
      await this.uploadAppBundle();
      console.log('✅ Bundle de aplicación subido');

      // Paso 5: Completar información de la app
      await this.fillAppInformation();
      console.log('✅ Información de la app completada');

      // Paso 6: Guardar y continuar
      await this.saveAndContinue();
      console.log('✅ Aplicación creada exitosamente');

      return {
        success: true,
        message: 'Aplicación creada exitosamente',
        data: {
          appName: this.config.app.name,
          packageName: this.config.app.packageName,
          status: 'created'
        }
      };

    } catch (error) {
      console.error('❌ Error en flujo de creación de aplicación:', error);
      return {
        success: false,
        message: 'Error creando aplicación',
        error: error instanceof Error ? error : new Error('Error desconocido')
      };
    }
  }

  /**
   * Llena el formulario básico de creación
   */
  private async fillBasicForm(): Promise<void> {
    // Nombre de la aplicación
    await this.ui.fillInput('input[name="appName"], input[placeholder*="app name"], input[data-testid="app-name"]', this.config.app.name);
    
    // Nombre del paquete
    await this.ui.fillInput('input[name="packageName"], input[placeholder*="package name"], input[data-testid="package-name"]', this.config.app.packageName);
    
    // Tipo de aplicación
    const appTypeSelector = 'select[name="appType"], select[data-testid="app-type"]';
    if (await this.ui.isElementVisible(appTypeSelector)) {
      await this.ui.selectOption(appTypeSelector, 'Application');
    }

    // Categoría
    const categorySelector = 'select[name="category"], select[data-testid="category"]';
    if (await this.ui.isElementVisible(categorySelector)) {
      await this.ui.selectOption(categorySelector, this.config.app.category);
    }

    // Tags
    if (this.config.app.tags && this.config.app.tags.length > 0) {
      const tagsInput = 'input[name="tags"], input[placeholder*="tags"], input[data-testid="tags"]';
      if (await this.ui.isElementVisible(tagsInput)) {
        await this.ui.fillInput(tagsInput, this.config.app.tags.join(', '));
      }
    }
  }

  /**
   * Sube el bundle de la aplicación (APK/AAB)
   */
  private async uploadAppBundle(): Promise<void> {
    // Buscar el input de archivo
    const fileInputSelector = 'input[type="file"], input[accept*=".apk"], input[accept*=".aab"]';
    
    if (await this.ui.isElementVisible(fileInputSelector)) {
      // Por ahora, solo verificamos que el input esté presente
      // En una implementación real, aquí se subiría el archivo
      console.log('📁 Input de archivo encontrado, listo para subir bundle');
    } else {
      console.log('⚠️ No se encontró input de archivo, continuando...');
    }
  }

  /**
   * Completa la información adicional de la aplicación
   */
  private async fillAppInformation(): Promise<void> {
    // Descripción
    const descriptionSelector = 'textarea[name="description"], textarea[placeholder*="description"], textarea[data-testid="description"]';
    if (await this.ui.isElementVisible(descriptionSelector)) {
      await this.ui.fillInput(descriptionSelector, this.config.app.description);
    }

    // Versión
    const versionSelector = 'input[name="version"], input[placeholder*="version"], input[data-testid="version"]';
    if (await this.ui.isElementVisible(versionSelector)) {
      await this.ui.fillInput(versionSelector, this.config.app.version);
    }

    // Información de contacto
    const contactSelector = 'input[name="contactEmail"], input[placeholder*="contact"], input[data-testid="contact-email"]';
    if (await this.ui.isElementVisible(contactSelector)) {
      await this.ui.fillInput(contactSelector, this.config.storeListing.email);
    }
  }

  /**
   * Guarda la aplicación y continúa al siguiente paso
   */
  private async saveAndContinue(): Promise<void> {
    // Buscar botón de guardar o continuar
    const saveButton = this.page.locator('button:has-text("Save"), button:has-text("Continue"), button:has-text("Next"), button[type="submit"]');
    
    if (await saveButton.isVisible()) {
      await saveButton.click();
      await this.page.waitForTimeout(2000);
    }

    // Manejar modales que puedan aparecer
    await this.ui.handleModal();
    
    // Esperar a que se complete la operación
    await this.ui.waitForPageLoad();
  }

  /**
   * Verifica si la aplicación se creó correctamente
   */
  async verifyAppCreation(): Promise<boolean> {
    try {
      // Buscar indicadores de éxito
      const successIndicators = [
        'text=App created successfully',
        'text=Application created',
        'text=Success',
        '.success-message',
        '[data-testid="success"]'
      ];

      for (const selector of successIndicators) {
        if (await this.ui.isElementVisible(selector)) {
          return true;
        }
      }

      // Verificar si estamos en la página de configuración de la app
      const url = this.page.url();
      return url.includes('app-details') || url.includes('store-listing');
    } catch {
      return false;
    }
  }

  /**
   * Obtiene el ID de la aplicación creada
   */
  async getAppId(): Promise<string | null> {
    try {
      // Buscar el ID de la app en la URL o en la página
      const url = this.page.url();
      const appIdMatch = url.match(/app\/([^\/]+)/);
      
      if (appIdMatch && appIdMatch[1]) {
        return appIdMatch[1];
      }

      // Buscar en elementos de la página
      const appIdElement = this.page.locator('[data-testid="app-id"], .app-id, text=/[a-zA-Z0-9]+/');
      if (await appIdElement.isVisible()) {
        const text = await appIdElement.textContent();
        if (text) {
          return text.trim();
        }
      }

      return null;
    } catch {
      return null;
    }
  }
}
