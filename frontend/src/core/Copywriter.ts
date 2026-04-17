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
  else if (n <= 3) nightCopy = "Night currency: Secured. Just enough to keep the FAA happy.";
  else if (n <= 15) nightCopy = "The Sunset Chaser. You’ve seen some incredible views while the world goes to sleep.";
  else if (n <= 25) nightCopy = "Moonlight Cruiser. You know exactly which airports have the best-lit runways.";
  else if (n > 25) nightCopy = "Vampire Mode: ON. You probably see better in the dark than during the day.";

  return { nightCopy };
};