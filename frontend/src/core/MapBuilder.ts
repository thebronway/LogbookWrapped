import { FlightRecord, AirportDB } from './types';

export interface MapTracker {
  airports: Set<string>;
  drawnEdges: Set<string>;
  stateCounts: Record<string, number>;
  edges: [number, number][][];
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
        tracker.edges.push([
          [start[1], start[0]], 
          [end[1], end[0]]
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
      // Rough CONUS bounding box
      const isConus = lat >= 24.3 && lat <= 49.4 && lon >= -125.0 && lon <= -66.9;
      if (!isConus) tracker.hasInternational = true;
    }
  });
};