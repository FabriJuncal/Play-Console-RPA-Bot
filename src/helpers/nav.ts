import { Page, Locator } from '@playwright/test';
import { NavigationState } from '../types';

export class NavigationHelper {
  private page: Page;
  private currentState: NavigationState;

  constructor(page: Page) {
    this.page = page;
    this.currentState = {
      currentPage: 'unknown',
      currentStep: 'unknown',
      progress: 0
    };
  }

  /**
   * Navega a la página principal de Google Play Console
   */
  async navigateToPlayConsole(): Promise<void> {
    try {
      await this.page.goto('https://play.google.com/console');
      await this.page.waitForLoadState('networkidle');
      this.updateState('play-console', 'main', 10);
    } catch (error) {
      throw new Error(`Error navegando a Play Console: ${error}`);
    }
  }

  /**
   * Navega a la sección de crear nueva aplicación
   */
  async navigateToCreateApp(): Promise<void> {
    try {
      // Buscar y hacer clic en el botón de crear app
      const createButton = this.page.locator('text=Create app, game, or other digital content');
      if (await createButton.isVisible()) {
        await createButton.click();
      } else {
        // Alternativa: buscar por selector más específico
        const altCreateButton = this.page.locator('[data-testid="create-app-button"], button:has-text("Create")');
        await altCreateButton.first().click();
      }
      
      await this.page.waitForLoadState('networkidle');
      this.updateState('create-app', 'form', 20);
    } catch (error) {
      throw new Error(`Error navegando a crear app: ${error}`);
    }
  }

  /**
   * Navega a la sección de Store Listing
   */
  async navigateToStoreListing(): Promise<void> {
    try {
      const storeListingLink = this.page.locator('a[href*="store-listing"], text=Store listing');
      await storeListingLink.click();
      await this.page.waitForLoadState('networkidle');
      this.updateState('store-listing', 'form', 40);
    } catch (error) {
      throw new Error(`Error navegando a Store Listing: ${error}`);
    }
  }

  /**
   * Navega a la sección de Políticas y Anuncios
   */
  async navigateToPoliciesAndAds(): Promise<void> {
    try {
      const policiesLink = this.page.locator('a[href*="policies"], text=Policies, text=Policy');
      await policiesLink.click();
      await this.page.waitForLoadState('networkidle');
      this.updateState('policies', 'form', 60);
    } catch (error) {
      throw new Error(`Error navegando a Políticas: ${error}`);
    }
  }

  /**
   * Navega a la sección de Audiencia Objetivo
   */
  async navigateToTargetAudience(): Promise<void> {
    try {
      const audienceLink = this.page.locator('a[href*="target-audience"], text="Target audience", text=Audience');
      await audienceLink.click();
      await this.page.waitForLoadState('networkidle');
      this.updateState('target-audience', 'form', 70);
    } catch (error) {
      throw new Error(`Error navegando a Audiencia Objetivo: ${error}`);
    }
  }

  /**
   * Navega a la sección de Calificación de Contenido
   */
  async navigateToContentRating(): Promise<void> {
    try {
      const ratingLink = this.page.locator('a[href*="content-rating"], text="Content rating", text=Rating');
      await ratingLink.click();
      await this.page.waitForLoadState('networkidle');
      this.updateState('content-rating', 'form', 80);
    } catch (error) {
      throw new Error(`Error navegando a Calificación de Contenido: ${error}`);
    }
  }

  /**
   * Navega a la sección de Seguridad de Datos
   */
  async navigateToDataSafety(): Promise<void> {
    try {
      const safetyLink = this.page.locator('a[href*="data-safety"], text="Data safety", text=Safety');
      await safetyLink.click();
      await this.page.waitForLoadState('networkidle');
      this.updateState('data-safety', 'form', 85);
    } catch (error) {
      throw new Error(`Error navegando a Seguridad de Datos: ${error}`);
    }
  }

  /**
   * Navega a la sección de Testing Interno
   */
  async navigateToInternalTesting(): Promise<void> {
    try {
      const testingLink = this.page.locator('a[href*="internal-testing"], text="Internal testing", text=Testing');
      await testingLink.click();
      await this.page.waitForLoadState('networkidle');
      this.updateState('internal-testing', 'form', 90);
    } catch (error) {
      throw new Error(`Error navegando a Testing Interno: ${error}`);
    }
  }

  /**
   * Espera a que un elemento específico esté visible
   */
  async waitForElement(selector: string, timeout: number = 10000): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    return element;
  }

  /**
   * Verifica si estamos en la página correcta
   */
  async verifyCurrentPage(expectedPage: string): Promise<boolean> {
    const url = this.page.url();
    return url.includes(expectedPage);
  }

  /**
   * Obtiene el estado actual de navegación
   */
  getCurrentState(): NavigationState {
    return { ...this.currentState };
  }

  /**
   * Actualiza el estado de navegación
   */
  private updateState(page: string, step: string, progress: number): void {
    this.currentState = {
      currentPage: page,
      currentStep: step,
      progress
    };
  }

  /**
   * Retrocede a la página anterior
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Refresca la página actual
   */
  async refresh(): Promise<void> {
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }
}
