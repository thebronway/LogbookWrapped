import csv
import random
import math
from datetime import datetime, timedelta

# --- EXACT DEMO2.CSV FOREFLIGHT HEADERS ---
FLIGHT_HEADERS = [
    "Date", "AircraftID", "From", "To", "Route", "TimeOut", "TimeOff", "TimeOn", "TimeIn", "OnDuty", 
    "OffDuty", "TotalTime", "PIC", "SIC", "Night", "Solo", "CrossCountry", "PICUS", "MultiPilot", 
    "IFR", "Examiner", "NVG", "NVG Ops", "Distance", "ActualInstrument", "SimulatedInstrument", 
    "HobbsStart", "HobbsEnd", "TachStart", "TachEnd", "Holds", "Approach1", "Approach2", "Approach3", 
    "Approach4", "Approach5", "Approach6", "DualGiven", "DualReceived", "SimulatedFlight", "GroundTraining", 
    "GroundTrainingGiven", "InstructorName", "InstructorComments", "Person1", "Person2", "Person3", 
    "Person4", "Person5", "Person6", "PilotComments", "Flight Review (FAA)", "IPC (FAA)", "Checkride (FAA)", 
    "FAA 61.58 (FAA)", "NVG Proficiency (FAA)", "DayTakeoffs", "DayLandingsFullStop", "NightTakeoffs", 
    "NightLandingsFullStop", "AllLandings"
]

PREAMBLE = """ForeFlight Logbook Import,This row is required for importing into ForeFlight. Do not delete or modify.,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
Aircraft Table,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
AircraftID,TypeCode,Year,Make,Model,GearType,EngineType,equipType (FAA),aircraftClass (FAA),complexAircraft (FAA),taa (FAA),highPerformance (FAA),pressurized (FAA),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
N111AA,E175,,Embraer,E175,retractable_tricycle,Jet,aircraft,airplane_multi_engine_land,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
N222BB,A320,,Airbus,A320,retractable_tricycle,Jet,aircraft,airplane_multi_engine_land,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
N333CC,A330,,Airbus,A330,retractable_tricycle,Jet,aircraft,airplane_multi_engine_land,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
Flights Table , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,Deprecated: Do not edit manually,Deprecated: Do not edit manually,Deprecated: Do not edit manually,Deprecated: Do not edit manually,Deprecated: Do not edit manually
"""

AIRPORTS = {
    # BASES
    "KDCA": (38.8512, -77.0402, "Base"), "KBOS": (42.3656, -71.0096, "Base"),
    
    # EAST COAST
    "KMIA": (25.7959, -80.2870, "East"), "KMCO": (28.4284, -81.3167, "East"),
    "KATL": (33.6407, -84.4277, "East"), "KCLT": (35.2140, -80.9431, "East"),
    "KPHL": (39.8729, -75.2437, "East"), "KLGA": (40.7769, -73.8740, "East"),
    "KJFK": (40.6413, -73.7781, "East"), "KEWR": (40.6895, -74.1745, "East"),
    "KPIT": (40.4915, -80.2329, "East"), "KRDU": (35.8801, -78.7880, "East"),
    "KBTV": (44.4719, -73.1533, "East"), "KCHS": (32.8986, -80.0405, "East"),
    "KTPA": (27.9755, -82.5332, "East"), "KJAX": (30.4941, -81.6879, "East"),
    "KPBI": (26.6832, -80.0956, "East"), "KBUF": (42.9405, -78.7322, "East"),
    "KSYR": (43.1112, -76.1063, "East"), "KRIC": (37.5052, -77.3197, "East"),
    "KMYR": (33.6797, -78.9283, "East"), "KPVD": (41.7240, -71.4282, "East"),
    "KPWM": (43.6462, -70.3086, "East"), "KROC": (43.1189, -77.6724, "East"),
    "KORF": (36.8946, -76.2012, "East"), "KSAV": (32.1276, -81.2021, "East"),
    "KEYW": (24.5561, -81.7596, "East"), "KBGL": (44.8074, -68.8281, "East"),

    # MIDWEST
    "KORD": (41.9742, -87.9073, "Midwest"), "KDTW": (42.2121, -83.3533, "Midwest"),
    "KMSP": (44.8848, -93.2223, "Midwest"), "KSTL": (38.7499, -90.3700, "Midwest"),
    "KDFW": (32.8998, -97.0403, "Midwest"), "KDEN": (39.8561, -104.6737, "Midwest"),
    "KCVG": (39.0533, -84.6600, "Midwest"), "KCLE": (41.4058, -81.8469, "Midwest"),
    "KOMA": (41.3025, -95.8942, "Midwest"), "KMCI": (39.2976, -94.7139, "Midwest"),
    "KIND": (39.7173, -86.2944, "Midwest"), "KCMH": (39.9980, -82.8919, "Midwest"),
    "KDSM": (41.5340, -93.6631, "Midwest"), "KGRR": (42.8808, -85.5228, "Midwest"),
    "KMSN": (43.1399, -89.3375, "Midwest"), "KSDF": (38.1744, -85.7360, "Midwest"),
    "KBNA": (36.1245, -86.6782, "Midwest"), "KMEM": (35.0424, -89.9767, "Midwest"),

    # EUROPE
    "EGLL": (51.4700, -0.4543, "Europe"), "LFPG": (49.0097, 2.5479, "Europe"),
    "EHAM": (52.3105, 4.7683, "Europe"), "EDDF": (50.0333, 8.5705, "Europe"),
    "LEMD": (40.4839, -3.5680, "Europe"), "LIRF": (41.8003, 12.2389, "Europe"),
    "EIDW": (53.4264, -6.2499, "Europe"), "EDDM": (48.3538, 11.7861, "Europe"),
    "LIMC": (45.6306, 8.7281, "Europe"), "LEBL": (41.2971, 2.0785, "Europe")
}

