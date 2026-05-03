export type AirportDB = Record<string, [number, number, string, string?]>;

/** [longitude, latitude] — D3/GeoJSON convention (NOT the common Leaflet [lat, lon] order) */
export type LonLat = [number, number];

export interface FlightRecord {
  date: string;
  route: string;
  departure: string; // Extracted from route
  destination: string; // Extracted from route
  distance: number;
  aircraftId: string;
  aircraftType: string;
  totalTime: number;
  pic: number;
  night: number;
  landings: number;
  instrument: number; // Actual IMC
  simulated: number; // Simulated IMC
  approaches: number;
}

export interface CalculatedStats {
  totalHours: number;
  totalFlights: number;
  homeBase: string;
  totalDistanceNm: number;
  uniqueAircraftTypes: number;
  uniqueTailNumbers: number;
  shortestFlight: number;
  shortestFlightDate: string;
  shortestFlightRoute: string;
  longestFlight: number; // in NM
  longestFlightRoute: string;
  longestFlightDate: string;
  totalLandings: number;
  uniqueAirports: number;
  totalNight: number;
  totalIMC: number;
  totalSimulated: number;
  totalActualAndSim: number;
  totalApproaches: number;
  estimatedFuelBurn: number; // Avg 10 gal/hr assumed for light GA
  hasInternational: boolean;
  mostUsedAirframe: string;
  mostUsedAirframeCount: number;
  mostUsedTailNumber: string;
  mostUsedTailNumberCount: number;
  favoriteRoute: string;
  favoriteRouteCount: number;
  mostVisitedState: string;
  mostVisitedStateCount: number;
  uniqueStatesCount: number;
  averageFlightTime: number;
  flightsPerMonth: number;
  busiestMonth: string;
  homeBaseLandings: number;
  activeMonths: number;
  mapData: {
    nodes: LonLat[]; // [longitude, latitude] — D3/GeoJSON convention
    edges: [LonLat, LonLat][]; // [[lon1, lat1], [lon2, lat2]]
    bounds: [number, number, number, number] | null; // [minLon, minLat, maxLon, maxLat]
    homeBaseCoords: LonLat | null; // [longitude, latitude]
  };
}

export interface GrowthCategory {
  label: string;
  valueA: number;
  valueB: number;
  winner: 'A' | 'B' | 'Tie';
  delta: number;
  unit: string;
  isHigherBetter?: boolean;
}

export interface GrowthStats {
  hours: GrowthCategory;
  flights: GrowthCategory;
  distance: GrowthCategory;
  landings: GrowthCategory;
  night: GrowthCategory;
  airports: GrowthCategory;
  actualIMC: GrowthCategory;
  simIMC: GrowthCategory;
  fuel: GrowthCategory;
  overallWinner: 'A' | 'B' | 'Tie';
  scoreA: number;
  scoreB: number;
}

export interface ExportItem {
  id: string;
  name: string;
  isPoster?: boolean;
  render: (format: 'story' | 'post') => any;
}

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, string | number | boolean>) => void;
    };
  }
}