import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { FileUploadResult, AssetConfig } from '../types';

export class FilesHelper {
  private page: Page;
  private assetsPath: string;

  constructor(page: Page, assetsPath: string = './assets') {
    this.page = page;
    this.assetsPath = assetsPath;
  }

  /**
   * Verifica si existen los assets requeridos
   */
  async validateRequiredAssets(assetConfig: AssetConfig): Promise<boolean> {
    const { required, dimensions } = assetConfig;
    
    if (required === 0) return true;

    const files = await this.getAssetFiles(dimensions);
    return files.length >= required;
  }

  /**
   * Obtiene la lista de archivos de assets disponibles
   */
  private async getAssetFiles(dimensions: string): Promise<string[]> {
    const dimensionPath = this.getDimensionPath(dimensions);
    
    if (!fs.existsSync(dimensionPath)) {
      return [];
    }

    const files = fs.readdirSync(dimensionPath);
    return files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg'].includes(ext);
    });
  }

  /**
   * Obtiene la ruta del directorio según las dimensiones
   */
  private getDimensionPath(dimensions: string): string {
    switch (dimensions) {
      case '1080x1920+':
        return path.join(this.assetsPath, 'phone');
      case '1200x1920':
        return path.join(this.assetsPath, 'seven-inch');
      case '1920x1200':
        return path.join(this.assetsPath, 'ten-inch');
      case '512x512':
        return path.join(this.assetsPath);
      case '1024x500':
        return path.join(this.assetsPath);
      default:
        return this.assetsPath;
    }
  }

  /**
   * Sube un archivo de imagen
   */
  async uploadImage(filePath: string, selector: string): Promise<FileUploadResult> {
    try {
      // Verificar que el archivo existe
      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          filePath,
          uploaded: false,
          error: 'Archivo no encontrado'
        };
      }

      // Buscar el input de archivo
      const fileInput = this.page.locator(selector);
      await fileInput.waitFor({ state: 'visible' });

      // Subir el archivo
      await fileInput.setInputFiles(filePath);
      
      // Esperar a que se complete la subida
      await this.page.waitForTimeout(2000);

      return {
        success: true,
        filePath,
        uploaded: true
      };
    } catch (error) {
      return {
        success: false,
        filePath,
        uploaded: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Sube múltiples imágenes para un dispositivo específico
   */
  async uploadDeviceImages(deviceType: 'phone' | 'seven-inch' | 'ten-inch', selector: string): Promise<FileUploadResult[]> {
    const devicePath = path.join(this.assetsPath, deviceType);
    const results: FileUploadResult[] = [];

    if (!fs.existsSync(devicePath)) {
      return results;
    }

    const files = fs.readdirSync(devicePath)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.png', '.jpg', '.jpeg'].includes(ext);
      })
      .slice(0, 8); // Máximo 8 imágenes

    for (const file of files) {
      const filePath = path.join(devicePath, file);
      const result = await this.uploadImage(filePath, selector);
      results.push(result);
      
      // Pausa entre subidas para evitar sobrecarga
      await this.page.waitForTimeout(1000);
    }

    return results;
  }

  /**
   * Sube el icono de la aplicación
   */
  async uploadAppIcon(selector: string): Promise<FileUploadResult> {
    const iconPath = path.join(this.assetsPath, 'icon.png');
    return await this.uploadImage(iconPath, selector);
  }

  /**
   * Sube la feature graphic
   */
  async uploadFeatureGraphic(selector: string): Promise<FileUploadResult> {
    const featurePath = path.join(this.assetsPath, 'feature-graphic.png');
    return await this.uploadImage(featurePath, selector);
  }

  /**
   * Crea un directorio si no existe
   */
  async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Guarda un screenshot de la página actual
   */
  async takeScreenshot(name: string, dirPath: string = './screenshots'): Promise<string> {
    await this.ensureDirectoryExists(dirPath);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${name}_${timestamp}.png`;
    const filePath = path.join(dirPath, fileName);
    
    await this.page.screenshot({ path: filePath, fullPage: true });
    return filePath;
  }

  /**
   * Verifica el tamaño de un archivo de imagen
   */
  async validateImageDimensions(): Promise<boolean> {
    // Esta función requeriría una librería adicional como 'sharp' o 'jimp'
    // Por ahora retornamos true como placeholder
    return true;
  }

  /**
   * Obtiene información de un archivo
   */
  getFileInfo(filePath: string): { size: number; exists: boolean; extension: string } {
    if (!fs.existsSync(filePath)) {
      return { size: 0, exists: false, extension: '' };
    }

    const stats = fs.statSync(filePath);
    const extension = path.extname(filePath).toLowerCase();
    
    return {
      size: stats.size,
      exists: true,
      extension
    };
  }

  /**
   * Lista todos los assets disponibles
   */
  listAvailableAssets(): { [key: string]: string[] } {
    const assets: { [key: string]: string[] } = {};
    
    const directories = ['phone', 'seven-inch', 'ten-inch'];
    
    for (const dir of directories) {
      const dirPath = path.join(this.assetsPath, dir);
      if (fs.existsSync(dirPath)) {
        assets[dir] = fs.readdirSync(dirPath)
          .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.png', '.jpg', '.jpeg'].includes(ext);
          });
      } else {
        assets[dir] = [];
      }
    }

    // Verificar icono y feature graphic
    const iconPath = path.join(this.assetsPath, 'icon.png');
    const featurePath = path.join(this.assetsPath, 'feature-graphic.png');
    
    assets['icon'] = fs.existsSync(iconPath) ? ['icon.png'] : [];
    assets['feature-graphic'] = fs.existsSync(featurePath) ? ['feature-graphic.png'] : [];

    return assets;
  }
}
