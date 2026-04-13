import { CalculatedStats } from './types';

export const getPage1Copy = (stats: CalculatedStats) => {
  const h = stats.totalHours;
  let hoursCopy = "Do you even pay rent on the ground anymore?";
  if (h < 15) hoursCopy = "Just getting your wings wet. Every hour counts.";
  else if (h < 50) hoursCopy = "Weekend Warrior status achieved.";
  else if (h < 150) hoursCopy = "A solid year in the sky. The local FBO definitely knows your coffee order.";

  const f = stats.totalFlights;
  let flightsCopy = "You've practically moved in. The ramp guys wave to you by name.";
  if (f < 10) flightsCopy = "Quality over quantity.";
  else if (f < 50) flightsCopy = "Building up that logbook one page at a time.";

  return { hoursCopy, flightsCopy };
};

export const getPage2Copy = (stats: CalculatedStats) => {
  if (stats.hasInternational) return "Mr. Worldwide. Crossing borders and collecting stamps.";
  const max = stats.longestFlight;
  if (max < 100) return "The Local Legend. You know your practice area like the back of your hand.";
  if (max > 500) return "The Cross-Country Cruiser. You definitely got your money's worth out of the autopilot.";
  return "Exploring the grid. A solid mix of local hops and cross-country adventures.";
};

export const getPage3Copy = (stats: CalculatedStats) => {
  const x = stats.uniqueAircraftTypes;
  const y = stats.uniqueTailNumbers;
  if (x === 1 && y === 1) return "A true loyalist. Monogamy is alive and well in aviation.";
  if (x === 1 && y > 3) return "Loyal to the airframe, but not the tail. A true master of the rental fleet.";
  if (x >= 5) return "Test pilot vibes. The Swiss Army Knife of aviators.";
  if (x >= 3 && y > 5) return "Aviation promiscuity at its finest. You'll fly anything with wings.";
  return "You flew a respectable variety of aircraft this year.";
};

export const getPage4Copy = (stats: CalculatedStats) => {
  const dist = stats.totalDistanceNm;
  let distCopy = "You literally flew the equivalent of a lap around the globe.";
  if (dist < 100) distCopy = "Just warming up the oil. Did you even leave the traffic pattern?";
  else if (dist < 250) distCopy = "Enough to cross the county line and grab a $100 hamburger.";
  else if (dist < 500) distCopy = "Enough to drive across the state... but way cooler, and without the traffic.";
  else if (dist < 750) distCopy = "A solid regional tour. You're definitely getting use out of that autopilot.";
  else if (dist < 1500) distCopy = "Serious mileage. That's roughly a road trip from LA to Chicago, as the crow flies.";
  else if (dist < 2500) distCopy = "You're racking up the miles and traversing time zones on the regular.";
  else if (dist < 10800) distCopy = `That’s enough to fly coast-to-coast across the US ${Math.floor(dist/2500)} times.`;
  else if (dist < 21600) distCopy = "That's more than halfway around the entire Earth!";

  const days = Math.floor(stats.totalHours / 24);
  const hours = (stats.totalHours % 24).toFixed(1);
  return { distCopy, days, hours };
};

export const getPage5Copy = (stats: CalculatedStats) => {
  const short = stats.shortestFlight;
  let shortCopy = "Short hops aren't your style. Once the wheels leave the ground, you're up there to stay.";
  if (short <= 0.1) shortCopy = "One lap around the pattern. Was that a maintenance check or just a touch-and-go?";
  else if (short <= 0.3) shortCopy = "Just checking if gravity still works? (Pattern work champion).";
  else if (short <= 0.5) shortCopy = "A quick hop to the neighbor's runway. Barely enough time to tune the ATIS.";
  else if (short <= 1.0) shortCopy = "The classic $100 hamburger run?";

  const long = stats.longestFlight;
  let longCopy = "Bladder of steel. We hope you brought empty Gatorade bottles.";
  if (long < 100) longCopy = "Keeping it local. A scenic hop.";
  else if (long < 300) longCopy = "A proper cross-country adventure.";

  return { shortCopy, longCopy };
};

export const getPage6Copy = (stats: CalculatedStats) => {
  const ratio = stats.totalHours > 0 ? stats.totalLandings / stats.totalHours : 0;
  let ratioCopy = "A perfectly balanced diet of cruising and landing.";
  if (ratio >= 3.0) ratioCopy = "Bounce much? You spent more time in the traffic pattern than an aggressive mosquito.";
  else if (ratio <= 0.5) ratioCopy = "Gear up, autopilot on. You hate landing and love cruising.";

  const apts = stats.uniqueAirports;
  let aptsCopy = "The Nomad. You’re collecting airport identifiers like Pokémon cards.";
  if (apts <= 3) aptsCopy = "The Homebody. You know what you like.";
  else if (apts <= 15) aptsCopy = "The Explorer. Broadening your horizons.";

  return { ratioCopy, aptsCopy, ratio: ratio.toFixed(1) };
};

export const getPage7Copy = (stats: CalculatedStats) => {
  const n = stats.totalNight;
  let nightCopy = "Vampire mode: ON. You probably log more time under the stars than the sun.";
  if (n === 0) nightCopy = "Strictly a day-walker. Sun goes down, gear goes down.";
  else if (n <= 2) nightCopy = "Just enough to keep your night currency from expiring... barely.";
  else if (n <= 10) nightCopy = "You dabble in the dark arts when the daytime thermals get too bumpy.";
  else if (n <= 25) nightCopy = "Comfortable in the dark. You know the best illuminated wind socks in the state.";

  const i = stats.totalIMC;
  let imcCopy = "Ice water in your veins. The local approach controllers know your voice.";
  if (i === 0) imcCopy = "Fair-weather flyer. We respect the personal minimums.";
  else if (i <= 5) imcCopy = "Poking holes in the clouds.";

  const f = stats.estimatedFuelBurn;
  let fuelCopy = "You single-handedly funded the FBO's new espresso machine.";
  if (f < 100) fuelCopy = "Eco-friendly. Greta Thunberg might actually approve of this logbook.";
  else if (f < 1000) fuelCopy = "Keeping the local fuel truck in business.";

  return { nightCopy, imcCopy, fuelCopy };
};