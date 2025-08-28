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
│  ├─ main.ts               # Orquestador principal
│  ├─ login.ts              # Gestión de login y sesión (Chrome)
│  ├─ types.ts              # Definiciones de tipos
│  ├─ flows/                # Flujos de automatización
│  ├─ helpers/              # Utilidades y helpers (UI, archivos, navegación)
│  └─ setup/                # Setup/teardown global de Playwright
├─ assets/                  # Imágenes y recursos de la app
├─ dist/                    # Código compilado (tsc)
├─ CHROME-SETUP.md          # Guía para uso con Google Chrome
├─ INSTALACION.md           # Guía de instalación paso a paso
├─ USO.md                   # Guía de ejecución y modos de uso
├─ playwright.config.ts     # Configuración de Playwright (channel: 'chrome')
├─ start.js                 # Script de arranque (ts-node)
├─ verify-chrome.js         # Verificación de Chrome con Playwright
├─ config.json              # Configuración de la app (tuya)
├─ config.example.json      # Ejemplo de configuración
├─ env.example              # Variables de entorno de ejemplo
├─ tsconfig.json            # Configuración de TypeScript
├─ .eslintrc.js             # Reglas de ESLint
├─ .prettierrc              # Configuración de Prettier
├─ .gitignore               # Ignorar artefactos y secretos
└─ package.json             # Dependencias y scripts
```

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**.

Copyright (c) 2025 [Tu Nombre]

Se concede permiso, de forma gratuita, a cualquier persona que obtenga una copia de este software y de los archivos de documentación asociados (el "Software"), para tratar el Software sin restricción, incluyendo sin limitación los derechos a usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del Software, y a permitir a las personas a las que se les proporcione el Software a hacer lo mismo, sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas las copias o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O IMPLÍCITA, INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIABILIDAD, APTITUD PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN. EN NINGÚN CASO LOS AUTORES O TITULARES DEL COPYRIGHT SERÁN RESPONSABLES DE NINGUNA RECLAMACIÓN, DAÑO U OTRA RESPONSABILIDAD, YA SEA EN UNA ACCIÓN DE CONTRATO, AGRAVIO O CUALQUIER OTRO MOTIVO, QUE SURJA DE O EN CONEXIÓN CON EL SOFTWARE O EL USO U OTRO TIPO DE ACCIONES EN EL SOFTWARE.

### Disclaimer sobre Google y sus Términos

- Este proyecto no está afiliado, patrocinado ni avalado por Google LLC.
- El uso de este bot para automatizar Google Play Console puede estar sujeto a los **Términos de Servicio** y **políticas** de Google. Es tu responsabilidad revisar y cumplir dichos términos.
- El autor no se hace responsable por suspensiones de cuenta, bloqueos, captchas, limitaciones o cualquier consecuencia derivada del uso de este software.
- Utiliza este proyecto con fines educativos y bajo tu propio riesgo.

Si vas a publicar en GitHub, se recomienda incluir un archivo `LICENSE` con el texto completo de la licencia MIT.

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
