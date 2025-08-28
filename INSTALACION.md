# 📋 Instalación y Configuración del PlayStore RPA Bot

## 🚀 Instalación Rápida

### 1. **Instalar Dependencias**
```bash
npm install
```

### 2. **Instalar Chrome para Playwright**
```bash
npm run install-chrome
# o para todos los navegadores
npm run install-browsers
```

### 3. **Configurar Variables de Entorno**
```bash
cp env.example .env
```

### 4. **Editar archivo .env**
```bash
# Abrir .env y configurar tus credenciales
GOOGLE_EMAIL=tu-email@gmail.com
GOOGLE_PASSWORD=tu-contraseña
```

### 5. **Configurar tu Aplicación**
```bash
cp config.example.json config.json
# Editar config.json con los datos de tu app
```

## ⚙️ Configuración Detallada

### **Navegadores Disponibles**
El bot está configurado para usar **Chrome** como navegador principal:

```bash
# Instalar solo Chrome (recomendado)
npm run install-chrome

# Instalar todos los navegadores
npm run install-browsers

# Instalar navegadores específicos
npm run install-firefox
npm run install-webkit
```

### **Archivo .env**
```bash
# Credenciales de Google Play Console
GOOGLE_EMAIL=tu-email@gmail.com
GOOGLE_PASSWORD=tu-contraseña

# Configuración del bot
HEADLESS=false          # true para ejecutar sin interfaz
SLOW_MO=1000           # Pausa entre acciones (ms)
TIMEOUT=30000          # Timeout para operaciones (ms)

# URLs (no cambiar)
PLAY_CONSOLE_URL=https://play.google.com/console
PLAY_STORE_URL=https://play.google.com/store

# Configuración de archivos
ASSETS_PATH=./assets
SCREENSHOTS_PATH=./screenshots
LOGS_PATH=./logs
```

### **Archivo config.json**
```json
{
  "app": {
    "name": "Nombre de tu App",
    "packageName": "com.tuempresa.tuapp",
    "version": "1.0.0",
    "description": "Descripción de tu aplicación",
    "category": "Productivity",
    "tags": ["tag1", "tag2", "tag3"]
  },
  "storeListing": {
    "shortDescription": "Descripción corta (80 caracteres)",
    "fullDescription": "Descripción completa de tu app",
    "keywords": "palabra clave 1, palabra clave 2",
    "website": "https://tuwebsite.com",
    "email": "tu-email@dominio.com",
    "privacyPolicyUrl": "https://tuwebsite.com/privacy",
    "termsOfServiceUrl": "https://tuwebsite.com/terms"
  }
}
```

## 📱 Preparar Assets

### **Estructura de Carpetas**
```
assets/
├── phone/              # Imágenes de teléfono (1080x1920+)
│   ├── screenshot1.png
│   └── screenshot2.png
├── seven-inch/         # Imágenes de tablet 7" (1200x1920)
├── ten-inch/           # Imágenes de tablet 10" (1920x1200)
├── icon.png            # Icono de la app (512x512)
└── feature-graphic.png # Feature graphic (1024x500)
```

### **Requisitos de Imágenes**
- **Teléfono**: Mínimo 2, máximo 8 imágenes
- **Tablet 7"**: Opcional, 0-2 imágenes
- **Tablet 10"**: Opcional, 0-2 imágenes
- **Icono**: 512×512 píxeles (PNG)
- **Feature Graphic**: 1024×500 píxeles (PNG)

## 🔧 Verificación de Instalación

### **Verificar Dependencias**
```bash
npm list --depth=0
```

### **Verificar TypeScript**
```bash
npx tsc --version
```

### **Verificar Playwright**
```bash
npx playwright --version
```

### **Verificar Chrome**
```bash
# Verificar que Chrome esté instalado
npx playwright install chrome
```

### **Compilar Proyecto**
```bash
npm run build
```

## 🚨 Solución de Problemas

### **Error: "ts-node no encontrado"**
```bash
npm install -g ts-node
# o
npm install --save-dev ts-node
```

### **Error: "Chrome no encontrado"**
```bash
npm run install-chrome
```

### **Error: "Archivo .env no encontrado"**
```bash
cp env.example .env
# Editar .env con tus credenciales
```

### **Error: "Credenciales no configuradas"**
Verificar que el archivo `.env` contenga:
- `GOOGLE_EMAIL`
- `GOOGLE_PASSWORD`

### **Error: "Archivo config.json no encontrado"**
```bash
cp config.example.json config.json
# Editar config.json con tus datos
```

### **Error: "Chrome no se puede ejecutar"**
```bash
# En macOS, verificar permisos
sudo xcode-select --install

# En Linux, instalar dependencias
sudo apt-get install -y libgconf-2-4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libasound2

# En Windows, verificar que Chrome esté instalado
```

## ✅ Verificación Final

Antes de ejecutar el bot, verifica que tengas:

- [ ] Node.js 18+ instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Chrome instalado para Playwright (`npm run install-chrome`)
- [ ] Archivo `.env` configurado
- [ ] Archivo `config.json` configurado
- [ ] Assets preparados en la carpeta `assets/`
- [ ] Cuenta de Google Play Console activa

## 🌐 Navegadores Soportados

El bot está optimizado para usar **Chrome** como navegador principal, pero también soporta:

- **Chrome** (recomendado) - Mejor compatibilidad con Google Play Console
- **Firefox** - Soporte completo
- **Safari/WebKit** - Soporte básico

## 🎯 Próximo Paso

Una vez completada la instalación, continúa con:
**[USO.md](./USO.md)** - Cómo ejecutar el bot
