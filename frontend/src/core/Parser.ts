import Papa from 'papaparse';
import { normalizeFlightData, detectEFBProfile } from './Normalizer';
import { FlightRecord } from './types';

export const parseLogbookCSV = (file: File): Promise<{flights: FlightRecord[], efb: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        window.umami?.track('Parse Failed', { error_message: 'File is empty' });
        return reject(new Error("File is empty"));
      }

      const firstLine = text.split('\n')[0] || "";
      const headersForDetection = firstLine.split(',').map(h => h.trim().replace(/["']/g, ""));
      const { name: detectedEFB } = detectEFBProfile(headersForDetection);
      
      console.log(`[Parser] Detected EFB Format: ${detectedEFB}`);
      window.umami?.track('Logbook Parsed', { efb_type: detectedEFB });

      let csvTextToParse = text;
      const preParsedAircraftMap: Record<string, string> = {};

      // ForeFlight exports include a metadata header and aircraft table above the flight log.
      // We extract the aircraft type map from that header before slicing it off.
      if (text.includes('ForeFlight Logbook Import') || text.includes('Aircraft Table')) {
        const aircraftTableStart = text.indexOf('AircraftID,TypeCode');
        const flightsMarker = 'Date,AircraftID';
        const flightHeaderIndex = text.indexOf(flightsMarker);
        
        if (aircraftTableStart !== -1 && flightHeaderIndex !== -1 && aircraftTableStart < flightHeaderIndex) {
          const aircraftTableText = text.substring(aircraftTableStart, flightHeaderIndex);
          const lines = aircraftTableText.split('\n');
          lines.forEach(line => {
            const cols = line.split(',');
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
          if (results.data.length === 0) {
            window.umami?.track('Parse Failed', { error_message: 'CSV contains no flight rows' });
            return reject(new Error("The CSV was parsed but contains no flight rows."));
          }
          
          const headers = Object.keys(results.data[0] as object);
          if (!headers.some(h => h.toLowerCase().includes('date'))) {
            window.umami?.track('Parse Failed', { error_message: 'Missing Date column' });
            return reject(new Error("Missing required 'Date' column. Ensure you exported a flight log, not an aircraft list."));
          }

          try {
            const normalized = normalizeFlightData(results.data, preParsedAircraftMap);
            resolve({ flights: normalized, efb: detectedEFB });
          } catch (error) {
            const errMsg = error instanceof Error ? error.message : 'Invalid CSV structure';
            window.umami?.track('Parse Failed', { error_message: `Normalization Error: ${errMsg}` });
            reject(new Error(`Normalization Error: ${errMsg}`));
          }
        },
        error: (error: Error) => {
          window.umami?.track('Parse Failed', { error_message: `PapaParse Error: ${error.message}` });
          reject(error);
        }
      });
    };

    reader.onerror = () => {
      window.umami?.track('Parse Failed', { error_message: 'FileReader failed to read the file' });
      reject(new Error("Failed to read the file."));
    };
    reader.readAsText(file); 
  });
};