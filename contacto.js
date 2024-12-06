// Coordenadas del colegio
const colegioCoords = [3.7492, 8.7831]; // Cambiar por las coordenadas exactas de la ubicación del colegio

// Crear el mapa
const map = L.map('map').setView(colegioCoords, 15);

// Añadir la capa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Añadir un marcador para el colegio
L.marker(colegioCoords).addTo(map)
    .bindPopup('<b>Colegio Privado Ángel de la Guarda</b><br>Ubicación principal.')
    .openPopup();

// Calcular ruta al colegio
const calculateRoute = () => {
    const clientLocation = document.getElementById('clientLocation').value;

    if (!clientLocation) {
        alert('Por favor, introduce tu ubicación.');
        return;
    }

    // Usar Nominatim API para geocodificar la ubicación del usuario
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(clientLocation)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert('Ubicación no encontrada. Por favor, revisa los datos introducidos.');
                return;
            }

            const userCoords = [data[0].lat, data[0].lon];

            // Añadir marcador para la ubicación del usuario
            L.marker(userCoords).addTo(map)
                .bindPopup('Tu ubicación')
                .openPopup();

            // Ajustar el mapa para mostrar ambos puntos
            const bounds = L.latLngBounds([colegioCoords, userCoords]);
            map.fitBounds(bounds);

            // Trazar la ruta usando un servicio externo como OpenRouteService
            fetch(`https://routing.openstreetmap.de/routed-foot/route/v1/driving/${userCoords[1]},${userCoords[0]};${colegioCoords[1]},${colegioCoords[0]}?overview=full&geometries=geojson`)
                .then(response => response.json())
                .then(routeData => {
                    const routeCoords = routeData.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);

                    // Dibujar la ruta en el mapa
                    L.polyline(routeCoords, { color: 'blue' }).addTo(map);
                })
                .catch(err => console.error('Error calculando la ruta:', err));
        })
        .catch(err => console.error('Error geocodificando la ubicación:', err));
};

// Añadir evento al botón de calcular ruta
document.getElementById('calculateRoute').addEventListener('click', calculateRoute);
