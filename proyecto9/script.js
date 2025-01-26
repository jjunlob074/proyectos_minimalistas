const outputDiv = document.getElementById("output");
const mapDiv = document.getElementById("map");

const map = L.map("map").setView([0, 0], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

let marker;

// Función para obtener detalles de IP
async function fetchIPData(ip) {
  try {
    outputDiv.innerHTML = "<p class='loading'>Consultando detalles...</p>";
    const response = await fetch(`https://api.ipquery.io/${ip}`);
    const data = await response.json();
    const {
      ip: ipAddress,
      location: { latitude, longitude, city, state, country },
    } = data;

    outputDiv.innerHTML = `
      <p><strong>IP:</strong> ${ipAddress}</p>
      <p><strong>Ubicación:</strong> ${city}, ${state}, ${country}</p>
      <p><strong>Latitud:</strong> ${latitude.toFixed(2)}</p>
      <p><strong>Longitud:</strong> ${longitude.toFixed(2)}</p>
    `;

    if (marker) map.removeLayer(marker);
    marker = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`<strong>${city}, ${state}</strong>`)
      .openPopup();
    map.setView([latitude, longitude], 13);
  } catch (error) {
    outputDiv.innerHTML = `<p class='highlight'>Error: ${error.message}</p>`;
  }
}

// Función para consultar una IP personalizada
function fetchIPDetails() {
  const ip = document.getElementById("ipInput").value.trim();
  if (!ip) {
    outputDiv.innerHTML = "<p class='highlight'>Por favor, ingrese una IP.</p>";
    return;
  }
  fetchIPData(ip);
}

// Función para obtener tu IP actual
async function fetchMyIP() {
  try {
    outputDiv.innerHTML = "<p class='loading'>Consultando tu IP...</p>";
    const response = await fetch("https://api.ipquery.io/");
    const ip = await response.text();
    fetchIPData(ip);
  } catch (error) {
    outputDiv.innerHTML = `<p class='highlight'>Error: ${error.message}</p>`;
  }
}

// Evento para realizar la consulta al presionar Enter
document.getElementById("ipInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") fetchIPDetails();
});
