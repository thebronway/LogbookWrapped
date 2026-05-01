CREATE TABLE IF NOT EXISTS generations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN NOT NULL,
    efb_type VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS community_stats (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    year INT NOT NULL,
    flight_time NUMERIC(8, 2),
    flights INT,
    distance NUMERIC(10, 2),
    landings INT,
    night_hours NUMERIC(8, 2),
    states_count INT,
    dominant_size VARCHAR(20)
);