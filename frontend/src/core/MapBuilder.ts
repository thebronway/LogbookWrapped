import { FlightRecord, AirportDB, LonLat } from './types';

export interface MapTracker {
  airports: Set<string>;
  drawnEdges: Set<string>;
  stateCounts: Record<string, number>;
  edges: [LonLat, LonLat][];
  minLat: number; maxLat: number;
  minLon: number; maxLon: number;
  hasInternational: boolean;
}

export const createMapTracker = (): MapTracker => ({
  airports: new Set(),
  drawnEdges: new Set(),
  stateCounts: {},
  edges: [],
  minLat: 90, maxLat: -90,
  minLon: 180, maxLon: -180,
  hasInternational: false,
});

export const processFlightMapData = (f: FlightRecord, flightLegs: string[], airportDB: AirportDB, tracker: MapTracker) => {
  for (let i = 0; i < flightLegs.length - 1; i++) {
    const startId = flightLegs[i];
    const endId = flightLegs[i + 1];
    const start = airportDB[startId];
    const end = airportDB[endId];
    
    if (start && end) {
      const edgeKey = `${startId}-${endId}`;
      if (!tracker.drawnEdges.has(edgeKey)) {
        tracker.drawnEdges.add(edgeKey);
        // AirportDB stores [lat, lon]; push as [lon, lat] per LonLat/D3 convention
        tracker.edges.push([
          [start[1], start[0]] as LonLat,
          [end[1], end[0]] as LonLat,
        ]);
      }
    }
  }

  flightLegs.forEach(aptId => {
    tracker.airports.add(aptId);
    const dbEntry = airportDB[aptId];
    if (dbEntry) {
      const [lat, lon, , state] = dbEntry;
      if (state && state !== 'Unknown') {
        tracker.stateCounts[state] = (tracker.stateCounts[state] || 0) + 1;
      }
      tracker.minLat = Math.min(tracker.minLat, lat);
      tracker.maxLat = Math.max(tracker.maxLat, lat);
      tracker.minLon = Math.min(tracker.minLon, lon);
      tracker.maxLon = Math.max(tracker.maxLon, lon);
    }
  });

  [f.departure, f.destination].forEach(apt => {
    const coords = airportDB[apt.toUpperCase()];
    if (coords) {
      const [lat, lon] = coords;
      const isConus = (lat >= 24.3 && lat <= 49.4 && lon >= -125.0 && lon <= -66.9)   // CONUS
        || (lat >= 51.0 && lat <= 71.5 && lon >= -180.0 && lon <= -130.0)              // Alaska
        || (lat >= 18.5 && lat <= 22.5 && lon >= -160.5 && lon <= -154.5)              // Hawaii
        || (lat >= 17.9 && lat <= 18.6 && lon >= -67.3 && lon <= -65.2);               // Puerto Rico
      if (!isConus) tracker.hasInternational = true;
    }
  });
};