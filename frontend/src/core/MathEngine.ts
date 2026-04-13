import { FlightRecord, CalculatedStats } from './types';

// Note: For true distance calculations client-side, we will eventually need to 
// load a lightweight airports.json coordinate database into the /public folder.
// For now, we simulate a flat 120 NM per flight hour as a rough GA estimate if DB is missing.
const estimateDistance = (time: number) => time * 120; 

export const calculateStats = (flights: FlightRecord[]): CalculatedStats => {
  const stats: CalculatedStats = {
    totalHours: 0,
    totalFlights: flights.length,
    homeBase: '',
    totalDistanceNm: 0,
    uniqueAircraftTypes: 0,
    uniqueTailNumbers: 0,
    shortestFlight: 9999,
    longestFlight: 0,
    longestFlightRoute: '',
    totalLandings: 0,
    uniqueAirports: 0,
    totalNight: 0,
    totalIMC: 0,
    estimatedFuelBurn: 0,
  };

  const airports = new Set<string>();
  const aircraftTypes = new Set<string>();
  const tailNumbers = new Set<string>();
  const departureCounts: Record<string, number> = {};

  flights.forEach(f => {
    stats.totalHours += f.totalTime;
    stats.totalLandings += f.landings;
    stats.totalNight += f.night;
    stats.totalIMC += f.instrument;
    
    // Distance Estimation (Will replace with Haversine formula + DB later)
    const flightDist = estimateDistance(f.totalTime);
    stats.totalDistanceNm += flightDist;

    // Extremes
    if (f.totalTime < stats.shortestFlight && f.totalTime > 0) stats.shortestFlight = f.totalTime;
    if (flightDist > stats.longestFlight) {
      stats.longestFlight = flightDist;
      stats.longestFlightRoute = `${f.departure} to ${f.destination}`;
    }

    // Uniques
    if (f.departure !== 'Unknown') airports.add(f.departure);
    if (f.destination !== 'Unknown') airports.add(f.destination);
    aircraftTypes.add(f.aircraftType);
    tailNumbers.add(f.aircraftId);

    // Home Base calculation
    departureCounts[f.departure] = (departureCounts[f.departure] || 0) + 1;
  });

  stats.uniqueAirports = airports.size;
  stats.uniqueAircraftTypes = aircraftTypes.size;
  stats.uniqueTailNumbers = tailNumbers.size;
  stats.estimatedFuelBurn = stats.totalHours * 10; // Standard 10gal/hr assumption
  
  // Find Home Base (most frequent departure)
  stats.homeBase = Object.keys(departureCounts).reduce((a, b) => 
    departureCounts[a] > departureCounts[b] ? a : b
  , "Unknown");

  // Fix shortest flight init value if no flights
  if (stats.shortestFlight === 9999) stats.shortestFlight = 0;

stats.uniqueAirports = airports.size;
  stats.uniqueAircraftTypes = aircraftTypes.size;
  stats.uniqueTailNumbers = tailNumbers.size;
  stats.estimatedFuelBurn = stats.totalHours * 10; // Standard 10gal/hr assumption
  
  // Find Home Base (most frequent departure)
  stats.homeBase = Object.keys(departureCounts).reduce((a, b) => 
    departureCounts[a] > departureCounts[b] ? a : b
  , "Unknown");

  if (stats.shortestFlight === 9999) stats.shortestFlight = 0;

  // --- ADD THIS ROUNDING BLOCK ---
  // Clean up JavaScript floating point artifacts (round to nearest tenth)
  stats.totalHours = Number(stats.totalHours.toFixed(1));
  stats.totalNight = Number(stats.totalNight.toFixed(1));
  stats.totalIMC = Number(stats.totalIMC.toFixed(1));
  stats.estimatedFuelBurn = Number(stats.estimatedFuelBurn.toFixed(1));
  stats.totalDistanceNm = Number(stats.totalDistanceNm.toFixed(0)); // Whole numbers for distance
  stats.shortestFlight = Number(stats.shortestFlight.toFixed(1));
  stats.longestFlight = Number(stats.longestFlight.toFixed(0));

  return stats;
};