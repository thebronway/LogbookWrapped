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
    
    // Parse the route to find all valid airports visited
    const routeTokens = f.route ? f.route.split(/[\s-]+/) : [];
    const validAirportsInRoute = routeTokens
      .map(t => t.toUpperCase())
      .filter(t => airportDB[t]);
      
    // Fallback if route is empty or lacks waypoints: use explicit departure and destination
    let flightLegs = validAirportsInRoute.length >= 2 
      ? validAirportsInRoute 
      : [f.departure.toUpperCase(), f.destination.toUpperCase()].filter(t => airportDB[t]);

    // Add valid airports to the unique Set
    flightLegs.forEach(apt => airports.add(apt));

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

  // Fix shortest flight init value if no flights
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