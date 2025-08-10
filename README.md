
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

## 🌐 API del SMN

- **Base URL**: `https://ws.smn.gob.ar`
- **Endpoint**: `/map_items/weather`
- **Método**: GET
- **Formato**: JSON

## 📦 Dependencies

- **axios**: Cliente HTTP para realizar las peticiones a la API
- **fs**: Sistema de archivos nativo de Node.js (para guardar datos)

## 🎯 Issue Resolution

Esta aplicación resuelve la issue #1: "Crear conexion a api SMN"

- ✅ Aplicación creada con Node.js 20
- ✅ Conexión establecida a `https://ws.smn.gob.ar/`
- ✅ GET implementado a `map_items/weather`
- ✅ Obtiene clima actual + pronóstico

## 📄 Licencia

ISC License