class WeatherVisualization {
    constructor() {
        this.weatherData = null;
        this.currentFilter = '';
        this.currentSearch = '';
        this.init();
    }

    async init() {
        try {
            await this.loadWeatherData();
            this.setupEventListeners();
            this.renderData();
        } catch (error) {
            console.error('Error inicializando la aplicación:', error);
            document.getElementById('loading').innerHTML = 
                '<p>❌ Error cargando los datos meteorológicos</p>';
        }
    }

    async loadWeatherData() {
        try {
            const response = await fetch('./weather_data.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar weather_data.json');
            }
            const data = await response.json();
            this.weatherData = data.data || [];
            this.lastUpdate = data.timestamp || null;
            this.dataSource = data.source || 'https://ws.smn.gob.ar/map_items/weather';
            
            console.log('Datos cargados:', this.weatherData.length, 'estaciones');
            console.log('Última actualización:', this.lastUpdate);
            
            // Actualizar información de última actualización
            this.updateLastUpdateInfo();
        } catch (error) {
            console.error('Error cargando datos:', error);
            throw error;
        }
    }

    setupEventListeners() {
        const provinceFilter = document.getElementById('provinceFilter');
        const citySearch = document.getElementById('citySearch');
        const clearSearch = document.getElementById('clearSearch');

        provinceFilter.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.renderData();
        });

        citySearch.addEventListener('input', (e) => {
            this.currentSearch = e.target.value.toLowerCase().trim();
            this.renderData();
        });

        clearSearch.addEventListener('click', () => {
            citySearch.value = '';
            this.currentSearch = '';
            this.renderData();
        });

        // Limpiar búsqueda con Escape
        citySearch.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                citySearch.value = '';
                this.currentSearch = '';
                this.renderData();
            }
        });
    }

    getUniqueProvinces() {
        const provinces = [...new Set(this.weatherData.map(station => station.province || 'Sin especificar'))];
        return provinces.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
    }

    populateProvinceFilter() {
        const select = document.getElementById('provinceFilter');
        const provinces = this.getUniqueProvinces();
        
        // Limpiar opciones existentes (excepto "Todas")
        select.innerHTML = '<option value="">Todas las Provincias</option>';
        
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            select.appendChild(option);
        });
    }

    filterData() {
        let filteredData = this.weatherData;

        // Filtrar por provincia
        if (this.currentFilter) {
            filteredData = filteredData.filter(station => 
                (station.province || 'Sin especificar') === this.currentFilter
            );
        }

        // Filtrar por búsqueda de ciudad
        if (this.currentSearch) {
            filteredData = filteredData.filter(station => {
                const stationName = (station.name || '').toLowerCase();
                return stationName.includes(this.currentSearch);
            });
        }

        return filteredData;
    }

    groupByProvince(data) {
        const grouped = {};
        data.forEach(station => {
            const province = station.province || 'Sin especificar';
            if (!grouped[province]) {
                grouped[province] = [];
            }
            grouped[province].push(station);
        });
        return grouped;
    }

    createWeatherCard(station) {
        const weather = station.weather || {};
        const temp = weather.temp !== undefined ? `${weather.temp}°C` : 'N/A';
        const humidity = weather.humidity !== undefined ? `${weather.humidity}%` : 'N/A';
        const windSpeed = weather.wind_speed !== undefined ? `${weather.wind_speed} km/h` : 'N/A';
        const windDeg = weather.wind_deg !== undefined ? `${weather.wind_deg}°` : 'N/A';
        const description = weather.description || 'Sin descripción';
        const tempDesc = weather.temp_desc || 'N/A';

        // Resaltar texto de búsqueda si existe
        let stationName = station.name || 'Estación sin nombre';
        if (this.currentSearch && stationName.toLowerCase().includes(this.currentSearch)) {
            const regex = new RegExp(`(${this.currentSearch})`, 'gi');
            stationName = stationName.replace(regex, '<mark style="background: #ffeb3b; color: #333; padding: 2px 4px; border-radius: 3px;">$1</mark>');
        }

        return `
            <div class="weather-card">
                <div class="card-header">
                    <div>
                        <div class="station-name">${stationName}</div>
                    </div>
                    <div class="temperature">${temp}</div>
                </div>
                
                <div class="weather-info">
                    <div class="info-item">
                        <span class="info-label">💧 Humedad</span>
                        <span class="info-value">${humidity}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">💨 Viento</span>
                        <span class="info-value">${windSpeed}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">🧭 Dirección</span>
                        <span class="info-value">${windDeg}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">🌡️ Sensación</span>
                        <span class="info-value">${tempDesc}</span>
                    </div>
                    <div class="description">
                        <div class="info-item">
                            <span class="info-label">☁️ Descripción</span>
                            <span class="info-value">${description}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    updateLastUpdateInfo() {
        const lastUpdateElement = document.getElementById('lastUpdateText');
        
        if (!this.lastUpdate) {
            lastUpdateElement.innerHTML = '⚠️ Información de actualización no disponible';
            return;
        }
        
        try {
            const updateDate = new Date(this.lastUpdate);
            const now = new Date();
            const timeDiff = now - updateDate;
            const minutesDiff = Math.floor(timeDiff / (1000 * 60));
            const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
            
            // Formatear fecha y hora
            const dateStr = updateDate.toLocaleDateString('es-AR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const timeStr = updateDate.toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            // Determinar qué tan reciente es la actualización
            let timeAgo = '';
            let statusClass = '';
            
            if (minutesDiff < 1) {
                timeAgo = 'Hace menos de 1 minuto';
                statusClass = 'update-fresh';
            } else if (minutesDiff < 60) {
                timeAgo = `Hace ${minutesDiff} minuto${minutesDiff !== 1 ? 's' : ''}`;
                statusClass = minutesDiff <= 30 ? 'update-fresh' : 'update-old';
            } else if (hoursDiff < 24) {
                timeAgo = `Hace ${hoursDiff} hora${hoursDiff !== 1 ? 's' : ''}`;
                statusClass = 'update-old';
            } else {
                const daysDiff = Math.floor(hoursDiff / 24);
                timeAgo = `Hace ${daysDiff} día${daysDiff !== 1 ? 's' : ''}`;
                statusClass = 'update-old';
            }
            
            lastUpdateElement.innerHTML = `
                📅 <strong>${dateStr}</strong> • 
                🕒 <strong>${timeStr}</strong> • 
                <span class="${statusClass}">⏱️ ${timeAgo}</span>
            `;
            
        } catch (error) {
            console.error('Error formateando fecha de actualización:', error);
            lastUpdateElement.innerHTML = `📅 ${this.lastUpdate} • ⚠️ Error formateando fecha`;
        }
    }

    renderData() {
        const container = document.getElementById('dataContainer');
        const loading = document.getElementById('loading');
        const noResults = document.getElementById('noResults');
        
        if (!this.weatherData || this.weatherData.length === 0) {
            loading.style.display = 'block';
            container.style.display = 'none';
            noResults.style.display = 'none';
            return;
        }

        const filteredData = this.filterData();
        
        if (filteredData.length === 0) {
            loading.style.display = 'none';
            container.style.display = 'none';
            noResults.style.display = 'block';
            
            // Mensaje personalizado según el tipo de filtro
            const noResultsMessage = document.getElementById('noResultsMessage');
            if (this.currentSearch && this.currentFilter) {
                noResultsMessage.textContent = `🔍 No se encontraron ciudades que contengan "${this.currentSearch}" en la provincia "${this.currentFilter}"`;
            } else if (this.currentSearch) {
                noResultsMessage.textContent = `🔍 No se encontraron ciudades que contengan "${this.currentSearch}"`;
            } else if (this.currentFilter) {
                noResultsMessage.textContent = `🗺️ No se encontraron estaciones en la provincia "${this.currentFilter}"`;
            } else {
                noResultsMessage.textContent = '🔍 No se encontraron estaciones para el filtro seleccionado';
            }
            return;
        }

        loading.style.display = 'none';
        noResults.style.display = 'none';
        container.style.display = 'block';

        this.populateProvinceFilter();
        this.updateStats(filteredData);

        const groupedData = this.groupByProvince(filteredData);
        
        container.innerHTML = '';

        // Ordenar provincias alfabéticamente con soporte para caracteres especiales
        const sortedProvinces = Object.keys(groupedData).sort((a, b) => 
            a.localeCompare(b, 'es', { sensitivity: 'base' })
        );

        sortedProvinces.forEach(province => {
            const stations = groupedData[province];
            const provinceSection = document.createElement('div');
            provinceSection.className = 'province-section';
            
            provinceSection.innerHTML = `
                <div class="province-header">
                    <h2 class="province-title">📍 ${province}</h2>
                    <span class="province-count">${stations.length} estaciones</span>
                </div>
                <div class="cards-grid">
                    ${stations.map(station => this.createWeatherCard(station)).join('')}
                </div>
            `;
            
            container.appendChild(provinceSection);
        });

        // Actualizar estadísticas después de renderizar
        this.updateStats();
    }

    updateStats() {
        const totalStations = this.weatherData ? this.weatherData.length : 0;
        const filteredData = this.filterData();
        const filteredStations = filteredData.length;
        const groupedData = this.groupByProvince(filteredData);
        const provincesShown = Object.keys(groupedData).length;
        
        document.getElementById('totalStations').textContent = totalStations;
        document.getElementById('filteredStations').textContent = filteredStations;
        document.getElementById('provincesShown').textContent = provincesShown;
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new WeatherVisualization();
});
