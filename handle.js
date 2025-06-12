const modebtn = document.querySelector('.mode');
let body = document.querySelector("body");
let crrmode = "light-mode";


modebtn.style.backgroundImage = "url('moon-solid.svg')";

modebtn.addEventListener("click", () => {
  if(crrmode == "light-mode") {
    crrmode = "dark-mode";
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
    modebtn.style.backgroundImage = "url('brightness.png')";
    // map.removeLayer(crrlayer);
    // crrlayer = dark_mode;
    // map.addLayer(crrlayer);
    
  } else {
    crrmode = "light-mode";
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    modebtn.style.backgroundImage = "url('moon-solid.svg')";
    // map.removeLayer(crrlayer);
    // crrlayer = light_mode;
    // map.addLayer(crrlayer);
  }
})





const light_mode = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 2,
    noWrap: true,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

const dark_mode = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 2,
	maxZoom: 19,
  noWrap: true,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    minZoom: 2,
    noWrap: true,
    attribution: 'Tiles &copy; Esri'
});

const map = L.map('map', { worldCopyJump: false,
  maxBoundsViscosity: 1.0,
  layers: [light_mode],
  minZoom: 2,
  maxBounds: [
    [-90, -180], 
    [90, 180]    
  ]});//.setView([28.6139, 77.2088], 10);
  map.fitWorld();

  const baseLayers = {
  "Light": light_mode,
  "Dark": dark_mode,
  "Satellite": satellite
};

L.control.layers(baseLayers).addTo(map);


const marker = L.marker([28.6139, 77.2088]);
marker.addTo(map);
let crrlayer = light_mode;


