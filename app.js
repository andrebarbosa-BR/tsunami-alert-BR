
const alerta = document.getElementById('alerta');
const statusDiv = document.getElementById('status');

function verificarConexao() {
    if (navigator.onLine) {
        statusDiv.textContent = "🟢 Online";
        statusDiv.style.color = "green";
    } else {
        statusDiv.textContent = "🔴 Offline - conecte-se para atualizações";
        statusDiv.style.color = "red";
    }
}

window.addEventListener('online', verificarConexao);
window.addEventListener('offline', verificarConexao);
verificarConexao();

async function checarTerremotos() {
    try {
        const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson");
        const data = await res.json();
        for (let quake of data.features) {
            const mag = quake.properties.mag;
            const coords = quake.geometry.coordinates;
            const [lon, lat] = coords;
            const dist = calcularDistancia(lat, lon, -7.115, -34.863); // João Pessoa

            if (mag >= 7 && dist <= 3000) {
                alerta.style.display = "block";
                alerta.textContent = "⚠️ RISCO DE TSUNAMI! EVACUAR IMEDIATAMENTE!";
                tocarAlarme();
            }
        }
    } catch (e) {
        console.error("Erro ao buscar terremotos:", e);
    }
}

function calcularDistancia(lat1, lon1, lat2, lon2) {
    const toRad = deg => deg * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function tocarAlarme() {
    const audio = new Audio("alarme.mp3");
    audio.play();
}

setInterval(checarTerremotos, 60000); // a cada 60s
checarTerremotos();
