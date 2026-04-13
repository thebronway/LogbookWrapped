export type AirportDB = Record<string, [number, number]>;

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
  estimatedFuelBurn: number; // Avg 10 gal/hr assumed for light GA
}