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
  simulated: string | null;
  approaches: string | null;
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
    landings: 'DayLandingsFullStop',
    nightLandings: 'NightLandingsFullStop',
    instrument: 'ActualInstrument',
    simulated: 'SimulatedInstrument',
    approaches: 'Approaches',
  },
  GARMIN: {
    date: 'Date',
    route: 'Route',
    departure: 'Departure',
    destination: 'Destination',
    distance: 'Distance',
    aircraftId: 'Aircraft ID',
    aircraftType: 'Aircraft Type',
    totalTime: 'Total Duration',
    pic: 'PIC Duration',
    night: 'Night Duration',
    landings: 'Day Landings',
    nightLandings: 'Night Landings',
    instrument: 'Actual Instrument Duration',
    simulated: 'Simulated Instrument Duration',
    approaches: 'Num Instrument Approaches',
  },
  MYFLIGHTBOOK: {
    date: 'Date',
    route: 'Route',
    departure: 'Departure', // Does not exist natively, falls back to route splitting
    destination: 'Destination', // Does not exist natively, falls back to route splitting
    distance: 'Distance',
    aircraftId: 'Tail Number',
    aircraftType: 'ICAO Model',
    totalTime: 'Total Flight Time',
    pic: 'PIC',
    night: 'Night',
    landings: 'FS Day Landings',
    nightLandings: 'FS Night Landings',
    instrument: 'IMC',
    simulated: 'Simulated Instrument',
    approaches: 'Approaches',
  },
  LOGTEN: {
    date: 'Date',
    route: 'Route',
    departure: 'From',
    destination: 'To',
    distance: 'Distance',
    aircraftId: 'Aircraft ID',
    aircraftType: 'Type',
    totalTime: 'Total Time',
    pic: 'PIC',
    night: 'Night',
    landings: 'Day Ldg', // LogTen often shortens Landings to Ldg
    nightLandings: 'Night Ldg',
    instrument: 'Actual Instrument',
    simulated: 'Simulated Instrument',
    approaches: 'Approaches',
  }
};