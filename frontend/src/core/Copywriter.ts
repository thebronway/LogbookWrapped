import { CalculatedStats } from './types';

export const getPage3Copy = (stats: CalculatedStats) => {
  const dist = stats.totalDistanceNm;
  let distCopy = "You literally flew the equivalent of a lap around the globe.";
  if (dist < 100) distCopy = "Just warming up the oil. Did you even leave the traffic pattern?";
  else if (dist < 250) distCopy = "Enough to cross the county line and grab a $100 hamburger.";
  else if (dist < 500) distCopy = "Enough to drive across the state... but way cooler, and without the traffic.";
  else if (dist < 750) distCopy = "A solid regional tour. You're definitely getting use out of that autopilot.";
  else if (dist < 1500) distCopy = "Serious mileage. That's roughly a road trip from LA to Chicago, as the crow flies.";
  else if (dist < 2500) distCopy = "You're racking up the miles and traversing time zones on the regular.";
  else if (dist < 10800) {
    const trips = Math.floor(dist / 2500);
    distCopy = `That’s enough to fly coast-to-coast across the US ${trips} time${trips === 1 ? '' : 's'}.`;
  }
  else if (dist < 21600) distCopy = "That's more than halfway around the entire Earth!";

  const days = Math.floor(stats.totalHours / 24);
  const hours = (stats.totalHours % 24).toFixed(1);
  return { distCopy, days, hours };
};

export const getPage6Copy = (stats: CalculatedStats) => {
  const n = stats.totalNight;
  let nightCopy = "Vampire mode: ON. You probably log more time under the stars than the sun.";
  if (n === 0) nightCopy = "Strictly a day-walker. Sun goes down, gear goes down.";
  else if (n <= 1) nightCopy = "The sun beat you home. Just a few minutes of twilight for the soul.";
  else if (n <= 3) nightCopy = "Night currency secured. Just enough to keep the FAA happy.";
  else if (n <= 15) nightCopy = "The Sunset Chaser. You’ve seen some incredible views while the world goes to sleep.";
  else if (n <= 25) nightCopy = "Moonlight Cruiser. You know exactly which airports have the best-lit runways.";
  else if (n > 25) nightCopy = "Vampire Mode: ON. You probably see better in the dark than during the day.";

  return { nightCopy };
};

export const getYoYCopy = (deltaHours: number, isIncrease: boolean) => {
  if (deltaHours < 5) {
    return "Consistency is key. You flew almost the exact same amount as last year.";
  }

  if (isIncrease) {
    if (deltaHours > 100) return `Massive growth! You logged ${deltaHours} more hours than last year. Someone's been living in the cockpit.`;
    if (deltaHours > 50) return `Moving on up! You spent ${deltaHours} more hours in the air. Solid progress.`;
    return `A nice bump! You flew ${deltaHours} hours more this year.`;
  } else {
    if (deltaHours > 100) return `Taking a breather? You logged ${deltaHours} fewer hours than last year. The sky misses you!`;
    if (deltaHours > 50) return `A bit lighter on the throttle this year. You flew ${deltaHours} fewer hours.`;
    return `Slightly less time in the air this year, flying ${deltaHours} fewer hours.`;
  }
};

export const getTitleData = (dateFilter: any, isPage1: boolean = false) => {
  let line1 = "My";
  let isMilestone = dateFilter?.type === 'milestone';

  if (dateFilter?.type === 'this_year') {
    line1 = `My ${new Date().getFullYear()} Logbook`;
  } else if (dateFilter?.type === 'last_year') {
    line1 = `My ${new Date().getFullYear() - 1} Logbook`;
  } else if (dateFilter?.type === 'all_time') {
    line1 = 'My All-Time Logbook';
  } else if (dateFilter?.type === 'custom' && dateFilter.start && dateFilter.end && dateFilter.start.substring(0,4) === dateFilter.end.substring(0,4)) {
    line1 = `My ${dateFilter.start.substring(0, 4)} Logbook`;
  } else if (isMilestone) {
    const label = dateFilter.label || '';
    if (isPage1) {
      line1 = `My ${label}`; // Full title for Cover
    } else {
      const acronymMap: Record<string, string> = { 
        'Private Pilot License': 'PPL', 
        'Instrument Rating': 'IFR', 
        'Commercial Pilot License': 'CPL', 
        'Multi-Engine Rating': 'Multi-Engine', 
      };
      line1 = `My ${acronymMap[label] || label}`; // Acronym for Data Pages
    }
  }

  const isLongLine1 = line1.length > 22;

  return { line1, isMilestone, isLongLine1 };
};