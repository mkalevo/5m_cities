const map = new maplibregl.Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/0197d74e-f715-72fa-9160-665d33b2e8d3/style.json?key=HNtWstxKStKXJAw1NQRB',
      center: [0, 20], // global view
      zoom: 1.5,
      attributionControl: true
    });

    // Add zoom controls
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Example: Add a test marker
    /*
    map.on('load', () => {
      new maplibregl.Marker({ color: '#ff4e00' })
        .setLngLat([139.6917, 35.6895]) // Tokyo
        .setPopup(new maplibregl.Popup().setText("Tokyo — 37M people"))
        .addTo(map);
    }); */

    map.on('load', () => {
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
            'circle-radius': 7,
            'circle-color': '#fff', //#00FA9A#c391cf#d681d2 #DA70D6
            'circle-stroke-width': 1,
            'circle-stroke-color': '#444'
          }
        })

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