const modebtn = document.getElementById("modeToggle");
const modeIcon = document.getElementById("modeIcon");
let body = document.body;
let crrmode = "light-mode";

const savedTheme = localStorage.getItem("theme");

function applyTheme(mode) {
  if (mode === "dark-mode") {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    modeIcon.classList.remove("bi-moon");
    modeIcon.classList.add("bi-brightness-high");
  } else {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    modeIcon.classList.remove("bi-brightness-high");
    modeIcon.classList.add("bi-moon");
  }
}

if (savedTheme === "dark-mode") {
  crrmode = "dark-mode";
} else {
  crrmode = "light-mode";
}
applyTheme(crrmode);

modebtn.addEventListener("click", () => {
  crrmode = crrmode === "light-mode" ? "dark-mode" : "light-mode";
  applyTheme(crrmode);
  localStorage.setItem("theme", crrmode);
});

const light_mode = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    minZoom: 2,
    noWrap: true,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }
);

const dark_mode = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}",
  {
    minZoom: 2,
    maxZoom: 19,
    noWrap: true,
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: "png",
  }
);

const satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19,
    minZoom: 2,
    noWrap: true,
    attribution: "Tiles &copy; Esri",
  }
);

const savedTile = localStorage.getItem("tile");
let initialLayer = light_mode; // default

if (savedTile === "dark") {
  initialLayer = dark_mode;
} else if (savedTile === "satellite") {
  initialLayer = satellite;
}

const map = L.map("map", {
  worldCopyJump: false,
  maxBoundsViscosity: 1.0,
  layers: [initialLayer],
  minZoom: 2,
  maxBounds: [
    [-90, -180],
    [90, 180],
  ],
});
map.fitWorld();

const baseLayers = {
  Light: light_mode,
  Dark: dark_mode,
  Satellite: satellite,
};

L.control.layers(baseLayers).addTo(map);

map.on("baselayerchange", function (e) {
  if (e.name === "Light") localStorage.setItem("tile", "light");
  else if (e.name === "Dark") localStorage.setItem("tile", "dark");
  else if (e.name === "Satellite") localStorage.setItem("tile", "satellite");
});

let quakes = [];
try {
  const raw = document.getElementById("quake-data").textContent;
  quakes = JSON.parse(raw);
} catch (err) {
  console.error("Error parsing quake data:", err);
}

const getColor = (mag) => {
  if (mag >= 5) return "red";
  if (mag >= 3) return "orange";
  if (mag >= 1) return "yellow";
  return "green";
};

const quakeMarker = {};
quakes.forEach((quake, index) => {
  if (quake.latitude && quake.longitude) {
    const marker = L.circleMarker([quake.latitude, quake.longitude], {
      radius: 5,
      color: getColor(quake.magnitude),
      fillColor: getColor(quake.magnitude),
      fillOpacity: 0.5,
      weight: 1,
    })
      .addTo(map)
      .bindPopup(
        `<b>${quake.location}</b><br>Magnitude: ${quake.magnitude}<br>${quake.time}`
      );
    quakeMarker[index] = marker;
  } else {
    console.log("Skipped (no coords):", quake);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const tableRows = document.querySelectorAll(".quake-row");

  tableRows.forEach((row) => {
    row.addEventListener("click", () => {
      const index = row.getAttribute("data-index");
      const marker = quakeMarker[Number(index)];
      if (marker) {
        map.flyTo(marker.getLatLng(), 8);
        setTimeout(() => {
          marker.openPopup();
        }, 300);
      }
    });
  });
});

function filterQuakes() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll(".quake-row");
  let matchcount = 0;

  rows.forEach((row) => {
    const location = row.children[0].textContent.toLowerCase();
    if (location.includes(input)) {
      row.style.display = "";
      matchcount++;
    } else {
      row.style.display = "none";
    }
  });

  const noRes = document.getElementById("noresults");
  if (matchcount == 0) {
    noRes.style.display = "block";
  } else {
    noRes.style.display = "none";
  }
}

function clearSearch() {
  document.getElementById("searchInput").value = "";
  filterQuakes();
}
