
# SMN Weather API - Conexión al Servicio Meteorológico Nacional

Aplicación Node.js 20 que se conecta a la API del Servicio Meteorológico Nacional de Argentina para obtener datos del clima actual y pronósticos meteorológicos.

## 🚀 Características

- ✅ **Node.js 20**: Utiliza la versión más reciente de Node.js
- 🌐 **API SMN**: Conexión directa a `https://ws.smn.gob.ar/`
- 🌤️ **Datos meteorológicos**: Obtiene estado del clima actual + pronóstico
- 📊 **Endpoint**: GET a `map_items/weather`
- 💾 **Exportación**: Guarda los datos en formato JSON
- 🛡️ **Manejo de errores**: Control robusto de errores y timeouts
- 🎨 **Visualización web**: Interface visual con cards agrupadas por provincia
- 🔍 **Filtros avanzados**: Filtrado dinámico por provincia y búsqueda por ciudad
- 📱 **Responsive**: Diseño adaptable a diferentes dispositivos
- ⚡ **Búsqueda en tiempo real**: Resaltado de resultados con sugerencias instantáneas

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/macchifederico/mcp-github.git
cd mcp-github

# Instalar dependencias
npm install

# Ejecutar la aplicación
npm start
```

## 🔧 Uso

### 📊 Obtener datos meteorológicos (manual)
```bash
# Ejecutar recolección de datos una vez
npm start
```

### 🌐 Visualizar datos en el navegador
```bash
# Servidor básico (datos estáticos)
npm run visualize

# Servidor con auto-actualización (datos siempre frescos)
npm run visualize-live

# Abrir en el navegador: http://localhost:3000
```

### 🔄 Actualización automática en background
```bash
# Actualizar datos cada 15 minutos (por defecto)
npm run auto-update

# Actualizar cada X minutos (personalizado)
node auto-updater.js 30  # cada 30 minutos
```

### ⚙️ Configurar cron job (Windows)
```powershell
# Ejecutar como Administrador
.\setup-cron.ps1

# Con intervalo personalizado
.\setup-cron.ps1 -IntervalMinutes 10
```

## 🎨 Visualización Web

La aplicación incluye una interfaz web moderna para visualizar los datos meteorológicos:

### **Características de la visualización:**
- 📋 **Cards organizadas** por provincia
- 🔍 **Filtro dinámico** por provincia
- 🌆 **Buscador de ciudades** con resaltado de resultados
- 📊 **Información completa**: temperatura, humedad, viento, descripción
- 📱 **Design responsive** para móviles y desktop
- 🎯 **Datos en tiempo real** desde `weather_data.json`
- ⚡ **Búsqueda instantánea** mientras escribes
- 🎨 **Resaltado visual** de coincidencias de búsqueda

### **Datos mostrados en cada card:**
- 🏷️ **Nombre** de la estación meteorológica
- 🌡️ **Temperatura** actual
- � **Humedad** relativa
- �💨 **Velocidad del viento**
- 🧭 **Dirección del viento** (wind_deg)
- 🌡️ **Descripción térmica** (tempDesc)
- ☁️ **Descripción** del clima

## 🔄 Sistema de Actualización Automática

### **Opciones disponibles:**

#### 🔴 **Modo Estático** (por defecto)
- Los datos se obtienen manualmente con `npm start`
- La visualización usa datos del archivo local
- Ideal para desarrollo y demos

#### 🟢 **Modo Auto-Actualización**
- Datos se actualizan automáticamente cada X minutos
- Siempre muestra información fresca del SMN
- Ideal para producción y monitoreo

### **Comandos de actualización:**

```bash
# Actualizar en background cada 15 minutos
npm run auto-update

# Personalizar intervalo (ej: cada 30 minutos)
node auto-updater.js 30

# Servidor web con auto-refresh
npm run visualize-live
```

### **Configuración de Cron Job (Windows):**

```powershell
# Ejecutar PowerShell como Administrador
.\setup-cron.ps1

