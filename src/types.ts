export interface AppConfig {
  app: {
    name: string;
    packageName: string;
    version: string;
    description: string;
    category: string;
    tags: string[];
  };
  storeListing: {
    shortDescription: string;
    fullDescription: string;
    keywords: string;
    website: string;
    email: string;
    privacyPolicyUrl: string;
    termsOfServiceUrl: string;
  };
  policies: {
    ads: boolean;
    targetAudience: string;
    contentRating: string;
    dataCollection: {
      personalInfo: boolean;
      location: boolean;
      deviceInfo: boolean;
      analytics: boolean;
    };
  };
  testing: {
    internalTesting: boolean;
    closedTesting: boolean;
    openTesting: boolean;
  };
  assets: {
    phone: AssetConfig;
    sevenInch: AssetConfig;
    tenInch: AssetConfig;
    icon: AssetConfig;
    featureGraphic: AssetConfig;
  };
}

export interface AssetConfig {
  required: number;
  optional?: number;
  dimensions: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface BotConfig {
  headless: boolean;
  slowMo: number;
  timeout: number;
  playConsoleUrl: string;
  playStoreUrl: string;
}

export interface FlowResult {
  success: boolean;
  message: string;
  data?: any;
  error?: Error;
}

export interface NavigationState {
  currentPage: string;
  currentStep: string;
  progress: number;
}

export interface FileUploadResult {
  success: boolean;
  filePath: string;
  uploaded: boolean;
  error?: string;
}

export interface UIElement {
  selector: string;
  type: 'input' | 'button' | 'select' | 'checkbox' | 'radio' | 'text';
  required: boolean;
  value?: string | boolean;
  options?: string[];
}

export interface FormData {
  [key: string]: string | boolean | string[];
}
