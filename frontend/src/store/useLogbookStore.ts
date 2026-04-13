import { create } from 'zustand';
import { FlightRecord, CalculatedStats, AirportDB } from '../core/types';
import { parseLogbookCSV } from '../core/Parser';
import { calculateStats } from '../core/MathEngine';

export type DateFilterType = 'this_year' | 'last_year' | 'all_time' | 'custom';

export interface DateFilter {
  type: DateFilterType;
  start?: string;
  end?: string;
}

interface LogbookState {
  rawFlights: FlightRecord[];
  flights: FlightRecord[];
  airportDB: AirportDB | null;
  stats: CalculatedStats | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string | null;
  dateFilter: DateFilter;
  setDateFilter: (filter: DateFilter) => void;
  processFile: (file: File) => Promise<void>;
  resetStore: () => void;
  applyFilterAndCalculate: () => void;
}

export const useLogbookStore = create<LogbookState>((set, get) => ({
  rawFlights: [],
  flights: [],
  airportDB: null,
  stats: null,
  status: 'idle',
  errorMessage: null,
  dateFilter: { type: 'this_year' },

  setDateFilter: (filter) => {
    set({ dateFilter: filter });
    if (get().rawFlights.length > 0) {
      get().applyFilterAndCalculate();
    }
  },

  applyFilterAndCalculate: () => {
    const { rawFlights, dateFilter, airportDB } = get();
    if (!airportDB) return;

    const currentYear = new Date().getFullYear();

    const filtered = rawFlights.filter(f => {
      const d = new Date(f.date);
      if (isNaN(d.getTime())) return false;

      if (dateFilter.type === 'this_year') return d.getFullYear() === currentYear;
      if (dateFilter.type === 'last_year') return d.getFullYear() === currentYear - 1;
      if (dateFilter.type === 'all_time') return true;
      if (dateFilter.type === 'custom') {
        const start = dateFilter.start ? new Date(dateFilter.start) : new Date(0);
        const end = dateFilter.end ? new Date(dateFilter.end) : new Date();
        end.setHours(23, 59, 59, 999); // Include the entire end day
        return d >= start && d <= end;
      }
      return true;
    });

    if (filtered.length === 0) {
      set({ status: 'error', errorMessage: 'No flights found in this date range.' });
      return;
    }

    const computedStats = calculateStats(filtered, airportDB);
    set({ flights: filtered, stats: computedStats, status: 'success' });
  },

  processFile: async (file: File) => {
    set({ status: 'loading', errorMessage: null });
    try {
      const res = await fetch('/airports-min.json');
      if (!res.ok) throw new Error('Failed to load local airport database');
      const airportDB = await res.json();

      const parsedFlights = await parseLogbookCSV(file);
      
      set({ rawFlights: parsedFlights, airportDB });
      get().applyFilterAndCalculate();
    } catch (error: any) {
      set({ status: 'error', errorMessage: error.message || 'Error processing CSV' });
    }
  },

  resetStore: () => set({ rawFlights: [], flights: [], stats: null, status: 'idle', errorMessage: null })
}));