import { FlightRecord, CalculatedStats, AirportDB } from './types';
import { AIRCRAFT_GPH_DICTIONARY } from './AircraftGPH';

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
      .filter(t => {
        if (!airportDB[t]) return false;
        // Ignore purely alphabetical 3-letter strings in the route (e.g., OAK, LAX) as they are likely VORs.
        // Airports with numbers (e.g., 2W5) bypass this and are included.
        if (t.length === 3 && /^[A-Z]{3}$/.test(t)) return false;
        return true;
      });
      
    // Build a continuous sequence: Departure -> [Route Waypoints] -> Destination
    const rawLegs = [f.departure.toUpperCase(), ...validAirportsInRoute, f.destination.toUpperCase()];

    // Filter valid airports, resolve to their Primary ID (to handle lazy LAX -> KLAX), and remove consecutive duplicates
    const flightLegs: string[] = [];
    rawLegs.forEach(apt => {
      const dbEntry = airportDB[apt];
      if (dbEntry) {
        // dbEntry is now [lat, lon, primaryId]
        const primaryId = dbEntry[2] || apt; 
        if (flightLegs.length === 0 || flightLegs[flightLegs.length - 1] !== primaryId) {
          flightLegs.push(primaryId);
        }
      }
    });

    // Extract Map Data (Edges/Paths)
    for (let i = 0; i < flightLegs.length - 1; i++) {
      const startId = flightLegs[i];
      const endId = flightLegs[i + 1];
      const start = airportDB[startId];
      const end = airportDB[endId];
      
      if (start && end) {
        const edgeKey = `${startId}-${endId}`;
        if (!drawnEdges.has(edgeKey)) {
          drawnEdges.add(edgeKey);
          stats.mapData.edges.push([
            [start[1], start[0]], 
            [end[1], end[0]]
          ]);
        }
      }
    }

    // Add valid airports to the unique Set and calculate bounding box
    flightLegs.forEach(aptId => {
      airports.add(aptId);
      const coords = airportDB[aptId];
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