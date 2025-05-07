const alerta = document.getElementById('alerta');
const statusDiv = document.getElementById('status');

// Coordenadas de João Pessoa
const latJP = -7.115;
const lonJP = -34.863;

// Verificar conexão com a internet
function verificarConexao() {
    if (navigator.onLine) {
        statusDiv.textContent = "🟢 Online";
        statusDiv.style.color = "green";
        checarTerremotos();
    } else {
        statusDiv.textContent = "🔴 Offline - conecte-se para atualizações";
        statusDiv.style.color = "red";
    }
}

// Calcular a distância entre dois pontos geográficos (em km)
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const toRad = deg => deg * Math.PI / 180;
    const R = 6371; // Raio da Terra em km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))); // Distância em km
}

// Função para checar terremotos
async function checarTerremotos() {
    try {
        const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson");
        const data = await res.json();
        for (let quake of data.features) {
            const mag = quake.properties.mag;
            const coords = quake.geometry.coordinates;
            const [lon, lat] = coords;

            const dist = calcularDistancia(lat, lon, latJP, lonJP);

            if (mag >= 7 && dist <= 3000) { // Magnitude maior que 7 e dentro de 3000 km de João Pessoa
                alerta.style.display = "block";
                alerta.textContent = "⚠️ RISCO DE TSUNAMI! EVACUAR IMEDIATAMENTE!";
                tocarAlarme();
                enviarNotificacao();
            }
        }
    } catch (e) {
        console.error("Erro ao buscar terremotos:", e);
    }
}

// Função para tocar alarme
function tocarAlarme() {
    const audio = new Audio("alarme.mp3");
    audio.play();
}

// Função para enviar notificação
function enviarNotificacao() {
    if (Notification.permission === "granted") {
        new Notification("Alerta de Tsunami: Evacuação Imediata Requerida!");
    }
}

// Solicitar permissão para notificações
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Verificar conexão periodicamente
window.addEventListener('online', verificarConexao);
window.addEventListener('offline', verificarConexao);
verificarConexao();
