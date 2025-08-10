const fs = require('fs');
const path = require('path');
const http = require('http');

class WeatherVisualizationServer {
    constructor(port = 3000) {
        this.port = port;
        this.server = null;
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

    handleRequest(req, res) {
        let filePath = req.url === '/' ? '/visualizacion.html' : req.url;
        
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
                'Cache-Control': 'no-cache'
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

    start() {
        this.server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        this.server.listen(this.port, () => {
            console.log('🚀 Servidor de visualización iniciado');
            console.log(`📍 URL: http://localhost:${this.port}`);
            console.log('🌤️  Visualización de datos meteorológicos disponible');
            console.log('⏹️  Presiona Ctrl+C para detener el servidor');
        });

        // Manejo elegante del cierre
        process.on('SIGINT', () => {
            console.log('\n🛑 Deteniendo servidor...');
            this.server.close(() => {
                console.log('✅ Servidor detenido correctamente');
                process.exit(0);
            });
        });
    }
}

// Ejecutar solo si es el archivo principal
if (require.main === module) {
    const server = new WeatherVisualizationServer(3000);
    server.start();
}

module.exports = { WeatherVisualizationServer };
