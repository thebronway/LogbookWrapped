export interface EFBProfile {
  date: string;
  route: string;
  departure: string;
  destination: string;
  distance: string;
  aircraftId: string;
  aircraftType: string;
  totalTime: string;
  pic: string;
  night: string;
  landings: string;
  nightLandings: string | null;
  instrument: string;
}

export const PROFILES: Record<string, EFBProfile> = {
  FOREFLIGHT: {
    date: 'Date',
    route: 'Route',
    departure: 'From',
    destination: 'To',
    distance: 'Distance',
    aircraftId: 'AircraftID',
    aircraftType: 'TypeCode', 
    totalTime: 'TotalTime',
    pic: 'PIC',
    night: 'Night',
    landings: 'DayLandingsFullStop', // <--- FIXED
    nightLandings: 'NightLandingsFullStop', // <--- FIXED
    instrument: 'ActualInstrument',
  },
  GARMIN: {
    date: 'Date',
    route: 'Route',
    departure: 'Departure',
    destination: 'Destination',
    distance: 'Distance',
    aircraftId: 'Aircraft',
    aircraftType: 'Model',
    totalTime: 'Duration',
    pic: 'PIC',
    night: 'Night',
    landings: 'Landings',
    nightLandings: null,
    instrument: 'IMC',
  }
};