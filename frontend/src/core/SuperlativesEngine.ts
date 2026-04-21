export interface SuperlativeTracker {
  aircraftTypes: Set<string>;
  tailNumbers: Set<string>;
  departureCounts: Record<string, number>;
  aircraftTypeCounts: Record<string, number>;
  tailNumberCounts: Record<string, number>;
  routeCounts: Record<string, number>;
  destLandings: Record<string, number>;
  monthStats: Record<string, { flights: number, hours: number }>;
}

export const createSuperlativeTracker = (): SuperlativeTracker => ({
  aircraftTypes: new Set(),
  tailNumbers: new Set(),
  departureCounts: {},
  aircraftTypeCounts: {},
  tailNumberCounts: {},
  routeCounts: {},
  destLandings: {},
  monthStats: {}
});

export const getWinners = (tracker: SuperlativeTracker) => {
  const mostUsedAirframe = Object.keys(tracker.aircraftTypeCounts).reduce((a, b) => 
    tracker.aircraftTypeCounts[a] > tracker.aircraftTypeCounts[b] ? a : b
  , "Unknown");
  
  const mostUsedTailNumber = Object.keys(tracker.tailNumberCounts).reduce((a, b) => 
    tracker.tailNumberCounts[a] > tracker.tailNumberCounts[b] ? a : b
  , "Unknown");
  
  const favoriteRoute = Object.keys(tracker.routeCounts).reduce((a, b) =>
    tracker.routeCounts[a] > tracker.routeCounts[b] ? a : b
  , "None");

  const homeBase = Object.keys(tracker.departureCounts).reduce((a, b) => 
    tracker.departureCounts[a] > tracker.departureCounts[b] ? a : b
  , "Unknown");

  const busiestMonthKey = Object.keys(tracker.monthStats).reduce((a, b) => {
    if (!a) return b;
    const statA = tracker.monthStats[a];
    const statB = tracker.monthStats[b];
    if (statA.flights > statB.flights) return a;
    if (statB.flights > statA.flights) return b;
    return statA.hours > statB.hours ? a : b;
  }, "");

  let busiestMonth = 'Unknown';
  if (busiestMonthKey && busiestMonthKey.includes('-')) {
    const [year, month] = busiestMonthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    if (!isNaN(date.getTime())) {
      busiestMonth = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
  }

  return {
    uniqueAircraftTypes: tracker.aircraftTypes.size,
    uniqueTailNumbers: tracker.tailNumbers.size,
    mostUsedAirframe,
    mostUsedAirframeCount: tracker.aircraftTypeCounts[mostUsedAirframe] || 0,
    mostUsedTailNumber,
    mostUsedTailNumberCount: tracker.tailNumberCounts[mostUsedTailNumber] || 0,
    favoriteRoute,
    favoriteRouteCount: tracker.routeCounts[favoriteRoute] || 0,
    homeBase,
    homeBaseLandings: tracker.destLandings[homeBase] || 0,
    busiestMonth,
    activeMonths: Object.keys(tracker.monthStats).length
  };
};