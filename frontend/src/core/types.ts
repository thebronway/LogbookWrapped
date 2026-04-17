export type AirportDB = Record<string, [number, number, string, string?]>;

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
  averageFlightTime: number;
  flightsPerMonth: number;
  busiestMonth: string;
  homeBaseLandings: number;
  mapData: {
    nodes: [number, number][]; // [longitude, latitude]
    edges: [[number, number], [number, number]][]; // [[lon1, lat1], [lon2, lat2]]
    bounds: [number, number, number, number] | null; // [minLon, minLat, maxLon, maxLat]
    homeBaseCoords: [number, number] | null; // [longitude, latitude]
  };
}