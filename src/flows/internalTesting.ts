import { Page } from '@playwright/test';
import { NavigationHelper } from '../helpers/nav';
import { UIHelper } from '../helpers/ui';
import { AppConfig, FlowResult } from '../types';

export class InternalTestingFlow {
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
      console.log('🧪 Configurando testing interno...');
      
      await this.nav.navigateToInternalTesting();
      await this.configureTesting();
      await this.saveChanges();
      
      return { success: true, message: 'Testing interno configurado' };
    } catch (error) {
      return { 
        success: false, 
        message: 'Error configurando testing', 
        error: error instanceof Error ? error : new Error('Error desconocido') 
      };
    }
  }

  private async configureTesting(): Promise<void> {
    // Habilitar testing interno
    if (this.config.testing.internalTesting) {
      const enableSelector = 'input[name="enableInternalTesting"], input[data-testid="enable-internal-testing"]';
      if (await this.ui.isElementVisible(enableSelector)) {
        await this.ui.toggleCheckbox(enableSelector, true);
      }
    }
    
    // Configurar testing cerrado
    if (this.config.testing.closedTesting) {
      const closedSelector = 'input[name="enableClosedTesting"], input[data-testid="enable-closed-testing"]';
      if (await this.ui.isElementVisible(closedSelector)) {
        await this.ui.toggleCheckbox(closedSelector, true);
      }
    }
    
    // Configurar testing abierto
    if (this.config.testing.openTesting) {
      const openSelector = 'input[name="enableOpenTesting"], input[data-testid="enable-open-testing"]';
      if (await this.ui.isElementVisible(openSelector)) {
        await this.ui.toggleCheckbox(openSelector, true);
      }
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
