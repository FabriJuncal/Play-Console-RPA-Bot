# 🚀 Cómo Ejecutar el PlayStore RPA Bot

## 🌐 **Navegador Principal: Chrome**

El bot está configurado para usar **Chrome** como navegador principal, lo que proporciona:
- ✅ Mejor compatibilidad con Google Play Console
- ✅ Soporte completo para todas las funcionalidades
- ✅ Mejor rendimiento y estabilidad
- ✅ Sesiones persistentes más confiables

## 📋 Comandos Principales

### **Ejecutar Flujo Completo**
```bash
npm start
# o
node start.js
```

### **Ejecutar Flujo Específico**
```bash
# Crear aplicación
npm run flow:create

# Configurar Store Listing
npm run flow:store

# Configurar políticas y anuncios
npm run flow:policies

# Configurar audiencia objetivo
npm run flow:audience

# Configurar calificación de contenido
npm run flow:rating

# Configurar seguridad de datos
npm run flow:safety

# Configurar testing interno
npm run flow:testing
```

## 🎯 Flujos Disponibles

### **1. createApp** - Crear Aplicación
- Navega a Play Console usando Chrome
- Crea nueva aplicación
- Llena formulario básico
- Sube bundle (APK/AAB)

### **2. storeListing** - Store Listing
- Configura información básica
- Sube imágenes de teléfono
- Sube imágenes de tablet
- Configura descripciones
- Configura información de contacto

### **3. policiesAndAds** - Políticas y Anuncios
- Configura políticas de contenido
- Configura si muestra anuncios

### **4. targetAudience** - Audiencia Objetivo
- Define audiencia objetivo
- Configura segmentación

### **5. contentRating** - Calificación de Contenido
- Configura calificación PEGI/ESRB
- Define edad mínima

### **6. dataSafety** - Seguridad de Datos
- Configura recolección de datos
- Define políticas de privacidad

### **7. internalTesting** - Testing Interno
- Habilita testing interno
- Configura testing cerrado/abierto

## 🔧 Modos de Ejecución

### **Modo Desarrollo (con interfaz de Chrome)**
```bash
# Ver Chrome mientras ejecuta
HEADLESS=false npm start
```

### **Modo Producción (Chrome en segundo plano)**
```bash
# Ejecutar Chrome sin interfaz
HEADLESS=true npm start
```

### **Modo Lento (para debugging en Chrome)**
```bash
# Pausa de 2 segundos entre acciones
SLOW_MO=2000 npm start
```

### **Modo Rápido (Chrome optimizado)**
```bash
# Pausa mínima entre acciones
SLOW_MO=500 npm start
```

## 📊 Monitoreo y Logs

### **Ver Logs en Tiempo Real**
```bash
npm start | tee bot.log
```

### **Ejecutar con Logs Detallados**
```bash
DEBUG=* npm start
```

### **Guardar Screenshots de Errores**
El bot automáticamente guarda screenshots en caso de error en la carpeta `screenshots/`

## 🚨 Manejo de Errores

### **Error de Login en Chrome**
```bash
# Limpiar sesión guardada de Chrome
npm run clean-session
# Reintentar login
npm start
```

### **Error de Navegación en Chrome**
```bash
# Verificar conectividad
ping play.google.com
# Reintentar con timeout mayor
TIMEOUT=60000 npm start
```

### **Error de Assets**
```bash
# Verificar que existan las imágenes
ls -la assets/phone/
# Reintentar flujo específico
npm run flow:store
```

### **Error de Chrome**
```bash
# Reinstalar Chrome para Playwright
npm run install-chrome

# Verificar permisos en macOS
sudo xcode-select --install

# Verificar dependencias en Linux
sudo apt-get install -y libgconf-2-4 libatk1.0-0
```

## 🔄 Reintentos y Recuperación

### **Reintentar Flujo Fallido**
```bash
# Si falló el store listing
npm run flow:store

# Si falló la creación de app
npm run flow:create
```

### **Continuar desde un Punto Específico**
```bash
# Continuar desde store listing
npm run flow:store
npm run flow:policies
npm run flow:audience
# ... etc
```

## 📱 Verificación de Resultados

### **Verificar Estado de la App**
```bash
# El bot genera reportes automáticamente
cat reports/report_*.json
```

### **Verificar Screenshots**
```bash
# Ver capturas de pantalla
ls -la screenshots/
```

### **Verificar Logs**
```bash
# Ver logs del bot
tail -f bot.log
```

## ⚡ Optimizaciones para Chrome

### **Ejecución Rápida con Chrome**
```bash
# Configuración optimizada para velocidad
HEADLESS=true SLOW_MO=300 TIMEOUT=15000 npm start
```

### **Ejecución Estable con Chrome**
```bash
# Configuración para máxima estabilidad
HEADLESS=false SLOW_MO=2000 TIMEOUT=60000 npm start
```

### **Chrome con Configuración Personalizada**
```bash
# Usar Chrome con configuraciones específicas
CHROME_ARGS="--disable-extensions --disable-plugins" npm start
```

## 🎮 Ejemplos Prácticos

### **Ejemplo 1: Primera Ejecución con Chrome**
```bash
# 1. Configurar credenciales
cp env.example .env
# Editar .env con tu email y contraseña

# 2. Configurar aplicación
cp config.example.json config.json
# Editar config.json con datos de tu app

# 3. Instalar Chrome
npm run install-chrome

# 4. Ejecutar flujo completo
npm start
```

### **Ejemplo 2: Solo Store Listing con Chrome**
```bash
# Si ya tienes la app creada
npm run flow:store
```

### **Ejemplo 3: Testing y Políticas con Chrome**
```bash
# Configurar testing y políticas
npm run flow:testing
npm run flow:policies
```

### **Ejemplo 4: Modo Debug con Chrome**
```bash
# Ejecutar con interfaz de Chrome visible y pausas largas
HEADLESS=false SLOW_MO=3000 npm start
```

## 📋 Checklist de Ejecución

Antes de ejecutar, verifica:

- [ ] Archivo `.env` configurado con credenciales
- [ ] Archivo `config.json` configurado con datos de la app
- [ ] Assets preparados en carpeta `assets/`
- [ ] Chrome instalado para Playwright (`npm run install-chrome`)
- [ ] Conexión a internet estable
- [ ] Cuenta de Google Play Console activa

## 🌐 Navegadores Alternativos

Si prefieres usar otros navegadores:

```bash
# Firefox
npm run install-firefox
# Modificar playwright.config.ts para usar firefox

# Safari/WebKit
npm run install-webkit
# Modificar playwright.config.ts para usar webkit
```

## 🚀 Próximos Pasos

Una vez que hayas ejecutado el bot exitosamente:

1. **Revisar reportes** en la carpeta `reports/`
2. **Verificar screenshots** en la carpeta `screenshots/`
3. **Revisar logs** para identificar posibles mejoras
4. **Personalizar flujos** según tus necesidades específicas

## 🆘 Soporte

Si encuentras problemas:

1. Revisa la carpeta `screenshots/` para capturas de error
2. Verifica los logs del bot
3. Asegúrate de que Chrome esté instalado correctamente
4. Consulta la documentación de Playwright
5. Abre un issue en el repositorio

---

**¡El bot está configurado para usar Chrome y listo para automatizar tu proceso de publicación en Google Play Store! 🎉**
