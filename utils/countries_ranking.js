function generateCountryRanking(geojson) {
  const counts = {};

  geojson.features.forEach((feature) => {
    const country = feature.properties.country;
    if (!counts[country]) counts[country] = 0;
    counts[country]++;
  });

  // Convert to sorted array
  const ranking = Object.entries(counts)
    .sort((a, b) => b[1] - a[1]) // Descending
    .map(([country, count], i) => ({ rank: i + 1, country, count }));

  return ranking;
}


fetch('./data/5_m_cities.geojson')
  .then(res => res.json())
  .then(data => {
    const ranking = generateCountryRanking(data);
    const container = document.getElementById('countries_ranking_list');

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const header = `
      <thead>
        <tr>
          <th>#</th>
          <th>Country</th>
          <th>Cities</th>
        </tr>
      </thead>
    `;
    table.innerHTML = header;

    const tbody = document.createElement('tbody');
    ranking.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.rank}</td>
        <td>${entry.country}</td>
        <td>${entry.count}</td>
      `;
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  });