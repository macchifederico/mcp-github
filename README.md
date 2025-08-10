
# SMN Weather API - Conexión al Servicio Meteorológico Nacional

Aplicación Node.js 20 que se conecta a la API del Servicio Meteorológico Nacional de Argentina para obtener datos del clima actual y pronósticos meteorológicos.

## 🚀 Características

- ✅ **Node.js 20**: Utiliza la versión más reciente de Node.js
- 🌐 **API SMN**: Conexión directa a `https://ws.smn.gob.ar/`
- 🌤️ **Datos meteorológicos**: Obtiene estado del clima actual + pronóstico
- 📊 **Endpoint**: GET a `map_items/weather`
- 💾 **Exportación**: Guarda los datos en formato JSON
- 🛡️ **Manejo de errores**: Control robusto de errores y timeouts

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

### Ejecución básica
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

## 📋 Datos disponibles

La aplicación obtiene información de múltiples estaciones meteorológicas incluyendo:

- 🌡️ **Temperatura** actual
- 💨 **Velocidad del viento**
- 💧 **Humedad relativa**
- ☁️ **Descripción del clima**
- 📍 **Ubicación** (provincia, ciudad)
- 🕐 **Timestamp** de la consulta

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