const bounds = [
  [-179, -80],
  [179, 80]
];

const map = new maplibregl.Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/0197d74e-f715-72fa-9160-665d33b2e8d3/style.json?key=HNtWstxKStKXJAw1NQRB',
      center: [0, 20], // global view
      zoom: 1.5,
      minZoom: 1.5,
      maxZoom: 8,
      projection: 'globe',
      maxBounds: bounds,
      attributionControl: true
});

function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '';
  return countryCode.toUpperCase().replace(/./g, char =>
    String.fromCodePoint(char.charCodeAt() + 127397)
  );
}

let currentProjection = 'globe';

const toggleBtn = document.getElementById('toggleProjectionBtn');
toggleBtn.textContent = '🗺️'

toggleBtn.addEventListener('click', () => {
  if (currentProjection === 'globe') {
    map.setProjection('mercator');
    map.setMinZoom(0.5)
    toggleBtn.textContent = '🌐'; // or "2D"
    toggleBtn.title = 'Switch to Globe';
    currentProjection = 'mercator';
  } else {
    map.setProjection({ type: 'globe' });
    toggleBtn.textContent = '🗺️'; // or "3D"
    toggleBtn.title = 'Switch to Mercator';
    currentProjection = 'globe';
    map.setMinZoom(1.5)
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
    
    // 1. Markers
    map.addLayer({
      id: 'cities-layer',
      type: 'circle',
      source: 'cities',
      paint: {
        'circle-radius': 8,
        'circle-color': [
          'interpolate',
          ['linear'],
          ['to-number', ['get', 'growthRate']],
          -0.02, '#b30000',   // strong red
          -0.01, '#d73030',   // mid red
          -0.001, '#943636',  // soft red
          0.000, '#2f4f4f',  // flat = match map color (fade out)
          0.001, '#3a8157',  // soft green
          0.01, '#45b565',   // mid green
          0.05, '#00ff88'    // strong green
        ],
        //'circle-color': '#2176ff', //#ff3838 #28a44d
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
        'text-size': 18,
        'text-offset': [0, -2],
        'text-anchor': 'top'
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': [
          'interpolate',
          ['linear'],
          ['to-number', ['get', 'growthRate']],
          -0.02, '#b30000',   // strong red
          -0.01, '#d73030',   // mid red
          -0.001, '#943636',  // soft red
          0.000, '#2f4f4f',  // flat = match map color (fade out)
          0.001, '#3a8157',  // soft green
          0.01, '#45b565',   // mid green
          0.05, '#00ff88'    // strong green
        ],
        //'text-halo-color': '#2176ff',
        'text-halo-width': 0.5
      },
      minzoom: 2
    });

    map.on('click', 'cities-layer', (e) => {
      const feature = e.features[0];
      const props = feature.properties;
      const coords = e.features[0].geometry.coordinates.slice()

       // Fly to city
      map.flyTo({ center: coords, speed: 0.5 });


      //poppup thigns
      const city = props.city;
      const country = props.country;
      const flag = getFlagEmoji(props.cca2);
      const pop2024 = Number(props.pop2024).toLocaleString();
      const pop2025 = Number(props.pop2025).toLocaleString();
      const growth = (parseFloat(props.growthRate) * 100).toFixed(2);
      const rank = props.rank

      const growthText = growth > 0 ? `🔼 ${growth}%` : `🔽 ${Math.abs(growth)}%`;
      const growthColor = growth > 0 ? 'green' : 'red';

      const growthAmount = Number(props.pop2025 - props.pop2024).toLocaleString();

      popupHTML = `
    <div style="font-family: sans-serif; min-width: 200px;">
      <h3 style="margin: 0 0 5px; font-size: 18px;">${city} <span style='font-weight: 500; color: gris; font-size: 1.rem'>#${rank}</span></h3>
      <p style="margin: 0 0 4px;">
        <strong>${flag} ${country}</strong>
      </p>
      <p style="margin: 0 0 4px;">
        <span style='background-color:rgb(47, 79, 79,0.3); padding:2px; border-radius:2px;'><strong>Population 2025:</strong> ${pop2025}</span><br />
        <strong>Population 2024:</strong> ${pop2024}<br />
        <strong>Growth:</strong> <span style="color:${growthColor}">${growthText}</span> (${growthAmount})
      </p>
    </div>
  `;

      new maplibregl.Popup()
      .setLngLat(coords)
      .setHTML(popupHTML)
      .addTo(map)
    })



  })
})