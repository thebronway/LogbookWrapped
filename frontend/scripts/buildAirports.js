import fs from 'fs';

const CSV_URL = 'https://davidmegginson.github.io/ourairports-data/airports.csv';
const OUTPUT_PATH = './public/airports-min.json';

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

    // Filter to only include US and US Territories (PR, VI, GU, AS, MP)
    // This prevents route VORs (like HCM) from colliding with global airport codes
    const allowedCountries = ['US', 'PR', 'VI', 'GU', 'AS', 'MP']; 
    if (!allowedCountries.includes(cols[8])) continue;

    const lat = parseFloat(cols[4]);
    const lon = parseFloat(cols[5]);
    if (isNaN(lat) || isNaN(lon)) continue;

    const primaryId = cols[1].toUpperCase();
    if (cols[1]) airports[primaryId] = [lat, lon, primaryId];
    // Map ICAO, IATA, GPS, and Local Codes so we capture every alias (like LAX and 2W5)
    if (cols[12]) airports[cols[12].toUpperCase()] = [lat, lon, primaryId]; // icao_code
    if (cols[13]) airports[cols[13].toUpperCase()] = [lat, lon, primaryId]; // iata_code
    if (cols[14]) airports[cols[14].toUpperCase()] = [lat, lon, primaryId]; // gps_code
    if (cols[15]) airports[cols[15].toUpperCase()] = [lat, lon, primaryId]; // local_code (Where 2W5 lives!)
  }

  delete airports[''];
  
  if (!fs.existsSync('./public')) fs.mkdirSync('./public');
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(airports));
  console.log('[Frontend Build] ✅ airports-min.json generated successfully!');
}

build();