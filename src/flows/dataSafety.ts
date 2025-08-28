import { Page } from '@playwright/test';
import { NavigationHelper } from '../helpers/nav';
import { UIHelper } from '../helpers/ui';
import { AppConfig, FlowResult } from '../types';

export class DataSafetyFlow {
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

  async execute(): Promise<FlowResult> {
    try {
      console.log('🔒 Configurando seguridad de datos...');
      
      await this.nav.navigateToDataSafety();
      await this.configureDataCollection();
      await this.saveChanges();
      
      return { success: true, message: 'Seguridad de datos configurada' };
    } catch (error) {
      return { 
        success: false, 
        message: 'Error configurando seguridad de datos', 
        error: error instanceof Error ? error : new Error('Error desconocido') 
      };
    }
  }

  private async configureDataCollection(): Promise<void> {
    const { dataCollection } = this.config.policies;
    
    // Información personal
    if (await this.ui.isElementVisible('input[name="personalInfo"], input[data-testid="personal-info"]')) {
      await this.ui.toggleCheckbox('input[name="personalInfo"], input[data-testid="personal-info"]', dataCollection.personalInfo);
    }
    
    // Ubicación
    if (await this.ui.isElementVisible('input[name="location"], input[data-testid="location"]')) {
      await this.ui.toggleCheckbox('input[name="location"], input[data-testid="location"]', dataCollection.location);
    }
    
    // Información del dispositivo
    if (await this.ui.isElementVisible('input[name="deviceInfo"], input[data-testid="device-info"]')) {
      await this.ui.toggleCheckbox('input[name="deviceInfo"], input[data-testid="device-info"]', dataCollection.deviceInfo);
    }
    
    // Analytics
    if (await this.ui.isElementVisible('input[name="analytics"], input[data-testid="analytics"]')) {
      await this.ui.toggleCheckbox('input[name="analytics"], input[data-testid="analytics"]', dataCollection.analytics);
    }
  }

  private async saveChanges(): Promise<void> {
    const saveButton = this.page.locator('button:has-text("Save"), button[type="submit"]');
    if (await saveButton.isVisible()) {
      await saveButton.click();
      await this.page.waitForTimeout(2000);
    }
  }
}
