import Papa from 'papaparse';
import { normalizeFlightData } from './Normalizer';
import { FlightRecord } from './types';

export const parseLogbookCSV = (file: File): Promise<FlightRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return reject(new Error("File is empty"));

      let csvTextToParse = text;

      // Slice off everything above the actual flight logs
      if (text.includes('ForeFlight Logbook Import') || text.includes('Aircraft Table')) {
        const flightsMarker = 'Date,AircraftID';
        const flightHeaderIndex = text.indexOf(flightsMarker);
        
        if (flightHeaderIndex !== -1) {
          csvTextToParse = text.substring(flightHeaderIndex);
        }
      }

      Papa.parse(csvTextToParse, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const normalized = normalizeFlightData(results.data);
            resolve(normalized);
          } catch (error) {
            console.error(error);
            reject(new Error("Failed to normalize flight data. Check CSV format."));
          }
        },
        error: (error: any) => {
          reject(error);
        }
      });
    };

    reader.onerror = () => reject(new Error("Failed to read the file."));
    reader.readAsText(file); 
  });
};