east_airports = [k for k, v in AIRPORTS.items() if v[2] == "East"]
midwest_airports = [k for k, v in AIRPORTS.items() if v[2] == "Midwest"]
euro_airports = [k for k, v in AIRPORTS.items() if v[2] == "Europe"]

def haversine(lat1, lon1, lat2, lon2):
    R = 3440.065 # Radius of earth in NM
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat/2)**2 + math.cos(math.radians(lat1))*math.cos(math.radians(lat2))*math.sin(dLon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    return R * c

def get_distance(apt1, apt2):
    return haversine(AIRPORTS[apt1][0], AIRPORTS[apt1][1], AIRPORTS[apt2][0], AIRPORTS[apt2][1])

def generate_row(date, tail, dep, dest, dist, is_euro):
    row = {key: "" for key in FLIGHT_HEADERS}
    
    # Calculate Block Time (Jet Speed + Taxi/Hold buffers)
    speed = 460.0 if is_euro else 400.0
    duration = round((dist / speed) + random.uniform(0.5, 0.8), 1)
    
    row["Date"] = date.strftime("%m/%d/%y")
    row["AircraftID"] = tail
    row["TotalTime"] = duration
    row["PIC"] = duration
    row["From"] = dep
    row["To"] = dest
    # ONLY X Y, No multi-leg routes
    row["Route"] = f"{dep} {dest}"
    row["Distance"] = round(dist, 1)
    row["CrossCountry"] = duration
    
    # Simulate Night Flying
    night_ldg = 0
    day_ldg = 0
    if is_euro and AIRPORTS[dep][2] == "Base":
        row["Night"] = duration
        night_ldg = 1
    elif is_euro and AIRPORTS[dep][2] == "Europe":
        day_ldg = 1
    else:
        if random.random() < 0.35:
            row["Night"] = duration
            night_ldg = 1
        else:
            day_ldg = 1
            
    # Simulate Instrument Time
    if random.random() < 0.25:
        row["ActualInstrument"] = round(duration * random.uniform(0.1, 0.5), 1)
    
    row["DayLandingsFullStop"] = day_ldg if day_ldg > 0 else ""
    row["NightLandingsFullStop"] = night_ldg if night_ldg > 0 else ""
    row["AllLandings"] = day_ldg + night_ldg
    
    if random.random() < 0.9:
        appr_type = random.choice(["ILS OR LOC", "RNAV (GPS)"])
        rwy = random.choice(["04", "09", "18", "22", "27L", "36R"])
        row["Approach1"] = f"1;{appr_type} RWY {rwy};{rwy};{dest};;"

    return row

def main():
    rows = []
    current_date = datetime(2013, 1, 1)
    end_date = datetime(2028, 12, 31)
    
    while current_date <= end_date:
        # Airline Pilot Schedule: 60% chance of working on any given date cluster
        if random.random() < 0.40:
            current_date += timedelta(days=1)
            continue
            
        base = "KDCA" if current_date.year < 2020 else "KBOS"
        tail_dom = "N111AA" if base == "KDCA" else "N222BB"
        tail_intl = "N333CC"
        
        # Decide Region (Hitting the 70/20/10 career average)
        rand = random.random()
        is_euro = False
        
        if base == "KDCA":
            dest_pool = east_airports if rand < 0.78 else midwest_airports
        else:
            if rand < 0.60:
                dest_pool = east_airports
            elif rand < 0.80:
                dest_pool = midwest_airports
            else:
                dest_pool = euro_airports
                is_euro = True
                
        dest = random.choice(dest_pool)
        
        if is_euro:
            dist = get_distance(base, dest)
            # Leg 1: Base to Europe (Logged strictly as X -> Y)
            rows.append(generate_row(current_date, tail_intl, base, dest, dist, True))
            current_date += timedelta(days=1)
            # Leg 2: Europe to Base (Logged strictly as Y -> X)
            rows.append(generate_row(current_date, tail_intl, dest, base, dist, True))
            current_date += timedelta(days=2) 
        else:
            # Domestic Flights
            num_round_trips = 1 if random.random() < 0.5 else 2
            
            for _ in range(num_round_trips):
                if _ == 1: 
                    dest = random.choice(east_airports if random.random() < 0.75 else midwest_airports)
                    
                dist = get_distance(base, dest)
                if dist < 50: continue 
                
                # Outbound Flight (Logged strictly as X -> Y)
                rows.append(generate_row(current_date, tail_dom, base, dest, dist, False))
                # Inbound Flight (Logged strictly as Y -> X)
                rows.append(generate_row(current_date, tail_dom, dest, base, dist, False))
                
            current_date += timedelta(days=1)

    # --- WRITE TO CSV ---
    with open('demo_b.csv', 'w', newline='') as f:
        f.write(PREAMBLE)
        f.write(",".join(FLIGHT_HEADERS) + "\n")
        writer = csv.DictWriter(f, fieldnames=FLIGHT_HEADERS, extrasaction='ignore')
        writer.writerows(rows)
        
    print(f"Successfully generated demo_b.csv with {len(rows)} strictly X->Y flights!")

if __name__ == "__main__":
    main()