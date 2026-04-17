import Papa from 'papaparse';
import { normalizeFlightData } from './Normalizer';
import { FlightRecord } from './types';

export const parseLogbookCSV = (file: File): Promise<FlightRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return reject(new Error("File is empty"));

      // --- DEBUGGING: Detect EFB Format ---
      let detectedEFB = "Unknown";
      if (text.includes('ForeFlight')) {
        detectedEFB = "ForeFlight";
      } else if (text.includes('Garmin') || text.includes('flyGarmin')) {
        detectedEFB = "Garmin Pilot";
      } else if (text.includes('LogTen')) {
        detectedEFB = "LogTen Pro";
      } else if (text.includes('MyFlightbook') || text.includes('myflightbook')) {
        detectedEFB = "MyFlightbook";
      }
      console.log(`[Parser] Detected EFB Format: ${detectedEFB}`);
      // ------------------------------------

      let csvTextToParse = text;
      const preParsedAircraftMap: Record<string, string> = {};

      // Slice off everything above the actual flight logs
      if (text.includes('ForeFlight Logbook Import') || text.includes('Aircraft Table')) {
        const aircraftTableStart = text.indexOf('AircraftID,TypeCode');
        const flightsMarker = 'Date,AircraftID';
        const flightHeaderIndex = text.indexOf(flightsMarker);
        
        // Extract the aircraft types from the ForeFlight metadata header before slicing
        if (aircraftTableStart !== -1 && flightHeaderIndex !== -1 && aircraftTableStart < flightHeaderIndex) {
          const aircraftTableText = text.substring(aircraftTableStart, flightHeaderIndex);
          const lines = aircraftTableText.split('\n');
          lines.forEach(line => {
            const cols = line.split(',');
            // Map column 0 (Tail) to column 1 (Type)
            if (cols.length >= 2 && cols[0] !== 'AircraftID') {
              const tail = cols[0].trim();
              let type = cols[1].trim();
              if (tail && type) preParsedAircraftMap[tail] = type.replace(/["']/g, "");
            }
          });
        }

        if (flightHeaderIndex !== -1) {
          csvTextToParse = text.substring(flightHeaderIndex);
        }
      }

      Papa.parse(csvTextToParse, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const normalized = normalizeFlightData(results.data, preParsedAircraftMap);
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