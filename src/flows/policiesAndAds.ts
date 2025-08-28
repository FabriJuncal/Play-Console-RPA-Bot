import { Page } from '@playwright/test';
import { NavigationHelper } from '../helpers/nav';
import { UIHelper } from '../helpers/ui';
import { AppConfig, FlowResult } from '../types';

export class PoliciesAndAdsFlow {
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
      console.log('📋 Configurando políticas y anuncios...');
      
      await this.nav.navigateToPoliciesAndAds();
      await this.configurePolicies();
      await this.configureAds();
      await this.saveChanges();
      
      return { success: true, message: 'Políticas y anuncios configurados' };
    } catch (error) {
      return { 
        success: false, 
        message: 'Error configurando políticas', 
        error: error instanceof Error ? error : new Error('Error desconocido') 
      };
    }
  }

  private async configurePolicies(): Promise<void> {
    // Configurar políticas de contenido
    const contentPolicySelector = 'select[name="contentPolicy"], select[data-testid="content-policy"]';
    if (await this.ui.isElementVisible(contentPolicySelector)) {
      await this.ui.selectOption(contentPolicySelector, 'Family-friendly');
    }
  }

  private async configureAds(): Promise<void> {
    // Configurar si la app muestra anuncios
    const adsSelector = 'input[name="showsAds"], input[data-testid="shows-ads"]';
    if (await this.ui.isElementVisible(adsSelector)) {
      await this.ui.toggleCheckbox(adsSelector, this.config.policies.ads);
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
