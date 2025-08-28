import { Page } from '@playwright/test';
import { NavigationHelper } from '../helpers/nav';
import { UIHelper } from '../helpers/ui';
import { FilesHelper } from '../helpers/files';
import { AppConfig, FlowResult } from '../types';

export class StoreListingFlow {
  private page: Page;
  private nav: NavigationHelper;
  private ui: UIHelper;
  private files: FilesHelper;
  private config: AppConfig;

  constructor(page: Page, config: AppConfig) {
    this.page = page;
    this.config = config;
    this.nav = new NavigationHelper(page);
    this.ui = new UIHelper(page);
    this.files = new FilesHelper(page);
  }

  /**
   * Ejecuta el flujo completo de configuración del store listing
   */
  async execute(): Promise<FlowResult> {
    try {
      console.log('🏪 Iniciando configuración del Store Listing...');

      // Paso 1: Navegar a Store Listing
      await this.nav.navigateToStoreListing();
      console.log('✅ Navegado a Store Listing');

      // Paso 2: Configurar información básica
      await this.configureBasicInfo();
      console.log('✅ Información básica configurada');

      // Paso 3: Subir imágenes de teléfono
      await this.uploadPhoneImages();
      console.log('✅ Imágenes de teléfono subidas');

      // Paso 4: Subir imágenes de tablet (opcional)
      await this.uploadTabletImages();
      console.log('✅ Imágenes de tablet subidas');

      // Paso 5: Subir icono y feature graphic
      await this.uploadAppAssets();
      console.log('✅ Assets de la app subidos');

      // Paso 6: Configurar descripciones
      await this.configureDescriptions();
      console.log('✅ Descripciones configuradas');

      // Paso 7: Configurar información de contacto
      await this.configureContactInfo();
      console.log('✅ Información de contacto configurada');

      // Paso 8: Guardar cambios
      await this.saveChanges();
      console.log('✅ Store Listing guardado exitosamente');

      return {
        success: true,
        message: 'Store Listing configurado exitosamente',
        data: {
          imagesUploaded: true,
          descriptionsConfigured: true,
          contactInfoConfigured: true
        }
      };

    } catch (error) {
      console.error('❌ Error configurando Store Listing:', error);
      return {
        success: false,
        message: 'Error configurando Store Listing',
        error: error instanceof Error ? error : new Error('Error desconocido')
      };
    }
  }

  /**
   * Configura la información básica del store listing
   */
  private async configureBasicInfo(): Promise<void> {
    // Nombre de la aplicación
    const appNameSelector = 'input[name="appName"], input[data-testid="app-name"], input[placeholder*="app name"]';
    if (await this.ui.isElementVisible(appNameSelector)) {
      await this.ui.fillInput(appNameSelector, this.config.app.name);
    }

    // Categoría
    const categorySelector = 'select[name="category"], select[data-testid="category"]';
    if (await this.ui.isElementVisible(categorySelector)) {
      await this.ui.selectOption(categorySelector, this.config.app.category);
    }

    // Tags
    if (this.config.app.tags && this.config.app.tags.length > 0) {
      const tagsSelector = 'input[name="tags"], input[data-testid="tags"], input[placeholder*="tags"]';
      if (await this.ui.isElementVisible(tagsSelector)) {
        await this.ui.fillInput(tagsSelector, this.config.app.tags.join(', '));
      }
    }
  }

  /**
   * Sube las imágenes de teléfono
   */
  private async uploadPhoneImages(): Promise<void> {
    const phoneImageSelector = 'input[type="file"][accept*="image"], input[data-testid="phone-screenshots"]';
    
    if (await this.ui.isElementVisible(phoneImageSelector)) {
      const results = await this.files.uploadDeviceImages('phone', phoneImageSelector);
      const successCount = results.filter(r => r.success).length;
      console.log(`📱 Subidas ${successCount}/${results.length} imágenes de teléfono`);
    } else {
      console.log('⚠️ No se encontró input para imágenes de teléfono');
    }
  }

  /**
   * Sube las imágenes de tablet (opcional)
   */
  private async uploadTabletImages(): Promise<void> {
    // Imágenes de 7 pulgadas
    if (this.config.assets.sevenInch.required > 0 || this.config.assets.sevenInch.optional) {
      const sevenInchSelector = 'input[type="file"][accept*="image"], input[data-testid="seven-inch-screenshots"]';
      if (await this.ui.isElementVisible(sevenInchSelector)) {
        const results = await this.files.uploadDeviceImages('seven-inch', sevenInchSelector);
        const successCount = results.filter(r => r.success).length;
        console.log(`📱 Subidas ${successCount}/${results.length} imágenes de tablet 7"`);
      }
    }

    // Imágenes de 10 pulgadas
    if (this.config.assets.tenInch.required > 0 || this.config.assets.tenInch.optional) {
      const tenInchSelector = 'input[type="file"][accept*="image"], input[data-testid="ten-inch-screenshots"]';
      if (await this.ui.isElementVisible(tenInchSelector)) {
        const results = await this.files.uploadDeviceImages('ten-inch', tenInchSelector);
        const successCount = results.filter(r => r.success).length;
        console.log(`📱 Subidas ${successCount}/${results.length} imágenes de tablet 10"`);
      }
    }
  }

