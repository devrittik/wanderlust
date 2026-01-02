const coords = JSON.parse(
  document.getElementById("map").dataset.coords
);

const map = L.map("map").setView([coords[1], coords[0]], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

const wanderlustIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <svg width="40" height="55" viewBox="0 0 24 24" fill="#fe424d" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5" fill="white"/>
    </svg>
  `,
  iconSize: [40, 55],      
  iconAnchor: [20, 55],    
  popupAnchor: [0, -45],   
});

L.marker([coords[1], coords[0]], { icon: wanderlustIcon })
  .addTo(map)
  .bindPopup("<b>Where you'll stay ❤️</b>");
