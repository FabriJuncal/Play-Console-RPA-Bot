# PlayStore RPA Bot

Bot de automatización (RPA) para crear y configurar aplicaciones en Google Play Store Console utilizando Playwright.

## 🚀 Características

- Automatización completa del proceso de creación de aplicaciones
- Gestión de store listing, políticas y anuncios
- Configuración de audiencia objetivo y calificación de contenido
- Gestión de seguridad de datos e internal testing
- Soporte para múltiples dispositivos (teléfono, tablet 7", tablet 10")

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de desarrollador en Google Play Console

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd playstore-rpa-bot
```

2. Instala las dependencias:
```bash
npm install
```

3. Instala los navegadores de Playwright:
```bash
npm run install-browsers
```

4. Copia el archivo de variables de entorno:
```bash
cp env.example .env
```

5. Edita el archivo `.env` con tus credenciales y configuración

6. Edita `config.json` con los datos de tu aplicación

## ⚙️ Configuración

### Variables de entorno (.env)
- `GOOGLE_EMAIL`: Tu email de Google
- `GOOGLE_PASSWORD`: Tu contraseña de Google
- `HEADLESS`: Ejecutar en modo headless (true/false)
- `SLOW_MO`: Pausa entre acciones en milisegundos

### Configuración de la app (config.json)
- `appName`: Nombre de la aplicación
- `packageName`: Nombre del paquete
- `privacyPolicyUrl`: URL de la política de privacidad
- `termsOfServiceUrl`: URL de los términos de servicio

## 🎯 Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

### Tests
```bash
npm test
npm run test:headed
npm run test:debug
```

## 📁 Estructura del Proyecto

```
playstore-rpa-bot/
├─ src/
│  ├─ main.ts              # Orquestador principal
│  ├─ login.ts             # Gestión de login y sesión
│  ├─ flows/               # Flujos de automatización
│  ├─ helpers/             # Utilidades y helpers
│  └─ types.ts             # Definiciones de tipos
├─ assets/                 # Imágenes y recursos
├─ config.json             # Configuración de la app
└─ playwright.config.ts    # Configuración de Playwright
```

## 🔄 Flujos Disponibles

1. **createApp**: Crear nueva aplicación
2. **storeListing**: Configurar store listing
3. **policiesAndAds**: Configurar políticas y anuncios
4. **targetAudience**: Definir audiencia objetivo
5. **contentRating**: Configurar calificación de contenido
6. **dataSafety**: Gestión de seguridad de datos
7. **internalTesting**: Configurar testing interno

## 📱 Assets Requeridos

### Teléfono (1080×1920+)
- Mínimo 2 capturas de pantalla
- Formato: PNG o JPG

### Tablet 7" (opcional)
- Capturas de pantalla para tablet de 7 pulgadas

### Tablet 10" (opcional)
- Capturas de pantalla para tablet de 10 pulgadas

### Icono (opcional)
- 512×512 píxeles
- Formato: PNG

### Feature Graphic (opcional)
- 1024×500 píxeles
- Formato: PNG

## ⚠️ Notas Importantes

- **Primera ejecución**: El bot realizará login manual y guardará la sesión
- **Captchas**: En caso de captcha, el bot se pausará para resolución manual
- **Verificación 2FA**: Configura tu cuenta para evitar verificaciones adicionales
- **Rate limiting**: El bot incluye pausas para evitar detección

## 🐛 Troubleshooting

### Error de login
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que la verificación en dos pasos esté configurada correctamente

### Error de navegación
- Verifica que las URLs en la configuración sean correctas
- El bot puede necesitar ajustes si Google cambia su interfaz

### Problemas de assets
- Verifica que las imágenes cumplan con los requisitos de tamaño
- Asegúrate de que los formatos sean compatibles

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas, abre un issue en el repositorio.
