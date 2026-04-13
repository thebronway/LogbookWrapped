import { FlightRecord } from './types';
import { PROFILES } from './EFBProfiles';

export const normalizeFlightData = (rawRows: any[]): FlightRecord[] => {
  if (!rawRows || rawRows.length === 0) return [];

  const headers = Object.keys(rawRows[0]);
  const isForeFlight = headers.includes('AircraftID') || headers.includes('TotalTime'); 
  const profile = isForeFlight ? PROFILES.FOREFLIGHT : PROFILES.GARMIN;

  return rawRows.map(row => {
    let departure = row[profile.departure];
    let destination = row[profile.destination];
    const route = row[profile.route] || '';

    if (!departure || !destination) {
        const routeParts = route.split(' ').filter(Boolean);
        if (!departure) departure = routeParts.length > 0 ? routeParts[0] : 'Unknown';
        if (!destination) destination = routeParts.length > 1 ? routeParts[routeParts.length - 1] : departure;
    }

    // Parse the correct columns based on your CSV
    const dayLdg = parseInt(row[profile.landings]) || parseInt(row['DayLandingsFullStop']) || parseInt(row['DayLandings']) || 0;
    const nightLdg = profile.nightLandings ? (parseInt(row[profile.nightLandings]) || parseInt(row['NightLandingsFullStop']) || 0) : 0;
    const allLdg = parseInt(row['AllLandings']) || 0;

    let totalLandings = dayLdg + nightLdg;
    
    // If Day/Night specific columns are empty, but AllLandings is filled out, use that.
    if (totalLandings === 0 && allLdg > 0) {
      totalLandings = allLdg; 
    }

    const totalTime = parseFloat(row[profile.totalTime]) || 0;

    return {
      date: row[profile.date] || 'Unknown Date',
      route: route,
      departure: departure || 'Unknown',
      destination: destination || 'Unknown',
      aircraftId: row[profile.aircraftId] || 'UNKNOWN',
      aircraftType: row[profile.aircraftType] || 'UNKNOWN',
      totalTime: totalTime,
      pic: parseFloat(row[profile.pic]) || 0,
      night: parseFloat(row[profile.night]) || 0,
      landings: totalLandings,
      instrument: parseFloat(row[profile.instrument]) || 0,
    };
  }).filter(flight => flight.totalTime > 0 && flight.date !== 'Unknown Date'); 
};