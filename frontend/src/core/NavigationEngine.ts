import { FlightRecord, AirportDB } from './types';

export const getDistanceNm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3440.065;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const analyzeFlightRoute = (f: FlightRecord, airportDB: AirportDB, profileSpeed: number) => {
  // If flight time is 0 (e.g., sim session or mistake), grant a massive budget so we don't drop the route
  const maxFlightDistance = f.totalTime > 0 ? (f.totalTime * profileSpeed * 2.0) : 99999;
  const ignoredTokens = new Set(['DCT', 'DIR', 'GPS', 'RNAV', 'ILS', 'LOC', 'VOR', 'NDB', 'VFR', 'IFR', 'VECT', 'VTF', 'RADAR']);

  const routeTokens = f.route ? f.route.split(/[\s-]+/) : [];
  const validWaypoints = routeTokens
    .map(t => t.toUpperCase())
    .filter(t => !ignoredTokens.has(t) && airportDB[t]);

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
      const distToWpt = getDistanceNm(currentLat, currentLon, dbEntry[0], dbEntry[1]);
      const distFromWptToDest = getDistanceNm(dbEntry[0], dbEntry[1], destEntry[0], destEntry[1]);
      
      if ((calculatedDistance + distToWpt + distFromWptToDest) <= maxFlightDistance) {
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

  if (destEntry) {
    const destId = destEntry[2] || f.destination.toUpperCase();
    if (flightLegs[flightLegs.length - 1] !== destId) {
      flightLegs.push(destId);
      if (currentLat !== null && currentLon !== null) {
        calculatedDistance += getDistanceNm(currentLat, currentLon, destEntry[0], destEntry[1]);
      }
    }
  }

  return { flightLegs, calculatedDistance };
};