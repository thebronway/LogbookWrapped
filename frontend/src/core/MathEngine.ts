import { FlightRecord, CalculatedStats, AirportDB, GrowthStats, GrowthCategory, LonLat, ApproachTypeCounts } from './types';
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
    totalNight: 0, totalIMC: 0, totalSimulated: 0, totalActualAndSim: 0, totalApproaches: 0, nightPercent: 0, estimatedFuelBurn: 0,
    hasInternational: false, mostUsedAirframe: 'Unknown', mostUsedAirframeCount: 0,
    mostUsedTailNumber: 'Unknown', mostUsedTailNumberCount: 0, favoriteRoute: 'None',
    favoriteRouteCount: 0, mostVisitedState: 'Unknown', mostVisitedStateCount: 0, uniqueStatesCount: 0,
    averageFlightTime: 0, flightsPerMonth: 0, busiestMonth: '', homeBaseLandings: 0,
    activeMonths: 0,
    mapData: { nodes: [], edges: [], bounds: null, homeBaseCoords: null }
  };

  const mapTracker = createMapTracker();
  const supTracker = createSuperlativeTracker();

  // Accumulate per-type approach counts only when at least one flight supplied
  // typed data; otherwise leave stats.approachBreakdown undefined so the UI
  // chips hide.
  const approachBreakdown: ApproachTypeCounts = { ILS: 0, RNAV: 0, VOR: 0, LOC: 0, NDB: 0, other: 0 };
  let sawTypedApproach = false;

  flights.forEach(f => {
    stats.totalHours += f.totalTime;
    stats.totalLandings += f.landings;
    stats.totalNight += f.night;
    stats.totalIMC += f.instrument;
    stats.totalSimulated += f.simulated;
    stats.totalApproaches += f.approaches || 0;

    if (f.approachTypes) {
      sawTypedApproach = true;
      approachBreakdown.ILS += f.approachTypes.ILS;
      approachBreakdown.RNAV += f.approachTypes.RNAV;
      approachBreakdown.VOR += f.approachTypes.VOR;
      approachBreakdown.LOC += f.approachTypes.LOC;
      approachBreakdown.NDB += f.approachTypes.NDB;
      approachBreakdown.other += f.approachTypes.other;
    }

    const profile = AIRCRAFT_PROFILES[f.aircraftType.toUpperCase()] || AIRCRAFT_PROFILES['UNKNOWN'];
    stats.estimatedFuelBurn += (f.totalTime * profile.gph);
    
    const { flightLegs, calculatedDistance } = analyzeFlightRoute(f, airportDB, profile.speed);
    
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

    let monthKey = 'Unknown';
    if (f.date) {
      const d = new Date(f.date);
      if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        monthKey = `${yyyy}-${mm}`;
      }
    }

    if (monthKey !== 'Unknown') {
      if (!supTracker.monthStats[monthKey]) supTracker.monthStats[monthKey] = { flights: 0, hours: 0 };
      supTracker.monthStats[monthKey].flights += 1;
      supTracker.monthStats[monthKey].hours += f.totalTime;
    }
  });

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
  stats.uniqueStatesCount = Object.keys(mapTracker.stateCounts).length;

  if (stats.homeBase !== "Unknown" && airportDB[stats.homeBase]) {
    const coords = airportDB[stats.homeBase];
    stats.mapData.homeBaseCoords = [coords[1], coords[0]] as LonLat;
  }

  mapTracker.airports.forEach(apt => {
    const coords = airportDB[apt];
    if (coords) stats.mapData.nodes.push([coords[1], coords[0]] as LonLat);
  });

  if (stats.mapData.nodes.length > 0) {
    stats.mapData.bounds = [mapTracker.minLon, mapTracker.minLat, mapTracker.maxLon, mapTracker.maxLat];
  }

  stats.activeMonths = winners.activeMonths ?? 0;
  stats.averageFlightTime = stats.totalFlights > 0 ? stats.totalHours / stats.totalFlights : 0;
  stats.flightsPerMonth = stats.activeMonths > 0 ? stats.totalFlights / stats.activeMonths : 0;
  if (stats.shortestFlight === 9999) stats.shortestFlight = 0;

  // Round accumulated floats to avoid IEEE 754 artifacts (e.g. 1.2000000000001)
  stats.totalHours = Number(stats.totalHours.toFixed(1));
  stats.totalNight = Number(stats.totalNight.toFixed(1));
  stats.nightPercent = stats.totalHours > 0
    ? Number(((stats.totalNight / stats.totalHours) * 100).toFixed(0))
    : 0;
  if (sawTypedApproach) stats.approachBreakdown = approachBreakdown;
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

export const calculateGrowthStats = (statsA: CalculatedStats, statsB: CalculatedStats): GrowthStats => {
  const compare = (valA: number, valB: number, label: string, unit: string, isHigherBetter = true): GrowthCategory => {
    let winner: 'A' | 'B' | 'Tie' = 'Tie';
    if (valA > valB) winner = isHigherBetter ? 'A' : 'B';
    if (valB > valA) winner = isHigherBetter ? 'B' : 'A';
    
    return {
      label,
      valueA: valA,
      valueB: valB,
      winner,
      delta: Number(Math.abs(valA - valB).toFixed(1)),
      unit,
      isHigherBetter
    };
  };

  const hours = compare(statsA.totalHours, statsB.totalHours, 'Flight Time', 'hrs');
  const flights = compare(statsA.totalFlights, statsB.totalFlights, 'Flights', '');
  const distance = compare(statsA.totalDistanceNm, statsB.totalDistanceNm, 'Distance', 'NM');
  const landings = compare(statsA.totalLandings, statsB.totalLandings, 'Landings', '');
  const night = compare(statsA.totalNight, statsB.totalNight, 'Night Hours', 'hrs');
  const airports = compare(statsA.uniqueAirports, statsB.uniqueAirports, 'Unique Airports', '');
  const actualIMC = compare(statsA.totalIMC, statsB.totalIMC, 'Actual IMC', 'hrs');
  const simIMC = compare(statsA.totalSimulated, statsB.totalSimulated, 'Sim IMC', 'hrs');
  const fuel = compare(statsA.estimatedFuelBurn, statsB.estimatedFuelBurn, 'Fuel Burned', 'gal', false);

  const categories = [hours, flights, distance, landings, night, airports, actualIMC, simIMC];
  const scoreA = categories.filter(c => c.winner === 'A').length;
  const scoreB = categories.filter(c => c.winner === 'B').length;

  return {
    hours,
    flights,
    landings,
    distance,
    airports,
    actualIMC,
    simIMC,
    night,
    fuel,
    scoreA,
    scoreB,
    overallWinner: scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : 'Tie'
  };
};