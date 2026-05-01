import { create } from 'zustand';
import { FlightRecord, CalculatedStats, AirportDB } from '../core/types';
import { parseLogbookCSV } from '../core/Parser';
import { calculateStats } from '../core/MathEngine';

export type DateFilterType = 'this_year' | 'last_year' | 'all_time' | 'custom' | 'milestone' | 'yoy';

export interface DateFilter {
  type: DateFilterType;
  start?: string;
  end?: string;
  label?: string; 
  year1?: string; 
  year2?: string; 
}

export interface LogbookDataset {
  id: string;
  fileName: string;
  ownerName?: string;
  rawFlights: FlightRecord[];
  flights: FlightRecord[];
  stats: CalculatedStats | null;
}

export interface CommunityAverages {
  flight_time: string | number;
  flights: string | number;
  distance: string | number;
  landings: string | number;
  night_hours: string | number;
}

interface LogbookState {
  hasSharedCommunityStats: boolean;
  setHasSharedCommunityStats: (val: boolean) => void;
  communityAverages: CommunityAverages | null;
  setCommunityAverages: (avgs: CommunityAverages | null) => void;
  datasets: LogbookDataset[];
  rawFlights: FlightRecord[]; // Exposed globally for cross-linking
  flights: FlightRecord[];
  stats: CalculatedStats | null;
  comparisonStats: CalculatedStats | null;
  airportDB: AirportDB | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string | null;
  dateFilter: DateFilter;
  isDemo: boolean;
  setIsDemo: (val: boolean) => void;
  setDateFilter: (filter: DateFilter) => void;
  processFiles: (files: File[], bypassConfig?: boolean) => Promise<void>;
  resetStore: () => void;
  applyFilterAndCalculate: () => void;
}

