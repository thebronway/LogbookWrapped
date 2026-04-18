import fs from 'fs';

const CSV_URL = 'https://davidmegginson.github.io/ourairports-data/airports.csv';
const OUTPUT_PATH = './public/data/airports-min.json';

async function build() {
  console.log('[Frontend Build] Downloading airport data...');
  const res = await fetch(CSV_URL);
  const text = await res.text();

  const airports = {};
  const lines = text.split('\n');
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    
    // Parse CSV line cleanly without external libraries
    const cols = [];
    let inQuotes = false;
    let col = '';
    for (const char of line) {
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) { cols.push(col); col = ''; }
        else col += char;
    }
    cols.push(col);

    if (cols[2] === 'closed') continue;

    const allowedCountries = [
      // US & Territories
      'US', 'PR', 'VI', 'GU', 'AS', 'MP',
      // Canada & Mexico
      'CA', 'MX',
      // Caribbean Nations & Territories
      'BS', 'CU', 'JM', 'HT', 'DO', 'KY', 'AG', 'BB', 'DM', 'GD', 
      'KN', 'LC', 'VC', 'TT', 'VG', 'TC', 'AI', 'MS', 'BL', 'MF', 
      'SX', 'AW', 'CW', 'BQ', 'BM'
    ];
    if (!allowedCountries.includes(cols[8])) continue;

    const lat = parseFloat(cols[4]);
    const lon = parseFloat(cols[5]);
    if (isNaN(lat) || isNaN(lon)) continue;

    const primaryId = cols[1].toUpperCase();
    // Region is in cols[9] (e.g., "US-CA"). We'll split it to just grab "CA".
    const state = cols[9] ? (cols[9].includes('-') ? cols[9].split('-')[1] : cols[9]) : 'Unknown';
    
    if (cols[1]) airports[primaryId] = [lat, lon, primaryId, state];
    // Map ICAO, IATA, GPS, and Local Codes so we capture every alias (like LAX and 2W5)
    if (cols[12]) airports[cols[12].toUpperCase()] = [lat, lon, primaryId, state]; // icao_code
    if (cols[13]) airports[cols[13].toUpperCase()] = [lat, lon, primaryId, state]; // iata_code
    if (cols[14]) airports[cols[14].toUpperCase()] = [lat, lon, primaryId, state]; // gps_code
    if (cols[15]) airports[cols[15].toUpperCase()] = [lat, lon, primaryId, state]; // local_code
  }

  delete airports[''];
  
  if (!fs.existsSync('./public/data')) fs.mkdirSync('./public/data', { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(airports));
  console.log('[Frontend Build] ✅ airports-min.json generated successfully!');
}

build();