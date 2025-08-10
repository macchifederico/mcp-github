
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
- 🔍 **Filtros**: Filtrado dinámico por provincia
- 📱 **Responsive**: Diseño adaptable a diferentes dispositivos

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

### Obtener datos meteorológicos
```bash
# Ejecutar recolección de datos
npm start
```

### Visualizar datos en el navegador
```bash
# Iniciar servidor de visualización
npm run visualize

# Abrir en el navegador: http://localhost:3000
```

### Ejecución básica (línea de comandos)
```bash
node index.js
```

### Como módulo
```javascript
const { SMNWeatherClient } = require('./index.js');

const client = new SMNWeatherClient();
const weatherData = await client.getWeatherData();
console.log(weatherData);
```

## 🎨 Visualización Web

La aplicación incluye una interfaz web moderna para visualizar los datos meteorológicos:

### **Características de la visualización:**
- 📋 **Cards organizadas** por provincia
- 🔍 **Filtro dinámico** por provincia
- 📊 **Información completa**: temperatura, humedad, viento, descripción
- 📱 **Design responsive** para móviles y desktop
- 🎯 **Datos en tiempo real** desde `weather_data.json`

### **Datos mostrados en cada card:**
- 🏷️ **Nombre** de la estación meteorológica
- 🌡️ **Temperatura** actual
- � **Humedad** relativa
- �💨 **Velocidad del viento**
- 🧭 **Dirección del viento** (wind_deg)
- 🌡️ **Descripción térmica** (tempDesc)
- ☁️ **Descripción** del clima

### **Iniciar visualización:**
```bash
npm run visualize
# Abrir: http://localhost:3000
```

## 📁 Estructura del proyecto

```
mcp-github/
├── css/
│   └── style.css           # Estilos de la visualización web
├── js/
│   └── app.js              # Lógica JavaScript de la aplicación web
├── index.js                # Cliente API SMN (línea de comandos)
├── servidor.js             # Servidor web para visualización
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

## 📄 Licencia

ISC License