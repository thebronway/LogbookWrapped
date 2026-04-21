export interface AircraftProfile {
  gph: number;
  speed: number;
  type: 'small' | 'medium' | 'large' | 'experimental' | 'unknown';
}

export const AIRCRAFT_PROFILES: Record<string, AircraftProfile> = {
  // === SMALL: PISTON SINGLE & TWIN ===
  "J3":   { gph: 4.5,  speed: 65,  type: 'small' },   // Piper J-3 Cub
  "C150": { gph: 5.5,  speed: 90,  type: 'small' },   // Cessna 150
  "C152": { gph: 6.0,  speed: 90,  type: 'small' },   // Cessna 152
  "DA20": { gph: 6.0,  speed: 110, type: 'small' },  // Diamond DA20 Katana
  "AA5":  { gph: 8.5,  speed: 120, type: 'small' },  // Grumman Cheetah/Tiger
  "C172": { gph: 9.0,  speed: 110, type: 'small' },  // Cessna 172 Skyhawk
  "PA28": { gph: 10.0, speed: 115, type: 'small' },  // Piper Cherokee/Archer/Warrior
  "M20T": { gph: 11.0, speed: 170, type: 'small' },  // Mooney M20
  "SR20": { gph: 11.0, speed: 145, type: 'small' },  // Cirrus SR20
  "DA40": { gph: 9.0,  speed: 135, type: 'small' },  // Diamond DA40
  "C177": { gph: 10.0, speed: 125, type: 'small' },  // Cessna 177 Cardinal
  "DA42": { gph: 12.0, speed: 150, type: 'small' },  // Diamond DA42 (Twin)
  "C182": { gph: 13.0, speed: 140, type: 'small' },  // Cessna 182 Skylane
  "SR22": { gph: 14.5, speed: 180, type: 'small' },  // Cirrus SR22
  "PA32": { gph: 15.0, speed: 155, type: 'small' },  // Piper Saratoga/Cherokee Six
  "BE36": { gph: 15.0, speed: 165, type: 'small' },  // Beechcraft Bonanza
  "C206": { gph: 16.0, speed: 140, type: 'small' },  // Cessna 206 Stationair
  "C210": { gph: 16.5, speed: 170, type: 'small' },  // Cessna 210 Centurion
  "PA34": { gph: 18.0, speed: 160, type: 'small' },  // Piper Seneca (Twin)
  "PA44": { gph: 20.0, speed: 155, type: 'small' },  // Piper Seminole (Twin)
  "BE58": { gph: 32.0, speed: 180, type: 'small' },  // Beechcraft Baron (Twin)
  "C310": { gph: 32.0, speed: 190, type: 'small' },  // Cessna 310 (Twin)

  // === MEDIUM: TURBOPROPS & LIGHT/MID JETS ===
  "PA46": { gph: 35.0,  speed: 200, type: 'medium' }, // Piper Malibu/Meridian
  "C208": { gph: 45.0,  speed: 170, type: 'medium' }, // Cessna Caravan
  "SF50": { gph: 60.0,  speed: 300, type: 'medium' }, // Cirrus Vision Jet
  "TBM8": { gph: 60.0,  speed: 315, type: 'medium' }, // Daher TBM 850
  "TBM9": { gph: 60.0,  speed: 315, type: 'medium' }, // Daher TBM 900 series
  "PC12": { gph: 65.0,  speed: 270, type: 'medium' }, // Pilatus PC-12
  "BE20": { gph: 100.0, speed: 270, type: 'medium' }, // Beechcraft King Air 200
  "B350": { gph: 125.0, speed: 300, type: 'medium' }, // Beechcraft King Air 350
  "C510": { gph: 100.0, speed: 330, type: 'medium' }, // Cessna Citation Mustang
  "C25A": { gph: 120.0, speed: 400, type: 'medium' }, // Cessna Citation CJ3
  "B190": { gph: 160.0, speed: 280, type: 'medium' }, // Beechcraft 1900D
  "E55P": { gph: 183.0, speed: 440, type: 'medium' }, // Embraer Phenom 300
  "PC24": { gph: 190.0, speed: 420, type: 'medium' }, // Pilatus PC-24
  "LJ45": { gph: 210.0, speed: 440, type: 'medium' }, // Learjet 45
  "LJ60": { gph: 260.0, speed: 440, type: 'medium' }, // Learjet 60
  "CL60": { gph: 255.0, speed: 450, type: 'medium' }, // Challenger 604
  "GLF4": { gph: 400.0, speed: 480, type: 'medium' }, // Gulfstream IV
  "C750": { gph: 425.0, speed: 500, type: 'medium' }, // Cessna Citation X
  "GLF6": { gph: 450.0, speed: 480, type: 'medium' }, // Gulfstream G650
  "GL5T": { gph: 500.0, speed: 480, type: 'medium' }, // Bombardier Global 5000/7500

  // === LARGE: COMMERCIAL AIRLINERS ===
  "CRJ2": { gph: 320.0,  speed: 450, type: 'large' }, // Bombardier CRJ-200
  "E145": { gph: 350.0,  speed: 450, type: 'large' }, // Embraer ERJ-145
  "E170": { gph: 400.0,  speed: 460, type: 'large' }, // Embraer E170
  "CRJ9": { gph: 450.0,  speed: 460, type: 'large' }, // Bombardier CRJ-900
  "E175": { gph: 450.0,  speed: 460, type: 'large' }, // Embraer E175
  "E190": { gph: 550.0,  speed: 470, type: 'large' }, // Embraer E190
  "BCS3": { gph: 650.0,  speed: 470, type: 'large' }, // Airbus A220-300
  "B38M": { gph: 670.0,  speed: 450, type: 'large' }, // Boeing 737 MAX 8
  "B737": { gph: 800.0,  speed: 450, type: 'large' }, // Boeing 737-700
  "A319": { gph: 800.0,  speed: 450, type: 'large' }, // Airbus A319
  "A320": { gph: 850.0,  speed: 450, type: 'large' }, // Airbus A320
  "B738": { gph: 900.0,  speed: 450, type: 'large' }, // Boeing 737-800
  "A321": { gph: 950.0,  speed: 450, type: 'large' }, // Airbus A321
  "B739": { gph: 980.0,  speed: 450, type: 'large' }, // Boeing 737-900
  "MD88": { gph: 1000.0, speed: 440, type: 'large' }, // McDonnell Douglas MD-88
  "B752": { gph: 1100.0, speed: 460, type: 'large' }, // Boeing 757-200
  "B753": { gph: 1150.0, speed: 460, type: 'large' }, // Boeing 757-300
  "B763": { gph: 1600.0, speed: 460, type: 'large' }, // Boeing 767-300
  "A359": { gph: 1600.0, speed: 480, type: 'large' }, // Airbus A350-900 
  "A332": { gph: 1700.0, speed: 470, type: 'large' }, // Airbus A330-200
  "B788": { gph: 1650.0, speed: 480, type: 'large' }, // Boeing 787-8 Dreamliner
  "B789": { gph: 1700.0, speed: 480, type: 'large' }, // Boeing 787-9 Dreamliner
  "A333": { gph: 1800.0, speed: 470, type: 'large' }, // Airbus A330-300
  "B772": { gph: 2200.0, speed: 480, type: 'large' }, // Boeing 777-200
  "B77W": { gph: 2500.0, speed: 480, type: 'large' }, // Boeing 777-300ER
  "B744": { gph: 3600.0, speed: 490, type: 'large' }, // Boeing 747-400
  "A388": { gph: 4600.0, speed: 490, type: 'large' }, // Airbus A380-800

  // === EXPERIMENTAL & UNKNOWN ===
  "RV8":  { gph: 10.0, speed: 160, type: 'experimental' }, // Vans RV-8
  "UNKNOWN": { gph: 10.0, speed: 120, type: 'unknown' }, // Unknown Aircraft Code
};