export const useLogbookStore = create<LogbookState>((set, get) => ({
  datasets: [],
  rawFlights: [],
  flights: [],
  airportDB: null,
  stats: null,
  comparisonStats: null,
  status: 'idle',
  errorMessage: null,
  dateFilter: { type: 'this_year' },
  isDemo: false,
  hasSharedCommunityStats: false,
  communityAverages: null,

  setCommunityAverages: (avgs) => set({ communityAverages: avgs }),
  setHasSharedCommunityStats: (val) => set({ hasSharedCommunityStats: val }),
  setIsDemo: (val) => set({ 
    isDemo: val,
    hasSharedCommunityStats: val,
    communityAverages: val ? {
      flight_time: 145.5,
      flights: 112,
      distance: 12500,
      landings: 154,
      night_hours: 18.2
    } : null 
  }),

  setDateFilter: (filter) => {
    set({ dateFilter: filter });
  },

  applyFilterAndCalculate: () => {
    const { datasets, dateFilter, airportDB, rawFlights: globalRawFlights } = get();
    if (!airportDB || datasets.length === 0) return;

    const currentYear = new Date().getFullYear();
    
    // Always pull from the pure global rawFlights to prevent dataset filtering corruption
    const baseFlights = globalRawFlights.length > 0 ? globalRawFlights : datasets[0].rawFlights;
    const dsBase = datasets[0]; // Used just to copy over the base properties like fileName

    if (dateFilter.type === 'yoy') {
      const inputY1 = parseInt(dateFilter.year1 || currentYear.toString());
      const inputY2 = parseInt(dateFilter.year2 || (currentYear - 1).toString());

      // UX Fix: Always force the older year to be Year 1 (Left) and the newer to be Year 2 (Right)
      const y1 = Math.min(inputY1, inputY2);
      const y2 = Math.max(inputY1, inputY2);

      const f1 = baseFlights.filter(f => !isNaN(new Date(f.date).getTime()) && new Date(f.date).getFullYear() === y1);
      const f2 = baseFlights.filter(f => !isNaN(new Date(f.date).getTime()) && new Date(f.date).getFullYear() === y2);

      const stats1 = f1.length > 0 ? calculateStats(f1, airportDB) : null;
      const stats2 = f2.length > 0 ? calculateStats(f2, airportDB) : null;

      if (!stats1 && !stats2) {
        set({ status: 'error', errorMessage: `No flights found in ${y1} or ${y2}. A Growth Report requires flights logged in both years.` });
        return;
      } else if (!stats1) {
        set({ status: 'error', errorMessage: `No flights found in ${y1}. A Growth Report requires flights logged in both years.` });
        return;
      } else if (!stats2) {
        set({ status: 'error', errorMessage: `No flights found in ${y2}. A Growth Report requires flights logged in both years.` });
        return;
      }

      set({
        datasets: [
          { ...dsBase, id: 'yoy1', ownerName: y1.toString(), flights: f1, stats: stats1, rawFlights: baseFlights },
          { ...dsBase, id: 'yoy2', ownerName: y2.toString(), flights: f2, stats: stats2, rawFlights: baseFlights }
        ],
        rawFlights: baseFlights,
        flights: f1,
        stats: stats1,
        status: 'success'
      });
      return;
    }

    const startTs = dateFilter.start ? new Date(dateFilter.start).getTime() : 0;
    const endTs = dateFilter.end ? new Date(dateFilter.end).getTime() : Infinity;

    const filtered = baseFlights.filter(f => {
      const flightDate = new Date(f.date);
      const flightTime = flightDate.getTime();
      if (isNaN(flightTime)) return false;

      switch (dateFilter.type) {
        case 'this_year': return flightDate.getFullYear() === currentYear;
        case 'last_year': return flightDate.getFullYear() === currentYear - 1;
        case 'all_time': return true;
        case 'custom':
        case 'milestone':
          return flightTime >= startTs && flightTime <= endTs;
        default: return true;
      }
    });

    if (filtered.length === 0) {
      set({ status: 'error', errorMessage: 'No flights found in this date range.' });
      return;
    }

    const computedStats = calculateStats(filtered, airportDB);

    let comparisonStats: CalculatedStats | null = null;
    let targetYear: number | null = null;

    if (dateFilter.type === 'this_year') targetYear = currentYear;
    else if (dateFilter.type === 'last_year') targetYear = currentYear - 1;
    else if (dateFilter.type === 'custom' && dateFilter.start?.endsWith('-01-01') && dateFilter.end?.endsWith('-12-31')) {
      const startY = parseInt(dateFilter.start.substring(0, 4));
      const endY = parseInt(dateFilter.end.substring(0, 4));
      if (startY === endY) targetYear = startY;
    }

    if (targetYear !== null) {
      const compYear = targetYear - 1;
      const compFlights = baseFlights.filter(f => {
        const d = new Date(f.date);
        return !isNaN(d.getTime()) && d.getFullYear() === compYear;
      });
      if (compFlights.length > 0) {
        comparisonStats = calculateStats(compFlights, airportDB);
      }
    }

    set({ 
      datasets: [{
        ...dsBase,
        id: crypto.randomUUID(),
        ownerName: undefined, 
        flights: filtered,
        stats: computedStats,
        rawFlights: baseFlights
      }],
      rawFlights: baseFlights,
      flights: filtered, 
      stats: computedStats, 
      comparisonStats,
      status: 'success' 
    });
  },

  processFiles: async (files: File[], bypassConfig?: boolean) => {
    set({ status: 'loading', errorMessage: null });
    try {
      let airportDB = get().airportDB;
      if (!airportDB) {
        const res = await fetch('/airports-min.json');
        if (!res.ok) throw new Error('Failed to load local airport database');
        airportDB = await res.json();
      }

      const newDatasets: LogbookDataset[] = [];
      
      for (const file of files) {
        const { flights: parsedFlights, efb } = await parseLogbookCSV(file);
        
        window.umami?.track('Logbook Uploaded', { 
          flight_count: parsedFlights.length 
        });

        // Silently ping backend for generation tracking
        fetch('/api/generations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isDemo: get().isDemo, efbType: efb })
        }).catch(() => {}); // Silently ignore failures to avoid breaking the UI

        newDatasets.push({
          id: crypto.randomUUID(),
          fileName: file.name,
          rawFlights: parsedFlights,
          flights: [],
          stats: null
        });
      }
      
      set({ datasets: newDatasets, airportDB });
      
      if (bypassConfig) {
        get().applyFilterAndCalculate();
      } else {
        set({ status: 'success' });
      }
      
    } catch (error: any) {
      set({ status: 'error', errorMessage: error.message || 'Error processing files' });
    }
  },

  resetStore: () => set({ datasets: [], rawFlights: [], flights: [], stats: null, comparisonStats: null, status: 'idle', errorMessage: null, dateFilter: { type: 'this_year' }, isDemo: false, hasSharedCommunityStats: false, communityAverages: null })
}));