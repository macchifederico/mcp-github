const axios = require('axios');

// Configuración de la API del Servicio Meteorológico Nacional
const SMN_BASE_URL = 'https://ws.smn.gob.ar';
const WEATHER_ENDPOINT = '/map_items/weather';

class SMNWeatherClient {
    constructor() {
        this.baseURL = SMN_BASE_URL;
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 10000, // 10 segundos de timeout
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    /**
     * Obtiene el estado del clima actual y pronóstico desde la API del SMN
     * @returns {Promise<Object>} Datos meteorológicos del SMN
     */
    async getWeatherData() {
        try {
            console.log('🌤️  Conectando a la API del SMN...');
            console.log(`📡 URL: ${this.baseURL}${WEATHER_ENDPOINT}`);
            
            const response = await this.client.get(WEATHER_ENDPOINT);
            
            console.log('✅ Conexión exitosa a la API del SMN');
            console.log(`📊 Datos recibidos: ${response.data.length} elementos`);
            
            return {
                success: true,
                data: response.data,
                timestamp: new Date().toISOString(),
                source: `${this.baseURL}${WEATHER_ENDPOINT}`
            };
        } catch (error) {
            console.error('❌ Error al conectar con la API del SMN:', error.message);
            
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString(),
                source: `${this.baseURL}${WEATHER_ENDPOINT}`
            };
        }
    }

    /**
     * Muestra un resumen de los datos meteorológicos
     * @param {Object} weatherData - Datos meteorológicos del SMN
     */
    displayWeatherSummary(weatherData) {
        if (!weatherData.success) {
            console.log('❌ No se pudieron obtener los datos meteorológicos');
            return;
        }

        console.log('\n=== RESUMEN DEL CLIMA - SMN ARGENTINA ===');
        console.log(`📅 Fecha: ${new Date().toLocaleDateString('es-AR')}`);
        console.log(`⏰ Hora: ${new Date().toLocaleTimeString('es-AR')}`);
        console.log(`🌍 Total de estaciones: ${weatherData.data.length}`);
        
        // Mostrar información de algunas estaciones como ejemplo
        const sampleStations = weatherData.data.slice(0, 5);
        
        console.log('\n🌡️  MUESTRA DE ESTACIONES METEOROLÓGICAS:');
        sampleStations.forEach((station, index) => {
            console.log(`\n${index + 1}. ${station.name || 'Sin nombre'}`);
            console.log(`   📍 Provincia: ${station.province || 'No especificada'}`);
            console.log(`   🌡️  Temperatura: ${station.weather?.temp || 'N/A'}°C`);
            console.log(`   💨 Viento: ${station.weather?.wind_speed || 'N/A'} km/h`);
            console.log(`   💧 Humedad: ${station.weather?.humidity || 'N/A'}%`);
            console.log(`   ☁️  Descripción: ${station.weather?.description || 'N/A'}`);
        });
        
        console.log('\n📋 Para ver todos los datos completos, revisa el objeto weatherData.data');
    }
}

// Función principal
async function main() {
    console.log('🚀 Iniciando aplicación de conexión a API SMN');
    console.log('📦 Node.js version:', process.version);
    console.log('🌐 Conectando al Servicio Meteorológico Nacional de Argentina...\n');
    
    const smtClient = new SMNWeatherClient();
    
    try {
        // Obtener datos meteorológicos
        const weatherData = await smtClient.getWeatherData();
        
        // Mostrar resumen
        smtClient.displayWeatherSummary(weatherData);
        
        // Guardar datos completos en archivo JSON para referencia
        const fs = require('fs');
        if (weatherData.success) {
            fs.writeFileSync('weather_data.json', JSON.stringify(weatherData, null, 2));
            console.log('\n💾 Datos completos guardados en: weather_data.json');
        }
        
    } catch (error) {
        console.error('💥 Error inesperado:', error.message);
        process.exit(1);
    }
}

// Ejecutar solo si es el archivo principal
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { SMNWeatherClient };
