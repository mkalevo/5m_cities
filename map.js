const bounds = [
  [-179, -80],
  [179, 80]
];

const map = new maplibregl.Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/0197d74e-f715-72fa-9160-665d33b2e8d3/style.json?key=HNtWstxKStKXJAw1NQRB',
      center: [0, 20], // global view
      zoom: 1.5,
      minZoom: 0.3,
      maxZoom: 5,
      projection: 'globe',
      maxBounds: bounds,
      attributionControl: true
});

let currentProjection = 'globe';

const toggleBtn = document.getElementById('toggleProjectionBtn');
toggleBtn.textContent = '🗺️'

toggleBtn.addEventListener('click', () => {
  if (currentProjection === 'globe') {
    map.setProjection('mercator');
    toggleBtn.textContent = '🌐'; // or "2D"
    toggleBtn.title = 'Switch to Globe';
    currentProjection = 'mercator';
  } else {
    map.setProjection({ type: 'globe' });
    toggleBtn.textContent = '🗺️'; // or "3D"
    toggleBtn.title = 'Switch to Mercator';
    currentProjection = 'globe';
  }
});

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

map.on('load', () => {

  map.setProjection({
            type: 'globe', // Set projection to globe
        });
  fetch('./data/5_m_cities.geojson')
  .then(response => response.json())
  .then(data => {
    
    map.addSource('cities',{ 
      type: 'geojson',
      data: data
    })
    
    map.addLayer({
      id: 'cities-layer',
      type: 'circle',
      source: 'cities',
      paint: {
        'circle-radius': 8,
        'circle-color': '#28a44d', //#ff3838
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff'
      }
    })

    // 2. Labels (symbols) — notice different ID and type
    map.addLayer({
      id: 'city-labels',
      type: 'symbol',
      source: 'cities',
      layout: {
        'text-field': ['get', 'city'],
        'text-font': ['Open Sans Regular'],
        'text-size': 16,
        'text-offset': [0, -2],
        'text-anchor': 'top'
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#28a44d',
        'text-halo-width': 1
      },
      minzoom: 2
    });

    map.on('click', 'cities-layer', (e) => {
      const coords = e.features[0].geometry.coordinates.slice()
      const name = e.features[0].properties.city

      new maplibregl.Popup()
      .setLngLat(coords)
      .setHTML(`<p>${name}</p>`)
      .addTo(map)
    })



  })
})