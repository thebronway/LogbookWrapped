import { FlightRecord, CalculatedStats, AirportDB } from './types';
import { AIRCRAFT_PROFILES } from './AircraftProfiles';

// Haversine formula to calculate Great Circle distance in Nautical Miles
const getDistanceNm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3440.065; // Radius of Earth in NM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
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
    mostUsedAirframe: 'Unknown',
    favoriteRoute: 'None',
    favoriteRouteCount: 0,
    mostVisitedState: 'Unknown',
    mostVisitedStateCount: 0,
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
  const aircraftTypeCounts: Record<string, number> = {};
  const routeCounts: Record<string, number> = {};
  const stateCounts: Record<string, number> = {};

  flights.forEach(f => {
    stats.totalHours += f.totalTime;
    stats.totalLandings += f.landings;
    stats.totalNight += f.night;
    stats.totalIMC += f.instrument;
    stats.totalSimulated += f.simulated;

    // 1. Get Aircraft Profile (with safe 120kt / 10gph fallback for Unknown Aircraft)
    const profile = AIRCRAFT_PROFILES[f.aircraftType.toUpperCase()] || { gph: 10, speed: 120 };
    
    // 2. Define the Plausibility Envelope (2.0x buffer)
    // If flight time is 0 (e.g., sim session or mistake), grant a massive budget so we don't drop the route
    const maxFlightDistance = f.totalTime > 0 ? (f.totalTime * profile.speed * 2.0) : 99999;

    // 3. Setup Shorthand Blocklist
    const ignoredTokens = new Set(['DCT', 'DIR', 'GPS', 'RNAV', 'ILS', 'LOC', 'VOR', 'NDB', 'VFR', 'IFR', 'VECT', 'VTF', 'RADAR']);

    const routeTokens = f.route ? f.route.split(/[\s-]+/) : [];
    const validWaypoints = routeTokens
      .map(t => t.toUpperCase())
      .filter(t => !ignoredTokens.has(t) && airportDB[t]);

    // 4. Construct Flight Legs & Calculate Distance
    const depEntry = airportDB[f.departure.toUpperCase()];
    const destEntry = airportDB[f.destination.toUpperCase()];
    
    const flightLegs: string[] = [];
    let calculatedDistance = 0;
    
    if (depEntry) flightLegs.push(depEntry[2] || f.departure.toUpperCase());
    
    let currentLat = depEntry ? depEntry[0] : null;
    let currentLon = depEntry ? depEntry[1] : null;

    validWaypoints.forEach(wpt => {
      const dbEntry = airportDB[wpt];
      if (dbEntry && currentLat !== null && currentLon !== null && destEntry) {
        // Test: If we route through this waypoint to the destination, does it blow our 2.0x distance budget?
        const distToWpt = getDistanceNm(currentLat, currentLon, dbEntry[0], dbEntry[1]);
        const distFromWptToDest = getDistanceNm(dbEntry[0], dbEntry[1], destEntry[0], destEntry[1]);
        
        if ((calculatedDistance + distToWpt + distFromWptToDest) <= maxFlightDistance) {
          // Plausible! Keep it.
          const primaryId = dbEntry[2] || wpt;
          if (flightLegs[flightLegs.length - 1] !== primaryId) {
            flightLegs.push(primaryId);
            calculatedDistance += distToWpt;
            currentLat = dbEntry[0];
            currentLon = dbEntry[1];
          }
        }
      }
    });

    // Add Destination
    if (destEntry) {
      const destId = destEntry[2] || f.destination.toUpperCase();
      if (flightLegs[flightLegs.length - 1] !== destId) {
        flightLegs.push(destId);
        if (currentLat !== null && currentLon !== null) {
          calculatedDistance += getDistanceNm(currentLat, currentLon, destEntry[0], destEntry[1]);
        }
      }
    }

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
      const dbEntry = airportDB[aptId];
      if (dbEntry) {
        const [lat, lon, , state] = dbEntry;
        if (state && state !== 'Unknown') {
          stateCounts[state] = (stateCounts[state] || 0) + 1;
        }
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
      }
    });

    // Only check departure and destination to prevent VORs in the route
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

    // Determine Final Distance (Fallback to Calculated if missing)
    const flightDist = f.distance && f.distance > 0 ? f.distance : calculatedDistance;
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
    
    // Track usage frequencies
    aircraftTypeCounts[f.aircraftType] = (aircraftTypeCounts[f.aircraftType] || 0) + 1;
    if (f.departure && f.destination) {
      const routeStr = `${f.departure} to ${f.destination}`;
      routeCounts[routeStr] = (routeCounts[routeStr] || 0) + 1;
    }

    // Home Base calculation (using first leg or departure)
    const dep = flightLegs.length > 0 ? flightLegs[0] : f.departure;
    departureCounts[dep] = (departureCounts[dep] || 0) + 1;

    // Fuel Burn calculation
    stats.estimatedFuelBurn += (f.totalTime * profile.gph);
  });

  stats.uniqueAirports = airports.size;
  stats.uniqueAircraftTypes = aircraftTypes.size;
  stats.uniqueTailNumbers = tailNumbers.size;
  
  // Calculate top superlative stats
  stats.mostUsedAirframe = Object.keys(aircraftTypeCounts).reduce((a, b) => 
    aircraftTypeCounts[a] > aircraftTypeCounts[b] ? a : b
  , "Unknown");

  const favRoute = Object.keys(routeCounts).reduce((a, b) => 
    routeCounts[a] > routeCounts[b] ? a : b
  , "None");
  stats.favoriteRoute = favRoute;
  stats.favoriteRouteCount = routeCounts[favRoute] || 0;

  const topState = Object.keys(stateCounts).reduce((a, b) => 
    stateCounts[a] > stateCounts[b] ? a : b
  , "Unknown");
  stats.mostVisitedState = topState;
  stats.mostVisitedStateCount = stateCounts[topState] || 0;

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