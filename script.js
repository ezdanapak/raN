// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Define the line coordinates
const lineCoordinates = [
    [51.505, -0.09],
    [51.51, -0.1],
    [51.52, -0.12],
    [51.53, -0.14],
];

// Draw the line on the map
const line = L.polyline(lineCoordinates, { color: 'blue' }).addTo(map);
map.fitBounds(line.getBounds());

// Create custom Lottie markers
function createLottieMarker(animationPath) {
    const div = L.DomUtil.create('div', 'lottie-marker');
    lottie.loadAnimation({
        container: div, // Element to attach the animation
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: animationPath, // Path to the Lottie JSON file
    });
    return div;
}

// Add markers for the boy and girl
const boyMarker = L.divIcon({ html: createLottieMarker('dancing-boy.json') });
const girlMarker = L.divIcon({ html: createLottieMarker('dancing-girl.json') });

const boy = L.marker(lineCoordinates[0], { icon: boyMarker }).addTo(map);
const girl = L.marker(lineCoordinates[0], { icon: girlMarker }).addTo(map);

// Animate markers along the line
let progress = 0;
const step = 0.002; // Adjust speed

function animateMarkers() {
    progress += step;
    if (progress > 1) progress = 0; // Restart animation

    const boyPosition = interpolate(lineCoordinates, progress);
    const girlPosition = interpolate(lineCoordinates, 1 - progress);

    boy.setLatLng(boyPosition);
    girl.setLatLng(girlPosition);

    requestAnimationFrame(animateMarkers);
}

function interpolate(coords, t) {
    let i = 0;
    while (i < coords.length - 1 && t > (i + 1) / (coords.length - 1)) i++;

    const start = coords[i];
    const end = coords[i + 1];
    const segmentT = (t - i / (coords.length - 1)) * (coords.length - 1);

    return [
        start[0] + (end[0] - start[0]) * segmentT,
        start[1] + (end[1] - start[1]) * segmentT,
    ];
}

animateMarkers();
