import { create } from 'zustand';
import { FlightRecord, CalculatedStats, AirportDB } from '../core/types';
import { parseLogbookCSV } from '../core/Parser';
import { calculateStats } from '../core/MathEngine';

// crypto.randomUUID() is not available in Safari < 15.4
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback RFC 4122 v4 UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

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

// Percentile rank in the same year + size bucket, expressed as
// "Top X% of pilots by flight_time" (1 = best, 100 = worst). Null when the
// pool is too small (< 5 contributors) to be meaningful.
export type CommunityPercentile = number | null;

interface LogbookState {
  hasSharedCommunityStats: boolean;
  setHasSharedCommunityStats: (val: boolean) => void;
  communityAverages: CommunityAverages | null;
  setCommunityAverages: (avgs: CommunityAverages | null) => void;
  communityPercentile: CommunityPercentile;
  setCommunityPercentile: (pct: CommunityPercentile) => void;
  datasets: LogbookDataset[];
  rawFlights: FlightRecord[];
  flights: FlightRecord[];
  stats: CalculatedStats | null;
  comparisonStats: CalculatedStats | null;
  airportDB: AirportDB | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string | null;
  dateFilter: DateFilter;
  isDemo: boolean;
  setIsDemo: (val: boolean) => void;
  // True when the current session was hydrated from a /s#... share link. In
  // shared view we hide the community tollbooth, the export modal, and any
  // CTA that would require the viewer's own logbook.
  isSharedView: boolean;
  setDateFilter: (filter: DateFilter) => void;
  processFiles: (files: File[], bypassConfig?: boolean) => Promise<void>;
  resetStore: () => void;
  applyFilterAndCalculate: () => void;
  /** Hydrate the store from a decoded CalculatedStats (shared-link viewer). */
  hydrateFromShared: (stats: CalculatedStats) => void;
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
  isSharedView: false,
  hasSharedCommunityStats: false,
  communityAverages: null,
  communityPercentile: null,

  setCommunityAverages: (avgs) => set({ communityAverages: avgs }),
  setHasSharedCommunityStats: (val) => set({ hasSharedCommunityStats: val }),
  setCommunityPercentile: (pct) => set({ communityPercentile: pct }),
  setIsDemo: (val) => set({ 
    isDemo: val,
    hasSharedCommunityStats: val,
    communityAverages: val ? {
      flight_time: 145.5,
      flights: 112,
      distance: 12500,
      landings: 154,
      night_hours: 18.2
    } : null,
    communityPercentile: val ? 18 : null,
  }),

  setDateFilter: (filter) => {
    set({ dateFilter: filter });
  },

  applyFilterAndCalculate: () => {
    const { datasets, dateFilter, airportDB, rawFlights: globalRawFlights } = get();
    if (!airportDB || datasets.length === 0) return;

    const currentYear = new Date().getFullYear();
    
    // Always source from global rawFlights to avoid double-filtering on re-runs
    const baseFlights = globalRawFlights.length > 0 ? globalRawFlights : datasets[0].rawFlights;
    const dsBase = datasets[0];

    if (dateFilter.type === 'yoy') {
      const inputY1 = parseInt(dateFilter.year1 || currentYear.toString());
      const inputY2 = parseInt(dateFilter.year2 || (currentYear - 1).toString());

      // Normalize order so the older year is always Year 1 (left) regardless of user selection
      const y1 = Math.min(inputY1, inputY2);
      const y2 = Math.max(inputY1, inputY2);

      const allYears = Array.from({ length: y2 - y1 + 1 }, (_, i) => y1 + i);
      const yearDatasets: LogbookDataset[] = [];
      const missingYears: number[] = [];

      for (const yr of allYears) {
        const flights = baseFlights.filter(f => !isNaN(new Date(f.date).getTime()) && new Date(f.date).getFullYear() === yr);
        if (flights.length === 0) {
          missingYears.push(yr);
        } else {
          yearDatasets.push({
            ...dsBase,
            id: `yoy${yr}`,
            ownerName: yr.toString(),
            flights,
            stats: calculateStats(flights, airportDB),
            rawFlights: baseFlights
          });
        }
      }

      if (yearDatasets.length < 2) {
        set({ status: 'error', errorMessage: `Not enough years with data in the range ${y1}–${y2}. A Growth Report requires flights in at least two years.` });
        return;
      }

      if (missingYears.length > 0) {
        console.warn(`YOY: no flights found in year(s) ${missingYears.join(', ')} — skipped.`);
      }

      set({
        datasets: yearDatasets,
        rawFlights: baseFlights,
        flights: yearDatasets[0].flights,
        stats: yearDatasets[0].stats,
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
        id: generateId(),
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

        // Fire-and-forget telemetry — aborted after 5 s to avoid lingering requests
        const genAbort = new AbortController();
        setTimeout(() => genAbort.abort(), 5000);
        fetch('/api/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-App-Token': import.meta.env.VITE_API_TOKEN ?? '',
          },
          body: JSON.stringify({ isDemo: get().isDemo, efbType: efb }),
          signal: genAbort.signal,
        }).catch(() => {}); // Never break the upload flow

        newDatasets.push({
          id: generateId(),
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

  hydrateFromShared: (sharedStats) => {
    // Mirror the shape processFiles would have produced so downstream pages
    // render identically. We skip the dataset/rawFlights plumbing because a
    // viewer never re-filters the data; they see the sender's snapshot.
    set({
      datasets: [],
      rawFlights: [],
      flights: [],
      stats: sharedStats,
      comparisonStats: null,
      status: 'success',
      errorMessage: null,
      isDemo: false,
      isSharedView: true,
      // A shared link already represents a chosen window, so the community
      // card is meaningless, so suppress it by marking "already shared" locally.
      hasSharedCommunityStats: true,
      communityAverages: null,
      communityPercentile: null,
    });
  },
  resetStore: () => set({ datasets: [], rawFlights: [], flights: [], stats: null, comparisonStats: null, status: 'idle', errorMessage: null, dateFilter: { type: 'this_year' }, isDemo: false, isSharedView: false, hasSharedCommunityStats: false, communityAverages: null, communityPercentile: null })
}));