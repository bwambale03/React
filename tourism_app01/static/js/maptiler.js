// MapTiler initialization with MapLibre
document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || !window.maplibregl) return;

    // Initialize map (no accessToken, key is in style URL)
    const map = new maplibregl.Map({
        container: 'map',
        style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=sqGSCVciyOvzi1k9K6g9',
        center: [parseFloat(mapContainer.dataset.lon) || 0, parseFloat(mapContainer.dataset.lat) || 0],
        zoom: 10
    });

    // Add navigation control
    map.addControl(new maplibregl.NavigationControl());

    // Add marker from dataset coordinates
    const lon = parseFloat(mapContainer.dataset.lon);
    const lat = parseFloat(mapContainer.dataset.lat);
    if (!isNaN(lon) && !isNaN(lat)) {
        map.setCenter([lon, lat]);
        new maplibregl.Marker().setLngLat([lon, lat]).addTo(map);
    } else {
        console.warn('Invalid coordinates for MapTiler');
    }
});
