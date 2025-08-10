const fs = require('fs');
const path = require('path');
const http = require('http');
const { SMNWeatherClient } = require('./index.js');

class WeatherVisualizationServer {
    constructor(port = 3000, autoRefresh = false, refreshIntervalMinutes = 15) {
        this.port = port;
        this.server = null;
        this.autoRefresh = autoRefresh;
        this.refreshIntervalMinutes = refreshIntervalMinutes;
        this.smtClient = new SMNWeatherClient();
        this.lastDataUpdate = null;
        this.refreshTimer = null;
    }

    getMimeType(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.ico': 'image/x-icon'
        };
        return mimeTypes[ext] || 'application/octet-stream';
    }

    async checkAndUpdateData() {
        const weatherDataPath = path.join(__dirname, 'weather_data.json');
        
        try {
            // Verificar si el archivo existe y su antigüedad
            if (fs.existsSync(weatherDataPath)) {
                const stats = fs.statSync(weatherDataPath);
                const fileAge = Date.now() - stats.mtime.getTime();
                const maxAge = this.refreshIntervalMinutes * 60 * 1000;
                
                if (fileAge < maxAge) {
                    // Los datos son recientes, no necesita actualización
                    return false;
                }
            }
            
            // Datos antiguos o archivo no existe, actualizar
            console.log('🔄 Datos desactualizados, obteniendo datos frescos del SMN...');
            const weatherData = await this.smtClient.getWeatherData();
            
            if (weatherData.success) {
                this.lastDataUpdate = new Date();
                console.log(`✅ Datos actualizados automáticamente: ${weatherData.data.length} estaciones`);
                return true;
            } else {
                console.error('❌ Error al actualizar datos automáticamente:', weatherData.error);
                return false;
            }
        } catch (error) {
            console.error('💥 Error verificando/actualizando datos:', error.message);
            return false;
        }
    }

    async handleRequest(req, res) {
        let filePath = req.url === '/' ? '/visualizacion.html' : req.url;
        
        // Si se solicita weather_data.json y auto-refresh está habilitado, verificar actualización
        if (filePath === '/weather_data.json' && this.autoRefresh) {
            await this.checkAndUpdateData();
        }
        
        // Seguridad básica: evitar acceso a archivos fuera del directorio
        filePath = path.join(__dirname, filePath);
        
        // Verificar si el archivo existe
        if (!fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                    <body style="font-family: Arial; text-align: center; padding: 50px;">
                        <h1>404 - Archivo no encontrado</h1>
                        <p>El archivo solicitado no existe.</p>
                        <a href="/">Volver al inicio</a>
                    </body>
                </html>
            `);
            return;
        }

        try {
            const content = fs.readFileSync(filePath);
            const mimeType = this.getMimeType(filePath);
            
            res.writeHead(200, { 
                'Content-Type': mimeType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': filePath.endsWith('weather_data.json') ? 'no-cache' : 'public, max-age=3600'
            });
            res.end(content);
            
            console.log(`📄 Servido: ${req.url} (${mimeType})`);
        } catch (error) {
            console.error('❌ Error leyendo archivo:', error);
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                    <body style="font-family: Arial; text-align: center; padding: 50px;">
                        <h1>500 - Error del servidor</h1>
                        <p>Error interno del servidor.</p>
                        <a href="/">Volver al inicio</a>
                    </body>
                </html>
            `);
        }
    }

    startAutoRefresh() {
        if (this.autoRefresh && !this.refreshTimer) {
            console.log(`🔄 Auto-refresh activado: cada ${this.refreshIntervalMinutes} minutos`);
            
            this.refreshTimer = setInterval(async () => {
                console.log(`🔄 [${new Date().toLocaleString('es-AR')}] Verificando actualización automática...`);
                await this.checkAndUpdateData();
            }, this.refreshIntervalMinutes * 60 * 1000);
        }
    }

    stopAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
            console.log('🛑 Auto-refresh detenido');
        }
    }

    start() {
        this.server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        this.server.listen(this.port, async () => {
            console.log('🚀 Servidor de visualización iniciado');
            console.log(`📍 URL: http://localhost:${this.port}`);
            console.log('🌤️  Visualización de datos meteorológicos disponible');
            
            if (this.autoRefresh) {
                console.log(`🔄 Auto-refresh: ${this.autoRefresh ? 'ACTIVADO' : 'DESACTIVADO'}`);
                console.log(`⏰ Intervalo de actualización: ${this.refreshIntervalMinutes} minutos`);
                await this.checkAndUpdateData(); // Verificación inicial
                this.startAutoRefresh();
            }
            
            console.log('⏹️  Presiona Ctrl+C para detener el servidor');
        });

        // Manejo elegante del cierre
        process.on('SIGINT', () => {
            console.log('\n🛑 Deteniendo servidor...');
            this.stopAutoRefresh();
            this.server.close(() => {
                console.log('✅ Servidor detenido correctamente');
                process.exit(0);
            });
        });
    }
}

// Ejecutar solo si es el archivo principal
if (require.main === module) {
    // Leer argumentos de línea de comandos
    const args = process.argv.slice(2);
    const autoRefresh = args.includes('--auto-refresh') || args.includes('-ar');
    const intervalIndex = args.indexOf('--interval') || args.indexOf('-i');
    let interval = 15;
    
    if (intervalIndex !== -1 && intervalIndex + 1 < args.length) {
        const customInterval = parseInt(args[intervalIndex + 1]);
        if (customInterval && customInterval > 0) {
            interval = customInterval;
        }
    }
    
    const server = new WeatherVisualizationServer(3000, autoRefresh, interval);
    server.start();
}

module.exports = { WeatherVisualizationServer };
