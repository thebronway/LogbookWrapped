import { create } from 'zustand';
import { FlightRecord, CalculatedStats } from '../core/types';
import { parseLogbookCSV } from '../core/Parser';
import { calculateStats } from '../core/MathEngine';

interface LogbookState {
  flights: FlightRecord[];
  stats: CalculatedStats | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string | null;
  processFile: (file: File) => Promise<void>;
  resetStore: () => void;
}

export const useLogbookStore = create<LogbookState>((set) => ({
  flights: [],
  stats: null,
  status: 'idle',
  errorMessage: null,

  processFile: async (file: File) => {
    set({ status: 'loading', errorMessage: null });
    try {
      const parsedFlights = await parseLogbookCSV(file);
      const computedStats = calculateStats(parsedFlights);
      
      set({ 
        flights: parsedFlights, 
        stats: computedStats, 
        status: 'success' 
      });
    } catch (error: any) {
      set({ status: 'error', errorMessage: error.message || 'Error processing CSV' });
    }
  },

  resetStore: () => set({ flights: [], stats: null, status: 'idle', errorMessage: null })
}));