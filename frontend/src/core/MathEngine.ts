import { FlightRecord, CalculatedStats, AirportDB } from './types';

const AIRCRAFT_GPH_DICTIONARY: Record<string, number> = {
  // === SMALL: PISTON SINGLE & TWIN ===
  "C152": 6.0,   // Cessna 152
  "C172": 9.0,   // Cessna 172 Skyhawk
  "C182": 13.0,  // Cessna 182 Skylane
  "C206": 16.0,  // Cessna 206 Stationair
  "PA28": 10.0,  // Piper Cherokee/Archer
  "PA32": 15.0,  // Piper Saratoga
  "PA44": 20.0,  // Piper Seminole (Twin)
  "SR20": 11.0,  // Cirrus SR20
  "SR22": 14.5,  // Cirrus SR22
  "DA40": 9.0,   // Diamond DA40
  "DA42": 12.0,  // Diamond DA42 (Twin)
  "BE36": 15.0,  // Beechcraft Bonanza
  "BE58": 32.0,  // Beechcraft Baron (Twin)

  // === MEDIUM: TURBOPROPS & LIGHT/MID JETS ===
  "PC12": 65.0,  // Pilatus PC-12
  "C208": 45.0,  // Cessna Caravan
  "TBM9": 60.0,  // Daher TBM 900 series
  "BE20": 100.0, // Beechcraft King Air 200
  "B190": 160.0, // Beechcraft 1900D
  "SF50": 60.0,  // Cirrus Vision Jet
  "C25A": 120.0, // Cessna Citation CJ3
  "E55P": 183.0, // Embraer Phenom 300
  "CL60": 255.0, // Challenger 604
  "GL5T": 500.0, // Bombardier Global 5000/7500

  // === LARGE: COMMERCIAL AIRLINERS ===
  "E175": 450.0,  // Embraer E175
  "A320": 850.0,  // Airbus A320
  "A321": 950.0,  // Airbus A321
  "B738": 900.0,  // Boeing 737-800
  "B752": 1100.0, // Boeing 757-200
  "B763": 1600.0, // Boeing 767-300
  "B77W": 2500.0, // Boeing 777-300ER
  "B789": 1700.0, // Boeing 787-9 Dreamliner
  "A359": 1600.0, // Airbus A350-900 
  "B744": 3600.0, // Boeing 747-400
  "A388": 4600.0, // Airbus A380-800
};

