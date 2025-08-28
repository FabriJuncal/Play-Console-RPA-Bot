import { Page, Locator } from '@playwright/test';
import { UIElement, FormData } from '../types';

export class UIHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Llena un campo de texto
   */
  async fillInput(selector: string, value: string): Promise<void> {
    try {
      const input = this.page.locator(selector);
      await input.waitFor({ state: 'visible' });
      await input.fill(value);
      await this.page.waitForTimeout(500);
    } catch (error) {
      throw new Error(`Error llenando input ${selector}: ${error}`);
    }
  }

  /**
   * Selecciona una opción de un dropdown
   */
  async selectOption(selector: string, value: string): Promise<void> {
    try {
      const select = this.page.locator(selector);
      await select.waitFor({ state: 'visible' });
      await select.selectOption(value);
      await this.page.waitForTimeout(500);
    } catch (error) {
      throw new Error(`Error seleccionando opción ${selector}: ${error}`);
    }
  }

  /**
   * Marca o desmarca un checkbox
   */
  async toggleCheckbox(selector: string, checked: boolean): Promise<void> {
    try {
      const checkbox = this.page.locator(selector);
      await checkbox.waitFor({ state: 'visible' });
      
      const isChecked = await checkbox.isChecked();
      if (isChecked !== checked) {
        await checkbox.click();
      }
      
      await this.page.waitForTimeout(500);
    } catch (error) {
      throw new Error(`Error cambiando checkbox ${selector}: ${error}`);
    }
  }

  /**
   * Selecciona una opción de radio button
   */
  async selectRadio(selector: string): Promise<void> {
    try {
      const radio = this.page.locator(selector);
      await radio.waitFor({ state: 'visible' });
      await radio.check();
      await this.page.waitForTimeout(500);
    } catch (error) {
      throw new Error(`Error seleccionando radio ${selector}: ${error}`);
    }
  }

  /**
   * Hace clic en un botón o enlace
   */
  async clickElement(selector: string): Promise<void> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible' });
      await element.click();
      await this.page.waitForTimeout(1000);
    } catch (error) {
      throw new Error(`Error haciendo clic en ${selector}: ${error}`);
    }
  }

  /**
   * Llena un formulario completo basado en la configuración
   */
  async fillForm(formElements: UIElement[], formData: FormData): Promise<void> {
    for (const element of formElements) {
      if (!element.required && !formData[element.selector]) {
        continue;
      }

      const value = formData[element.selector] || element.value;
      if (value === undefined) continue;

      try {
        switch (element.type) {
          case 'input':
            await this.fillInput(element.selector, String(value));
            break;
          case 'select':
            await this.selectOption(element.selector, String(value));
            break;
          case 'checkbox':
            await this.toggleCheckbox(element.selector, Boolean(value));
            break;
          case 'radio':
            if (Boolean(value)) {
              await this.selectRadio(element.selector);
            }
            break;
        }
      } catch (error) {
        console.warn(`Error llenando elemento ${element.selector}: ${error}`);
      }
    }
  }

  /**
   * Espera a que aparezca un mensaje específico
   */
  async waitForMessage(message: string, timeout: number = 10000): Promise<Locator> {
    const messageLocator = this.page.locator(`text=${message}`);
    await messageLocator.waitFor({ state: 'visible', timeout });
    return messageLocator;
  }

  /**
   * Verifica si un elemento está visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      return await element.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Obtiene el texto de un elemento
   */
  async getElementText(selector: string): Promise<string> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible' });
      return await element.textContent() || '';
    } catch (error) {
      throw new Error(`Error obteniendo texto de ${selector}: ${error}`);
    }
  }

  /**
   * Obtiene el valor de un input
   */
  async getInputValue(selector: string): Promise<string> {
    try {
      const input = this.page.locator(selector);
      await input.waitFor({ state: 'visible' });
      return await input.inputValue();
    } catch (error) {
      throw new Error(`Error obteniendo valor de ${selector}: ${error}`);
    }
  }

  /**
   * Verifica si un checkbox está marcado
   */
  async isCheckboxChecked(selector: string): Promise<boolean> {
    try {
      const checkbox = this.page.locator(selector);
      await checkbox.waitFor({ state: 'visible' });
      return await checkbox.isChecked();
    } catch {
      return false;
    }
  }

  /**
   * Espera a que la página se cargue completamente
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  /**
   * Hace scroll hasta un elemento
   */
  async scrollToElement(selector: string): Promise<void> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible' });
      await element.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);
    } catch (error) {
      throw new Error(`Error haciendo scroll a ${selector}: ${error}`);
    }
  }

  /**
   * Maneja un modal o popup si aparece
   */
  async handleModal(acceptSelector?: string, cancelSelector?: string): Promise<void> {
    try {
      // Buscar botones comunes de modales
      const acceptButton = acceptSelector ? 
        this.page.locator(acceptSelector) : 
        this.page.locator('button:has-text("OK"), button:has-text("Accept"), button:has-text("Continue")');
      
      const cancelButton = cancelSelector ? 
        this.page.locator(cancelSelector) : 
        this.page.locator('button:has-text("Cancel"), button:has-text("Close")');

      if (await acceptButton.isVisible()) {
        await acceptButton.click();
        await this.page.waitForTimeout(500);
      } else if (await cancelButton.isVisible()) {
        await cancelButton.click();
        await this.page.waitForTimeout(500);
      }
    } catch (error) {
      // Si no hay modal, continuar
      console.log('No se encontró modal para manejar');
    }
  }

  /**
   * Verifica si hay errores de validación
   */
  async hasValidationErrors(): Promise<boolean> {
    const errorSelectors = [
      '.error',
      '.validation-error',
      '[data-testid*="error"]',
      'text=Error',
      'text=Required',
      'text=Invalid'
    ];

    for (const selector of errorSelectors) {
      try {
        const errorElement = this.page.locator(selector);
        if (await errorElement.isVisible()) {
          return true;
        }
      } catch {
        // Continuar con el siguiente selector
      }
    }

    return false;
  }

  /**
   * Obtiene todos los errores de validación
   */
  async getValidationErrors(): Promise<string[]> {
    const errors: string[] = [];
    const errorSelectors = [
      '.error',
      '.validation-error',
      '[data-testid*="error"]'
    ];

    for (const selector of errorSelectors) {
      try {
        const errorElements = this.page.locator(selector);
        const count = await errorElements.count();
        
        for (let i = 0; i < count; i++) {
          const text = await errorElements.nth(i).textContent();
          if (text) {
            errors.push(text.trim());
          }
        }
      } catch {
        // Continuar con el siguiente selector
      }
    }

    return errors;
  }
}
