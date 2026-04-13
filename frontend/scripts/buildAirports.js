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

    const lat = parseFloat(cols[4]);
    const lon = parseFloat(cols[5]);
    if (isNaN(lat) || isNaN(lon)) continue;

    if (cols[1]) airports[cols[1].toUpperCase()] = [lat, lon];
    if (cols[13]) airports[cols[13].toUpperCase()] = [lat, lon];
    if (cols[14]) airports[cols[14].toUpperCase()] = [lat, lon];
  }

  delete airports[''];
  
  if (!fs.existsSync('./public')) fs.mkdirSync('./public');
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(airports));
  console.log('[Frontend Build] ✅ airports-min.json generated successfully!');
}

build();