  /**
   * Sube el icono y feature graphic de la aplicación
   */
  private async uploadAppAssets(): Promise<void> {
    // Icono de la aplicación
    if (this.config.assets.icon.required) {
      const iconSelector = 'input[type="file"][accept*="image"], input[data-testid="app-icon"]';
      if (await this.ui.isElementVisible(iconSelector)) {
        const result = await this.files.uploadAppIcon(iconSelector);
        if (result.success) {
          console.log('🎨 Icono de la app subido exitosamente');
        } else {
          console.log('⚠️ Error subiendo icono de la app:', result.error);
        }
      }
    }

    // Feature graphic
    if (this.config.assets.featureGraphic.required) {
      const featureSelector = 'input[type="file"][accept*="image"], input[data-testid="feature-graphic"]';
      if (await this.ui.isElementVisible(featureSelector)) {
        const result = await this.files.uploadFeatureGraphic(featureSelector);
        if (result.success) {
          console.log('🖼️ Feature graphic subido exitosamente');
        } else {
          console.log('⚠️ Error subiendo feature graphic:', result.error);
        }
      }
    }
  }

  /**
   * Configura las descripciones de la aplicación
   */
  private async configureDescriptions(): Promise<void> {
    // Descripción corta
    const shortDescSelector = 'textarea[name="shortDescription"], textarea[data-testid="short-description"], textarea[placeholder*="short description"]';
    if (await this.ui.isElementVisible(shortDescSelector)) {
      await this.ui.fillInput(shortDescSelector, this.config.storeListing.shortDescription);
    }

    // Descripción completa
    const fullDescSelector = 'textarea[name="fullDescription"], textarea[data-testid="full-description"], textarea[placeholder*="full description"]';
    if (await this.ui.isElementVisible(fullDescSelector)) {
      await this.ui.fillInput(fullDescSelector, this.config.storeListing.fullDescription);
    }

    // Palabras clave
    const keywordsSelector = 'input[name="keywords"], input[data-testid="keywords"], input[placeholder*="keywords"]';
    if (await this.ui.isElementVisible(keywordsSelector)) {
      await this.ui.fillInput(keywordsSelector, this.config.storeListing.keywords);
    }
  }

  /**
   * Configura la información de contacto
   */
  private async configureContactInfo(): Promise<void> {
    // Sitio web
    const websiteSelector = 'input[name="website"], input[data-testid="website"], input[placeholder*="website"]';
    if (await this.ui.isElementVisible(websiteSelector)) {
      await this.ui.fillInput(websiteSelector, this.config.storeListing.website);
    }

    // Email de contacto
    const emailSelector = 'input[name="contactEmail"], input[data-testid="contact-email"], input[placeholder*="contact email"]';
    if (await this.ui.isElementVisible(emailSelector)) {
      await this.ui.fillInput(emailSelector, this.config.storeListing.email);
    }

    // Política de privacidad
    const privacySelector = 'input[name="privacyPolicy"], input[data-testid="privacy-policy"], input[placeholder*="privacy policy"]';
    if (await this.ui.isElementVisible(privacySelector)) {
      await this.ui.fillInput(privacySelector, this.config.storeListing.privacyPolicyUrl);
    }

    // Términos de servicio
    const termsSelector = 'input[name="termsOfService"], input[data-testid="terms-of-service"], input[placeholder*="terms of service"]';
    if (await this.ui.isElementVisible(termsSelector)) {
      await this.ui.fillInput(termsSelector, this.config.storeListing.termsOfServiceUrl);
    }
  }

  /**
   * Guarda los cambios del store listing
   */
  private async saveChanges(): Promise<void> {
    // Buscar botón de guardar
    const saveButton = this.page.locator('button:has-text("Save"), button:has-text("Save changes"), button[type="submit"]');
    
    if (await saveButton.isVisible()) {
      await saveButton.click();
      await this.page.waitForTimeout(2000);
    }

    // Manejar modales de confirmación
    await this.ui.handleModal();
    
    // Esperar a que se complete el guardado
    await this.ui.waitForPageLoad();
  }

  /**
   * Verifica si el store listing se configuró correctamente
   */
  async verifyStoreListing(): Promise<boolean> {
    try {
      // Verificar si hay mensajes de éxito
      const successIndicators = [
        'text=Saved successfully',
        'text=Changes saved',
        'text=Store listing updated',
        '.success-message',
        '[data-testid="success"]'
      ];

      for (const selector of successIndicators) {
        if (await this.ui.isElementVisible(selector)) {
          return true;
        }
      }

      // Verificar si no hay errores de validación
      return !(await this.ui.hasValidationErrors());
    } catch {
      return false;
    }
  }

  /**
   * Obtiene el estado de completitud del store listing
   */
  async getCompletionStatus(): Promise<{ [key: string]: boolean }> {
    const status = {
      basicInfo: false,
      phoneImages: false,
      tabletImages: false,
      appAssets: false,
      descriptions: false,
      contactInfo: false
    };

    try {
      // Verificar información básica
      const appName = await this.ui.getInputValue('input[name="appName"], input[data-testid="app-name"]');
      status.basicInfo = appName === this.config.app.name;

      // Verificar imágenes de teléfono
      status.phoneImages = await this.files.validateRequiredAssets(this.config.assets.phone);

      // Verificar imágenes de tablet
      status.tabletImages = await this.files.validateRequiredAssets(this.config.assets.sevenInch) &&
                           await this.files.validateRequiredAssets(this.config.assets.tenInch);

      // Verificar assets de la app
      status.appAssets = await this.files.validateRequiredAssets(this.config.assets.icon) &&
                        await this.files.validateRequiredAssets(this.config.assets.featureGraphic);

      // Verificar descripciones
      const shortDesc = await this.ui.getInputValue('textarea[name="shortDescription"], textarea[data-testid="short-description"]');
      status.descriptions = shortDesc === this.config.storeListing.shortDescription;

      // Verificar información de contacto
      const website = await this.ui.getInputValue('input[name="website"], input[data-testid="website"]');
      status.contactInfo = website === this.config.storeListing.website;

    } catch (error) {
      console.warn('Error verificando estado de completitud:', error);
    }

    return status;
  }
}
