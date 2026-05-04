import { FlightRecord, ApproachTypeCounts } from './types';
import { PROFILES } from './EFBProfiles';
import { AIRCRAFT_PROFILES } from './AircraftProfiles';

// Classify a raw approach description (e.g. "ILS RWY 24", "RNAV (GPS) RWY 01",
// "VOR/DME-A") into one of the buckets we surface on Page 6. Returns null if
// no description is present so the caller can skip typed counting.
const classifyApproachType = (desc: string): keyof ApproachTypeCounts | null => {
  if (!desc) return null;
  const d = desc.toUpperCase();
  if (d.includes('ILS')) return 'ILS';
  if (d.includes('RNAV') || d.includes('GPS') || d.includes('LPV') || d.includes('LNAV') || d.includes('RNP')) return 'RNAV';
  if (d.includes('VOR')) return 'VOR';
  if (d.includes('LOC') || d.includes('LDA') || d.includes('SDF')) return 'LOC';
  if (d.includes('NDB')) return 'NDB';
  return 'other';
};

export const detectEFBProfile = (headers: string[]): { profile: any, name: string } => {
  if (headers.includes('AircraftID') || headers.includes('TypeCode')) 
    return { profile: PROFILES.FOREFLIGHT, name: "ForeFlight" };
  if (headers.includes('Aircraft ID') && headers.includes('Total Duration')) 
    return { profile: PROFILES.GARMIN, name: "Garmin Pilot" };
  if (headers.includes('Tail Number') && headers.includes('Total Flight Time')) 
    return { profile: PROFILES.MYFLIGHTBOOK, name: "MyFlightbook" };
  if (headers.includes('Aircraft ID') && headers.includes('Total Time') && headers.includes('Type')) 
    return { profile: PROFILES.LOGTEN, name: "LogTen Pro" };
  
  return { profile: null, name: "Unknown" };
};

// Fuzzy-matches raw aircraft type strings (e.g. "C172P", "172N") to known ICAO profile keys
const standardizeAircraftType = (rawType: string): string => {
  if (!rawType) return 'UNKNOWN';

  const cleanType = rawType.toUpperCase().replace(/[-\s_]/g, '');
  // Sort longest keys first so more-specific profiles (e.g. "PA28R") match before shorter ones (e.g. "PA28")
  const availableProfiles = Object.keys(AIRCRAFT_PROFILES).sort((a, b) => b.length - a.length);

  // Substring match: "C172P" → "C172"
  for (const profile of availableProfiles) {
    if (cleanType.includes(profile)) {
      return profile;
    }
  }

  // Numeric-only match for missing manufacturer prefix: "172N" → "C172"
  for (const profile of availableProfiles) {
    const numericPart = profile.replace(/\D/g, '');
    if (numericPart.length >= 2 && cleanType.includes(numericPart)) {
      return profile;
    }
  }

  return cleanType;
};

