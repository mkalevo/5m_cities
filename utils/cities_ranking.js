function createSortableCityTable(geojson) {
  const container = document.getElementById('cities_table');
  const cities = geojson.features.map(f => {
    const p = f.properties;
    return {
        rank: p.rank,
      city: p.city,
      country: p.country,
      cca2: p.cca2,
      population: Number(p.pop2025),
      growthRate: parseFloat(p.growthRate),
      growthAmount: Number(p.pop2025) - Number(p.pop2024)
    };
  });

  let sortKey = 'population';
  let sortAsc = false;

  function renderTable() {
    const sorted = [...cities].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      return sortAsc ? valA - valB : valB - valA;
    });

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.innerHTML = `
      <thead>
        <tr>
          <th>#</th>
          <th>City</th>
          <th class="sortable" data-key="population"><span class="sort-icon">⬍</span>Population</th>
          <th class="sortable" data-key="growthRate"><span class="sort-icon">⬍</span>%</th>
          <th class="sortable" data-key="growthAmount"><span class="sort-icon">⬍</span>Growth</th>
        </tr>
      </thead>
    `;

    const tbody = document.createElement('tbody');
    sorted.forEach(city => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${city.rank}</td>
        <td><span title="${city.country}">${getFlagEmoji(city.cca2)} ${city.city}</span></td>
        <td>${city.population.toLocaleString()}</td>
        <td style="color:${city.growthRate > 0 ? 'green' : 'red'}">
          <span id="growthIcon">${city.growthRate > 0 ? '🔼' : '🔽'} </span>${(city.growthRate * 100).toFixed(2)}%
        </td>
        <td>${city.growthAmount.toLocaleString()}</td>
      `;
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.innerHTML = '';
    container.appendChild(table);

    // Add click listeners
    table.querySelectorAll('.sortable').forEach(th => {
      th.style.cursor = 'pointer';
      th.title = 'Click to sort';
      th.onclick = () => {
        const key = th.dataset.key;
        if (sortKey === key) {
          sortAsc = !sortAsc;
        } else {
          sortKey = key;
          sortAsc = false;
        }
        renderTable();
      };
    });
  }

  renderTable();
}

// Helper to get flag emoji
function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '';
  return countryCode.toUpperCase().replace(/./g, c =>
    String.fromCodePoint(127397 + c.charCodeAt())
  );
}

// Load data
fetch('./data/5_m_cities.geojson')
  .then(res => res.json())
  .then(data => {
    createSortableCityTable(data);
  });
