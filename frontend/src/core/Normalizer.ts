import { FlightRecord } from './types';
import { PROFILES } from './EFBProfiles';

export const normalizeFlightData = (rawRows: any[]): FlightRecord[] => {
  if (!rawRows || rawRows.length === 0) return [];

  const headers = Object.keys(rawRows[0]);
  const isForeFlight = headers.includes('AircraftID') || headers.includes('TotalTime'); 
  const profile = isForeFlight ? PROFILES.FOREFLIGHT : PROFILES.GARMIN;

  // 2a. Build the Self-Healing Aircraft Type Dictionary
  const tailToTypeMap: Record<string, string> = {};
  rawRows.forEach(row => {
    const tail = row[profile.aircraftId];
    const type = row[profile.aircraftType];
    // If the row has both a tail number and a valid type, memorize it!
    if (tail && type) {
      tailToTypeMap[tail] = type;
    }
  });

  return rawRows.map(row => {
    let departure = row[profile.departure];
    let destination = row[profile.destination];
    const route = row[profile.route] || '';

    // 5. The "Local Flight" Assumption
    // If departure is filled but destination is blank, or if destination literally says "Local",
    // we assume they landed exactly where they took off.
    if (departure && (!destination || destination.trim().toLowerCase() === 'local')) {
      destination = departure;
    }

    // Fallback for completely missing routing (no departure logged at all)
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

    let totalTime = parseFloat(row[profile.totalTime]) || 0;

    // 3. Missing Total Time (The Hobbs/Block Fallback)
    if (totalTime === 0) {
      const hobbsStart = parseFloat(row['HobbsStart']);
      const hobbsEnd = parseFloat(row['HobbsEnd']);
      const tachStart = parseFloat(row['TachStart']);
      const tachEnd = parseFloat(row['TachEnd']);

      // Fallback A: Hobbs Meter
      if (!isNaN(hobbsStart) && !isNaN(hobbsEnd) && hobbsEnd > hobbsStart) {
        totalTime = hobbsEnd - hobbsStart;
      } 
      // Fallback B: Tach Meter
      else if (!isNaN(tachStart) && !isNaN(tachEnd) && tachEnd > tachStart) {
        totalTime = tachEnd - tachStart;
      } 
      // Fallback C: Block Time (Clock)
      else {
        const timeOut = row['TimeOut'];
        const timeIn = row['TimeIn'];
        
        if (timeOut && timeIn && timeOut.includes(':') && timeIn.includes(':')) {
          const parseTimeToDecimal = (timeStr: string) => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return (!isNaN(hours) && !isNaN(minutes)) ? hours + (minutes / 60) : 0;
          };

          const tOut = parseTimeToDecimal(timeOut);
          const tIn = parseTimeToDecimal(timeIn);

          if (tIn >= tOut) {
            totalTime = tIn - tOut;
          } else {
            // Handled the "Crossed Midnight" edgecase (e.g. 23:00 to 01:00)
            totalTime = (24 - tOut) + tIn;
          }
        }
      }
      
      // Round the calculated fallback time to 1 decimal place (standard for aviation)
      totalTime = Math.round(totalTime * 10) / 10;
    }

    const distance = parseFloat(row[profile.distance]) || 0;

    // 1. The "Ghost Landing" Fix
    // If a pilot flew to a different airport and logged time, they had to land.
    if (totalLandings === 0 && totalTime > 0 && departure !== destination) {
      totalLandings = 1;
    }

    const aircraftId = row[profile.aircraftId] || 'UNKNOWN';
    let aircraftType = row[profile.aircraftType];

    // 2b. Apply the Self-Healing Aircraft Type
    if (!aircraftType && tailToTypeMap[aircraftId]) {
      aircraftType = tailToTypeMap[aircraftId];
    }

    return {
      date: row[profile.date] || 'Unknown Date',
      route: route,
      departure: departure || 'Unknown',
      destination: destination || 'Unknown',
      distance: distance,
      aircraftId: aircraftId,
      aircraftType: aircraftType || 'UNKNOWN',
      totalTime: totalTime,
      pic: parseFloat(row[profile.pic]) || 0,
      night: parseFloat(row[profile.night]) || 0,
      landings: totalLandings,
      instrument: parseFloat(row[profile.instrument]) || 0,
      simulated: profile.simulated ? (parseFloat(row[profile.simulated]) || 0) : 0,
    };
  }).filter(flight => flight.totalTime > 0 && flight.date !== 'Unknown Date'); 
};