# Con intervalo personalizado
.\setup-cron.ps1 -IntervalMinutes 10
```

### **Ventajas del sistema automático:**
- ✅ **Datos siempre frescos**: Actualización automática del SMN
- ✅ **Sin intervención manual**: Funciona en background
- ✅ **Configurable**: Intervalos personalizables (5-60 minutos)
- ✅ **Robusto**: Reintentos automáticos en caso de error
- ✅ **Logging**: Registro de todas las actualizaciones

## 🔍 Funcionalidades de Búsqueda y Filtrado

### **Filtros disponibles:**
- 🗺️ **Por Provincia**: Selecciona una provincia específica del dropdown
- 🏙️ **Por Ciudad**: Busca estaciones por nombre de ciudad (búsqueda parcial)
- 🔄 **Combinados**: Usa ambos filtros simultáneamente para búsquedas más precisas

### **Características del buscador:**
- ⚡ **Búsqueda en tiempo real**: Los resultados se actualizan mientras escribes
- 🎨 **Resaltado visual**: Las coincidencias se destacan en amarillo
- 🧹 **Botón limpiar**: Limpia la búsqueda rápidamente
- ⌨️ **Atajo de teclado**: Presiona `Escape` para limpiar la búsqueda
- 📊 **Contador dinámico**: Muestra el número de resultados encontrados

## 📁 Estructura del proyecto

```
mcp-github/
├── css/
│   └── style.css           # Estilos de la visualización web
├── js/
│   └── app.js              # Lógica JavaScript de la aplicación web
├── index.js                # Cliente API SMN (línea de comandos)
├── servidor.js             # Servidor web básico
├── servidor-mejorado.js    # Servidor web con auto-actualización
├── auto-updater.js         # Actualizador automático independiente
├── setup-cron.ps1          # Script PowerShell para configurar tarea programada
├── visualizacion.html      # Interface HTML principal
├── weather_data.json       # Datos meteorológicos (generado automáticamente)
├── package.json            # Configuración Node.js y dependencias
└── README.md               # Documentación
```

## 📦 Dependencies

- **axios**: Cliente HTTP para realizar las peticiones a la API
- **fs**: Sistema de archivos nativo de Node.js (para guardar datos)

## �️ Arquitectura Componentizada

La aplicación está organizada en componentes separados para mejor mantenibilidad:

- **`css/style.css`**: Estilos CSS separados y organizados
- **`js/app.js`**: Lógica JavaScript modular con clase WeatherVisualization
- **`visualizacion.html`**: Estructura HTML limpia sin código inline
- **`servidor.js`**: Servidor HTTP independiente para desarrollo
- **`index.js`**: Cliente CLI para obtención de datos

## 🌐 API del SMN

- **Base URL**: `https://ws.smn.gob.ar`
- **Endpoint**: `/map_items/weather`
- **Método**: GET
- **Formato**: JSON

## �🎯 Issue Resolution

Esta aplicación resuelve múltiples issues:

### Issue #1: "Crear conexion a api SMN"
- ✅ Aplicación creada con Node.js 20
- ✅ Conexión establecida a `https://ws.smn.gob.ar/`
- ✅ GET implementado a `map_items/weather`
- ✅ Obtiene clima actual + pronóstico

### Issue #2: "Crear visualizacion de datos"
- ✅ Vista web de datos de `weather_data.json`
- ✅ Cards agrupadas por provincias
- ✅ Filtro dinámico por provincia
- ✅ Información completa por estación

### Issue #3: "Componentizar"
- ✅ CSS separado en `css/style.css`
- ✅ JavaScript separado en `js/app.js`
- ✅ HTML limpio sin código inline
- ✅ Estructura modular y mantenible

### Issue #4: "Implementar buscador"
- ✅ Buscador por ciudad implementado
- ✅ Búsqueda en tiempo real con resaltado
- ✅ Filtros combinables (provincia + ciudad)
- ✅ Contador dinámico de resultados
- ✅ Atajos de teclado y botón de limpiar

## 📄 Licencia

ISC License