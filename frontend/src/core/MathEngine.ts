import { FlightRecord, CalculatedStats, AirportDB } from './types';
import { AIRCRAFT_PROFILES } from './AircraftProfiles';
import { analyzeFlightRoute } from './NavigationEngine';
import { createMapTracker, processFlightMapData } from './MapBuilder';
import { createSuperlativeTracker, getWinners } from './SuperlativesEngine';

export const calculateStats = (flights: FlightRecord[], airportDB: AirportDB): CalculatedStats => {
  const stats: CalculatedStats = {
    totalHours: 0, totalFlights: flights.length, homeBase: '', totalDistanceNm: 0,
    uniqueAircraftTypes: 0, uniqueTailNumbers: 0, shortestFlight: 9999,
    shortestFlightDate: '', shortestFlightRoute: '', longestFlight: 0,
    longestFlightRoute: '', longestFlightDate: '', totalLandings: 0, uniqueAirports: 0,
    totalNight: 0, totalIMC: 0, totalSimulated: 0, totalActualAndSim: 0, estimatedFuelBurn: 0,
    hasInternational: false, mostUsedAirframe: 'Unknown', mostUsedAirframeCount: 0,
    mostUsedTailNumber: 'Unknown', mostUsedTailNumberCount: 0, favoriteRoute: 'None',
    favoriteRouteCount: 0, mostVisitedState: 'Unknown', mostVisitedStateCount: 0,
    averageFlightTime: 0, flightsPerMonth: 0, busiestMonth: '', homeBaseLandings: 0,
    mapData: { nodes: [], edges: [], bounds: null, homeBaseCoords: null }
  };

  const mapTracker = createMapTracker();
  const supTracker = createSuperlativeTracker();

  // 1. THE SINGLE LOOP
  flights.forEach(f => {
    stats.totalHours += f.totalTime;
    stats.totalLandings += f.landings;
    stats.totalNight += f.night;
    stats.totalIMC += f.instrument;
    stats.totalSimulated += f.simulated;

    const profile = AIRCRAFT_PROFILES[f.aircraftType.toUpperCase()] || { gph: 10, speed: 120 };
    stats.estimatedFuelBurn += (f.totalTime * profile.gph);
    
    // Delegation: Route & Geographic Validation
    const { flightLegs, calculatedDistance } = analyzeFlightRoute(f, airportDB, profile.speed);
    
    // Delegation: Graph & Bounds Tracking
    processFlightMapData(f, flightLegs, airportDB, mapTracker);

    const flightDist = f.distance && f.distance > 0 ? f.distance : calculatedDistance;
    stats.totalDistanceNm += flightDist;

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

    // Accumulate metrics for superlatives
    supTracker.aircraftTypes.add(f.aircraftType);
    supTracker.tailNumbers.add(f.aircraftId);
    supTracker.aircraftTypeCounts[f.aircraftType] = (supTracker.aircraftTypeCounts[f.aircraftType] || 0) + 1;
    supTracker.tailNumberCounts[f.aircraftId] = (supTracker.tailNumberCounts[f.aircraftId] || 0) + 1;
    supTracker.destLandings[f.destination.toUpperCase()] = (supTracker.destLandings[f.destination.toUpperCase()] || 0) + (f.landings || 0);
    
    if (f.departure && f.destination) {
      const routeStr = `${f.departure} to ${f.destination}`;
      supTracker.routeCounts[routeStr] = (supTracker.routeCounts[routeStr] || 0) + 1;
    }

    const dep = flightLegs.length > 0 ? flightLegs[0] : f.departure;
    supTracker.departureCounts[dep] = (supTracker.departureCounts[dep] || 0) + 1;

    const monthKey = f.date ? f.date.substring(0, 7) : 'Unknown';
    if (monthKey !== 'Unknown' && monthKey.length === 7) {
      if (!supTracker.monthStats[monthKey]) supTracker.monthStats[monthKey] = { flights: 0, hours: 0 };
      supTracker.monthStats[monthKey].flights += 1;
      supTracker.monthStats[monthKey].hours += f.totalTime;
    }
  });

  // 2. RESOLVE HELPERS
  const winners = getWinners(supTracker);
  Object.assign(stats, winners);

  stats.uniqueAirports = mapTracker.airports.size;
  stats.hasInternational = mapTracker.hasInternational;
  stats.mapData.edges = mapTracker.edges;

  const topState = Object.keys(mapTracker.stateCounts).reduce((a, b) => 
    mapTracker.stateCounts[a] > mapTracker.stateCounts[b] ? a : b
  , "Unknown");
  stats.mostVisitedState = topState;
  stats.mostVisitedStateCount = mapTracker.stateCounts[topState] || 0;

  if (stats.homeBase !== "Unknown" && airportDB[stats.homeBase]) {
    const coords = airportDB[stats.homeBase];
    stats.mapData.homeBaseCoords = [coords[1], coords[0]];
  }

  mapTracker.airports.forEach(apt => {
    const coords = airportDB[apt];
    if (coords) stats.mapData.nodes.push([coords[1], coords[0]]);
  });

  if (stats.mapData.nodes.length > 0) {
    stats.mapData.bounds = [mapTracker.minLon, mapTracker.minLat, mapTracker.maxLon, mapTracker.maxLat];
  }

  // 3. FINAL MATH & CLEANUP
  stats.averageFlightTime = stats.totalFlights > 0 ? stats.totalHours / stats.totalFlights : 0;
  stats.flightsPerMonth = winners.activeMonths > 0 ? stats.totalFlights / winners.activeMonths : 0;
  if (stats.shortestFlight === 9999) stats.shortestFlight = 0;

  // Clean up JavaScript floating point artifacts
  stats.totalHours = Number(stats.totalHours.toFixed(1));
  stats.totalNight = Number(stats.totalNight.toFixed(1));
  stats.totalIMC = Number(stats.totalIMC.toFixed(1));
  stats.totalSimulated = Number(stats.totalSimulated.toFixed(1));
  stats.totalActualAndSim = Number((stats.totalIMC + stats.totalSimulated).toFixed(1));
  stats.estimatedFuelBurn = Number(stats.estimatedFuelBurn.toFixed(1));
  stats.totalDistanceNm = Number(stats.totalDistanceNm.toFixed(0));
  stats.shortestFlight = Number(stats.shortestFlight.toFixed(1));
  stats.longestFlight = Number(stats.longestFlight.toFixed(0));
  stats.averageFlightTime = Number(stats.averageFlightTime.toFixed(1));
  stats.flightsPerMonth = Number(stats.flightsPerMonth.toFixed(1));

  return stats;
};