import { Page } from '@playwright/test';
import { NavigationHelper } from '../helpers/nav';
import { UIHelper } from '../helpers/ui';
import { AppConfig, FlowResult } from '../types';

export class ContentRatingFlow {
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
      console.log('📊 Configurando calificación de contenido...');
      
      await this.nav.navigateToContentRating();
      await this.configureRating();
      await this.saveChanges();
      
      return { success: true, message: 'Calificación de contenido configurada' };
    } catch (error) {
      return { 
        success: false, 
        message: 'Error configurando calificación', 
        error: error instanceof Error ? error : new Error('Error desconocido') 
      };
    }
  }

  private async configureRating(): Promise<void> {
    const ratingSelector = 'select[name="contentRating"], select[data-testid="content-rating"]';
    if (await this.ui.isElementVisible(ratingSelector)) {
      await this.ui.selectOption(ratingSelector, this.config.policies.contentRating);
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
