import { Page } from '@playwright/test';
import { NavigationHelper } from '../helpers/nav';
import { UIHelper } from '../helpers/ui';
import { AppConfig, FlowResult } from '../types';

export class TargetAudienceFlow {
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
      console.log('🎯 Configurando audiencia objetivo...');
      
      await this.nav.navigateToTargetAudience();
      await this.configureAudience();
      await this.saveChanges();
      
      return { success: true, message: 'Audiencia objetivo configurada' };
    } catch (error) {
      return { 
        success: false, 
        message: 'Error configurando audiencia', 
        error: error instanceof Error ? error : new Error('Error desconocido') 
      };
    }
  }

  private async configureAudience(): Promise<void> {
    const audienceSelector = 'select[name="targetAudience"], select[data-testid="target-audience"]';
    if (await this.ui.isElementVisible(audienceSelector)) {
      await this.ui.selectOption(audienceSelector, this.config.policies.targetAudience);
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
