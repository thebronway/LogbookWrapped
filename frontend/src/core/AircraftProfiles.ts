export interface AircraftProfile {
  gph: number;
  speed: number; // True Airspeed in Knots
}

export const AIRCRAFT_PROFILES: Record<string, AircraftProfile> = {
  // === SMALL: PISTON SINGLE & TWIN ===
  "J3":   { gph: 4.5,  speed: 65 },   // Piper J-3 Cub
  "C150": { gph: 5.5,  speed: 90 },   // Cessna 150
  "C152": { gph: 6.0,  speed: 90 },   // Cessna 152
  "DA20": { gph: 6.0,  speed: 110 },  // Diamond DA20 Katana
  "AA5":  { gph: 8.5,  speed: 120 },  // Grumman Cheetah/Tiger
  "C172": { gph: 9.0,  speed: 110 },  // Cessna 172 Skyhawk
  "PA28": { gph: 10.0, speed: 115 },  // Piper Cherokee/Archer/Warrior
  "M20T": { gph: 11.0, speed: 170 },  // Mooney M20
  "SR20": { gph: 11.0, speed: 145 },  // Cirrus SR20
  "DA40": { gph: 9.0,  speed: 135 },  // Diamond DA40
  "C177": { gph: 10.0, speed: 125 },  // Cessna 177 Cardinal
  "DA42": { gph: 12.0, speed: 150 },  // Diamond DA42 (Twin)
  "C182": { gph: 13.0, speed: 140 },  // Cessna 182 Skylane
  "SR22": { gph: 14.5, speed: 180 },  // Cirrus SR22
  "PA32": { gph: 15.0, speed: 155 },  // Piper Saratoga/Cherokee Six
  "BE36": { gph: 15.0, speed: 165 },  // Beechcraft Bonanza
  "C206": { gph: 16.0, speed: 140 },  // Cessna 206 Stationair
  "C210": { gph: 16.5, speed: 170 },  // Cessna 210 Centurion
  "PA34": { gph: 18.0, speed: 160 },  // Piper Seneca (Twin)
  "PA44": { gph: 20.0, speed: 155 },  // Piper Seminole (Twin)
  "BE58": { gph: 32.0, speed: 180 },  // Beechcraft Baron (Twin)
  "C310": { gph: 32.0, speed: 190 },  // Cessna 310 (Twin)

  // === MEDIUM: TURBOPROPS & LIGHT/MID JETS ===
  "PA46": { gph: 35.0,  speed: 200 }, // Piper Malibu/Meridian
  "C208": { gph: 45.0,  speed: 170 }, // Cessna Caravan
  "SF50": { gph: 60.0,  speed: 300 }, // Cirrus Vision Jet
  "TBM8": { gph: 60.0,  speed: 315 }, // Daher TBM 850
  "TBM9": { gph: 60.0,  speed: 315 }, // Daher TBM 900 series
  "PC12": { gph: 65.0,  speed: 270 }, // Pilatus PC-12
  "BE20": { gph: 100.0, speed: 270 }, // Beechcraft King Air 200
  "B350": { gph: 125.0, speed: 300 }, // Beechcraft King Air 350
  "C510": { gph: 100.0, speed: 330 }, // Cessna Citation Mustang
  "C25A": { gph: 120.0, speed: 400 }, // Cessna Citation CJ3
  "B190": { gph: 160.0, speed: 280 }, // Beechcraft 1900D
  "E55P": { gph: 183.0, speed: 440 }, // Embraer Phenom 300
  "PC24": { gph: 190.0, speed: 420 }, // Pilatus PC-24
  "LJ45": { gph: 210.0, speed: 440 }, // Learjet 45
  "LJ60": { gph: 260.0, speed: 440 }, // Learjet 60
  "CL60": { gph: 255.0, speed: 450 }, // Challenger 604
  "GLF4": { gph: 400.0, speed: 480 }, // Gulfstream IV
  "C750": { gph: 425.0, speed: 500 }, // Cessna Citation X
  "GLF6": { gph: 450.0, speed: 480 }, // Gulfstream G650
  "GL5T": { gph: 500.0, speed: 480 }, // Bombardier Global 5000/7500

  // === LARGE: COMMERCIAL AIRLINERS ===
  "CRJ2": { gph: 320.0,  speed: 450 }, // Bombardier CRJ-200
  "E145": { gph: 350.0,  speed: 450 }, // Embraer ERJ-145
  "E170": { gph: 400.0,  speed: 460 }, // Embraer E170
  "CRJ9": { gph: 450.0,  speed: 460 }, // Bombardier CRJ-900
  "E175": { gph: 450.0,  speed: 460 }, // Embraer E175
  "E190": { gph: 550.0,  speed: 470 }, // Embraer E190
  "BCS3": { gph: 650.0,  speed: 470 }, // Airbus A220-300
  "B38M": { gph: 670.0,  speed: 450 }, // Boeing 737 MAX 8
  "B737": { gph: 800.0,  speed: 450 }, // Boeing 737-700
  "A319": { gph: 800.0,  speed: 450 }, // Airbus A319
  "A320": { gph: 850.0,  speed: 450 }, // Airbus A320
  "B738": { gph: 900.0,  speed: 450 }, // Boeing 737-800
  "A321": { gph: 950.0,  speed: 450 }, // Airbus A321
  "B739": { gph: 980.0,  speed: 450 }, // Boeing 737-900
  "MD88": { gph: 1000.0, speed: 440 }, // McDonnell Douglas MD-88
  "B752": { gph: 1100.0, speed: 460 }, // Boeing 757-200
  "B753": { gph: 1150.0, speed: 460 }, // Boeing 757-300
  "B763": { gph: 1600.0, speed: 460 }, // Boeing 767-300
  "A359": { gph: 1600.0, speed: 480 }, // Airbus A350-900 
  "A332": { gph: 1700.0, speed: 470 }, // Airbus A330-200
  "B788": { gph: 1650.0, speed: 480 }, // Boeing 787-8 Dreamliner
  "B789": { gph: 1700.0, speed: 480 }, // Boeing 787-9 Dreamliner
  "A333": { gph: 1800.0, speed: 470 }, // Airbus A330-300
  "B772": { gph: 2200.0, speed: 480 }, // Boeing 777-200
  "B77W": { gph: 2500.0, speed: 480 }, // Boeing 777-300ER
  "B744": { gph: 3600.0, speed: 490 }, // Boeing 747-400
  "A388": { gph: 4600.0, speed: 490 }, // Airbus A380-800
};