export const normalizeFlightData = (rawRows: any[], preParsedAircraftMap?: Record<string, string>): FlightRecord[] => {
  if (!rawRows || rawRows.length === 0) return [];

  const headers = Object.keys(rawRows[0]);
  let profile = PROFILES.FOREFLIGHT; // Default fallback
  let isKnownProfile = false;

  const { profile: detectedProfile } = detectEFBProfile(headers);
  if (detectedProfile) {
    profile = detectedProfile;
    isKnownProfile = true;
  }

  // Unknown EFB format — attempt to fuzzy-match column headers to known field names
  if (!isKnownProfile) {
    const findCol = (aliases: string[]) => {
      const lowerHeaders = headers.map(h => h.toLowerCase().trim());
      for (const alias of aliases) {
        const idx = lowerHeaders.findIndex(h => h === alias.toLowerCase() || h.includes(alias.toLowerCase()));
        if (idx !== -1) return headers[idx];
      }
      return '';
    };

    profile = {
      date: findCol(['Date', 'Date Flown', 'Flight Date', 'Day']),
      route: findCol(['Route', 'Flight Routing', 'Routing']),
      departure: findCol(['Departure', 'From', 'Dep']),
      destination: findCol(['Destination', 'To', 'Dest']),
      distance: findCol(['Distance', 'Dist', 'NM']),
      aircraftId: findCol(['Tail', 'Aircraft ID', 'AircraftID', 'N-Number', 'Registration', 'Id']),
      aircraftType: findCol(['Aircraft Type', 'Type', 'Model', 'ICAO', 'TypeCode']),
      totalTime: findCol(['Total Time', 'Total Flight Time', 'Total Duration', 'Duration', 'Flight Time', 'Total', 'TT']),
      pic: findCol(['PIC', 'Pilot In Command', 'P1']),
      night: findCol(['Night']),
      landings: findCol(['Landings', 'Ldg', 'Day Landings', 'Day Ldg']),
      nightLandings: findCol(['Night Landings', 'Night Ldg']),
      instrument: findCol(['Actual Instrument', 'IMC', 'Actual', 'Instrument']),
      simulated: findCol(['Simulated', 'Simulated Instrument', 'Hood']),
      approaches: findCol(['Approaches', 'Appr', 'Num Instrument Approaches', 'IAP'])
    };
  }

  const tailToTypeMap: Record<string, string> = preParsedAircraftMap || {};
  rawRows.forEach(row => {
    const tail = row[profile.aircraftId];
    const type = row[profile.aircraftType];
    if (tail && type) tailToTypeMap[tail] = type;
  });

  return rawRows.map(row => {
    let departure = row[profile.departure];
    let destination = row[profile.destination];
    const route = row[profile.route] || '';

    if (departure && (!destination || destination.trim().toLowerCase() === 'local')) {
      destination = departure;
    }

    if (!departure || !destination) {
      const routeParts = route.split(' ').filter(Boolean);
      if (!departure) departure = routeParts.length > 0 ? routeParts[0] : 'Unknown';
      if (!destination) destination = routeParts.length > 1 ? routeParts[routeParts.length - 1] : departure;
    }

    const dayLdg = parseInt(row[profile.landings]) || parseInt(row['DayLandingsFullStop']) || parseInt(row['DayLandings']) || 0;
    const nightLdg = profile.nightLandings ? (parseInt(row[profile.nightLandings]) || parseInt(row['NightLandingsFullStop']) || 0) : 0;
    const allLdg = parseInt(row['AllLandings']) || 0;
    let totalLandings = (dayLdg + nightLdg === 0 && allLdg > 0) ? allLdg : dayLdg + nightLdg;

    let totalTime = parseFloat(row[profile.totalTime]) || 0;
    if (totalTime === 0) {
      const hS = parseFloat(row['HobbsStart']);
      const hE = parseFloat(row['HobbsEnd']);
      if (!isNaN(hS) && !isNaN(hE) && hE > hS) totalTime = hE - hS;
      totalTime = Math.round(totalTime * 10) / 10;
    }

    let distance = parseFloat(row[profile.distance]) || 0;
    if (profile === PROFILES.GARMIN && distance > 0) distance = distance / 1852;

    if (totalLandings === 0 && totalTime > 0 && departure !== destination) totalLandings = 1;

    const aircraftId = row[profile.aircraftId] || 'UNKNOWN';
    let rawAircraftType = row[profile.aircraftType] || tailToTypeMap[aircraftId];
    const aircraftType = standardizeAircraftType(rawAircraftType);

    // Approach totals + optional per-type breakdown.
    // ForeFlight exports individual approach columns ("Approach1"..."Approach10")
    // in the semicolon-delimited format `count;description;runway;airport;;`.
    // When the description is present we bucket by type; otherwise we just sum
    // the count and leave approachTypes undefined so the UI hides the chips.
    let totalApproaches = 0;
    let approachTypes: ApproachTypeCounts | undefined;
    let sawTypedApproach = false;

    for (let i = 1; i <= 10; i++) {
      const appCol = row[`Approach${i}`] || row[`Approach ${i}`];
      if (!appCol) continue;
      if (typeof appCol === 'string' && appCol.includes(';')) {
        const parts = appCol.split(';');
        const count = parseInt(parts[0]) || 1;
        const desc = parts[1] || '';
        totalApproaches += count;
        const bucket = classifyApproachType(desc);
        if (bucket) {
          sawTypedApproach = true;
          if (!approachTypes) approachTypes = { ILS: 0, RNAV: 0, VOR: 0, LOC: 0, NDB: 0, other: 0 };
          approachTypes[bucket] += count;
        }
      } else {
        totalApproaches += parseInt(appCol) || 1;
      }
    }

    // Fallback to the single-column approach count (Garmin, MyFlightbook, etc.)
    // when no per-flight Approach1..N columns were populated.
    if (totalApproaches === 0 && profile.approaches) {
      totalApproaches = parseInt(row[profile.approaches]) || 0;
    }
    if (!sawTypedApproach) approachTypes = undefined;

    return {
      date: row[profile.date] || 'Unknown Date',
      route,
      departure: departure || 'Unknown',
      destination: destination || 'Unknown',
      distance,
      aircraftId,
      aircraftType: aircraftType || 'UNKNOWN',
      totalTime,
      pic: parseFloat(row[profile.pic]) || 0,
      night: parseFloat(row[profile.night]) || 0,
      landings: totalLandings,
      instrument: parseFloat(row[profile.instrument]) || 0,
      simulated: profile.simulated ? (parseFloat(row[profile.simulated]) || 0) : 0,
      approaches: totalApproaches,
      approachTypes,
    };
  }).filter(flight => flight.totalTime > 0 && flight.date !== 'Unknown Date');
};