export const calculateStats = (flights: FlightRecord[], airportDB: AirportDB): CalculatedStats => {
  const stats: CalculatedStats = {
    totalHours: 0,
    totalFlights: flights.length,
    homeBase: '',
    totalDistanceNm: 0,
    uniqueAircraftTypes: 0,
    uniqueTailNumbers: 0,
    shortestFlight: 9999,
    shortestFlightDate: '',
    shortestFlightRoute: '',
    longestFlight: 0,
    longestFlightRoute: '',
    longestFlightDate: '',
    totalLandings: 0,
    uniqueAirports: 0,
    totalNight: 0,
    totalIMC: 0,
    totalSimulated: 0,
    totalActualAndSim: 0,
    estimatedFuelBurn: 0,
    hasInternational: false,
    mapData: {
      nodes: [],
      edges: [],
      bounds: null,
      homeBaseCoords: null,
    }
  };

  const airports = new Set<string>();
  const drawnEdges = new Set<string>();
  let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
  const aircraftTypes = new Set<string>();
  const tailNumbers = new Set<string>();
  const departureCounts: Record<string, number> = {};

  flights.forEach(f => {
    stats.totalHours += f.totalTime;
    stats.totalLandings += f.landings;
    stats.totalNight += f.night;
    stats.totalIMC += f.instrument;
    stats.totalSimulated += f.simulated;
    
    // Parse the route to find any valid intermediate airports
    const routeTokens = f.route ? f.route.split(/[\s-]+/) : [];
    const validAirportsInRoute = routeTokens
      .map(t => t.toUpperCase())
      .filter(t => airportDB[t]);
      
    // Build a continuous sequence: Departure -> [Route Waypoints] -> Destination
    const rawLegs = [f.departure.toUpperCase(), ...validAirportsInRoute, f.destination.toUpperCase()];

    // Filter valid airports and remove consecutive duplicates 
    // (e.g., if departure was KVKX and route started with KVKX, don't repeat it)
    const flightLegs: string[] = [];
    rawLegs.forEach(apt => {
      if (airportDB[apt]) {
        if (flightLegs.length === 0 || flightLegs[flightLegs.length - 1] !== apt) {
          flightLegs.push(apt);
        }
      }
    });

    // Extract Map Data (Edges/Paths)
    for (let i = 0; i < flightLegs.length - 1; i++) {
      const start = airportDB[flightLegs[i]];
      const end = airportDB[flightLegs[i + 1]];
      if (start && end) {
        const edgeKey = `${flightLegs[i]}-${flightLegs[i+1]}`;
        if (!drawnEdges.has(edgeKey)) {
          drawnEdges.add(edgeKey);
          // Mapbox uses [longitude, latitude]
          stats.mapData.edges.push([
            [start[1], start[0]], 
            [end[1], end[0]]
          ]);
        }
      }
    }

    // Add valid airports to the unique Set and calculate bounding box
    flightLegs.forEach(apt => {
      airports.add(apt);
      const coords = airportDB[apt];
      if (coords) {
        const [lat, lon] = coords;
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
      }
    });

    // Only check departure and destination to prevent VORs in the route (like HCM) 
    // from triggering false-positive international flags.
    [f.departure, f.destination].forEach(apt => {
      const coords = airportDB[apt.toUpperCase()];
      if (coords) {
        const [lat, lon] = coords;
        // Rough CONUS bounding box: Lat 24.3 to 49.4, Lon -125.0 to -66.9
        const isConus = lat >= 24.3 && lat <= 49.4 && lon >= -125.0 && lon <= -66.9;
        if (!isConus) {
          stats.hasInternational = true;
        }
      }
    });

    // Trust the distance logged in the CSV
    const flightDist = f.distance;
    stats.totalDistanceNm += flightDist;

    // Extremes
    if (f.totalTime < stats.shortestFlight && f.totalTime > 0) {
      stats.shortestFlight = f.totalTime;
      stats.shortestFlightDate = f.date;
      stats.shortestFlightRoute = `${f.departure} to ${f.destination}`;
    }
    
    if (flightDist > stats.longestFlight) {
      stats.longestFlight = flightDist;
      stats.longestFlightDate = f.date;
      stats.longestFlightRoute = `${f.departure} to ${f.destination}`;
    }

    // Uniques
    aircraftTypes.add(f.aircraftType);
    tailNumbers.add(f.aircraftId);

    // Home Base calculation (using first leg or departure)
    const dep = flightLegs.length > 0 ? flightLegs[0] : f.departure;
    departureCounts[dep] = (departureCounts[dep] || 0) + 1;

    // Fuel Burn calculation
    let gph = AIRCRAFT_GPH_DICTIONARY[f.aircraftType.toUpperCase()];
    if (!gph) {
      gph = 10; // The safe 10gal/hr GA estimate fallback
    }
    stats.estimatedFuelBurn += (f.totalTime * gph);
  });

  stats.uniqueAirports = airports.size;
  stats.uniqueAircraftTypes = aircraftTypes.size;
  stats.uniqueTailNumbers = tailNumbers.size;
  
  // Find Home Base (most frequent departure)
  stats.homeBase = Object.keys(departureCounts).reduce((a, b) => 
    departureCounts[a] > departureCounts[b] ? a : b
  , "Unknown");

  // Save the coordinates for the map
  if (stats.homeBase !== "Unknown" && airportDB[stats.homeBase]) {
    const coords = airportDB[stats.homeBase];
    stats.mapData.homeBaseCoords = [coords[1], coords[0]]; // [lon, lat]
  }

  // Finalize Map Data Nodes
  airports.forEach(apt => {
    const coords = airportDB[apt];
    if (coords) {
      stats.mapData.nodes.push([coords[1], coords[0]]); // [lon, lat]
    }
  });

  if (stats.mapData.nodes.length > 0) {
    stats.mapData.bounds = [minLon, minLat, maxLon, maxLat];
  }

  // Fix shortest flight init value if no flights
  if (stats.shortestFlight === 9999) stats.shortestFlight = 0;

  // --- ADD THIS ROUNDING BLOCK ---
  // Clean up JavaScript floating point artifacts (round to nearest tenth)
  stats.totalHours = Number(stats.totalHours.toFixed(1));
  stats.totalNight = Number(stats.totalNight.toFixed(1));
  stats.totalIMC = Number(stats.totalIMC.toFixed(1));
  stats.totalSimulated = Number(stats.totalSimulated.toFixed(1));
  stats.totalActualAndSim = Number((stats.totalIMC + stats.totalSimulated).toFixed(1));
  stats.estimatedFuelBurn = Number(stats.estimatedFuelBurn.toFixed(1));
  stats.totalDistanceNm = Number(stats.totalDistanceNm.toFixed(0)); // Whole numbers for distance
  stats.shortestFlight = Number(stats.shortestFlight.toFixed(1));
  stats.longestFlight = Number(stats.longestFlight.toFixed(0));

  return stats;
};