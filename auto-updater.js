const { SMNWeatherClient } = require('./index.js');

class AutoUpdater {
    constructor(intervalMinutes = 15) {
        this.intervalMinutes = intervalMinutes;
        this.intervalMs = intervalMinutes * 60 * 1000;
        this.smtClient = new SMNWeatherClient();
        this.isRunning = false;
        this.intervalId = null;
        this.lastUpdate = null;
    }

    async updateWeatherData() {
        try {
            console.log(`🔄 [${new Date().toLocaleString('es-AR')}] Actualizando datos meteorológicos...`);
            
            const weatherData = await this.smtClient.getWeatherData();
            
            if (weatherData.success) {
                this.lastUpdate = new Date();
                console.log(`✅ [${this.lastUpdate.toLocaleString('es-AR')}] Datos actualizados exitosamente`);
                console.log(`📊 Total de estaciones: ${weatherData.data.length}`);
                console.log(`⏰ Próxima actualización en ${this.intervalMinutes} minutos`);
            } else {
                console.error(`❌ [${new Date().toLocaleString('es-AR')}] Error al actualizar datos:`, weatherData.error);
            }
        } catch (error) {
            console.error(`💥 [${new Date().toLocaleString('es-AR')}] Error inesperado:`, error.message);
        }
    }

    start() {
        if (this.isRunning) {
            console.log('⚠️  El actualizador ya está ejecutándose');
            return;
        }

        console.log('🚀 Iniciando actualizador automático de datos SMN');
        console.log(`⏰ Intervalo de actualización: cada ${this.intervalMinutes} minutos`);
        console.log('🌐 Fuente: https://ws.smn.gob.ar/map_items/weather');
        
        // Actualización inicial
        this.updateWeatherData();
        
        // Programar actualizaciones periódicas
        this.intervalId = setInterval(() => {
            this.updateWeatherData();
        }, this.intervalMs);
        
        this.isRunning = true;
        console.log('✅ Actualizador iniciado correctamente');
        console.log('⏹️  Para detener: Ctrl+C');
    }

    stop() {
        if (!this.isRunning) {
            console.log('⚠️  El actualizador no está ejecutándose');
            return;
        }

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.isRunning = false;
        console.log('🛑 Actualizador detenido');
    }

    getStatus() {
        return {
            isRunning: this.isRunning,
            intervalMinutes: this.intervalMinutes,
            lastUpdate: this.lastUpdate,
            nextUpdate: this.isRunning && this.lastUpdate ? 
                new Date(this.lastUpdate.getTime() + this.intervalMs) : null
        };
    }

    printStatus() {
        const status = this.getStatus();
        console.log('\n📊 ESTADO DEL ACTUALIZADOR AUTOMÁTICO');
        console.log('════════════════════════════════════');
        console.log(`Estado: ${status.isRunning ? '🟢 Ejecutándose' : '🔴 Detenido'}`);
        console.log(`Intervalo: ${status.intervalMinutes} minutos`);
        console.log(`Última actualización: ${status.lastUpdate ? status.lastUpdate.toLocaleString('es-AR') : 'Nunca'}`);
        console.log(`Próxima actualización: ${status.nextUpdate ? status.nextUpdate.toLocaleString('es-AR') : 'No programada'}`);
        console.log('════════════════════════════════════\n');
    }
}

// Ejecutar solo si es el archivo principal
if (require.main === module) {
    const updater = new AutoUpdater(15); // 15 minutos por defecto
    
    // Manejar argumentos de línea de comandos
    const args = process.argv.slice(2);
    let interval = 15;
    
    if (args.length > 0) {
        const customInterval = parseInt(args[0]);
        if (customInterval && customInterval > 0) {
            interval = customInterval;
            console.log(`⚙️  Intervalo personalizado: ${interval} minutos`);
        }
    }
    
    const customUpdater = new AutoUpdater(interval);
    
    // Manejo elegante del cierre
    process.on('SIGINT', () => {
        console.log('\n🛑 Deteniendo actualizador...');
        customUpdater.stop();
        console.log('✅ Actualizador detenido correctamente');
        process.exit(0);
    });
    
    // Mostrar estado cada hora
    setInterval(() => {
        customUpdater.printStatus();
    }, 60 * 60 * 1000); // cada hora
    
    customUpdater.start();
}

module.exports = { AutoUpdater };
