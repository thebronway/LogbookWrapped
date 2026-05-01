import express from 'express';
import cors from 'cors';
import pg from 'pg';
import rateLimit from 'express-rate-limit';

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 3000;

// Since Nginx is reverse-proxying requests, we need this so rate-limiting uses the real client IP
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Rate limiters for flood control
const statsRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // Limit each IP to 5 stats submissions per day
  message: { error: "Too many stats submissions from this IP, please try again tomorrow." },
  standardHeaders: true,
  legacyHeaders: false,
});

const genRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 generations tracked per hour per IP max
  standardHeaders: true,
  legacyHeaders: false,
});

// Healthcheck
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Endpoint 1: Track Generation Events
app.post('/api/generations', genRateLimiter, async (req, res) => {
  try {
    const { isDemo, efbType } = req.body;
    
    // Ensure we are inserting safe boolean
    const safeIsDemo = isDemo === true || isDemo === 'true';
    const safeEfbType = typeof efbType === 'string' ? efbType.substring(0, 50) : 'Unknown';

    await pool.query(
      'INSERT INTO generations (is_demo, efb_type) VALUES ($1, $2)',
      [safeIsDemo, safeEfbType]
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Generations Insert Error:', error);
    // Always return 200 or 500 silently so the frontend doesn't break
    res.status(500).json({ success: false });
  }
});

// Endpoint 2: Submit Anonymous Stats (Yearly Only)
app.post('/api/stats', statsRateLimiter, async (req, res) => {
  try {
    const { 
      year, 
      flight_time, 
      flights, 
      distance, 
      landings, 
      night_hours, 
      states_count, 
      dominant_size 
    } = req.body;

    // --- Server-Side Validation (Spam Control) ---
    const parsedYear = parseInt(year);
    
    // Reject if not a valid year (e.g., 'all_time' or missing)
    if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > new Date().getFullYear()) {
      return res.status(400).json({ error: "Invalid year for submission." });
    }

    // Reject unrealistic single-year stats
    if (
      flight_time < 0 || flight_time > 2000 ||
      flights < 0 || flights > 2500 ||
      states_count < 0 || states_count > 50
    ) {
      return res.status(400).json({ error: "Stats fall outside realistic single-year bounds." });
    }

    // Clean Enum string
    const safeSize = ['small', 'medium', 'large', 'unknown'].includes(dominant_size) 
      ? dominant_size 
      : 'unknown';

    await pool.query(
      `INSERT INTO community_stats 
        (year, flight_time, flights, distance, landings, night_hours, states_count, dominant_size) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        parsedYear,
        Number(flight_time) || 0,
        Number(flights) || 0,
        Number(distance) || 0,
        Number(landings) || 0,
        Number(night_hours) || 0,
        Number(states_count) || 0,
        safeSize
      ]
    );

    // Calculate the community averages for this specific year and aircraft size
    // We use ROUND to keep the JSON payload clean
    const avgResult = await pool.query(
      `SELECT 
        ROUND(AVG(flight_time), 1) as flight_time,
        ROUND(AVG(flights)) as flights,
        ROUND(AVG(distance)) as distance,
        ROUND(AVG(landings)) as landings,
        ROUND(AVG(night_hours), 1) as night_hours
       FROM community_stats 
       WHERE year = $1 AND dominant_size = $2`,
      [parsedYear, safeSize]
    );

    res.status(200).json({ success: true, averages: avgResult.rows[0] });
  } catch (error) {
    console.error('Stats Insert Error:', error);
    res.status(500).json({ success: false });
  }
});

app.listen(port, () => {
  console.log(`LogbookWrapped Backend running on port ${port}`);
});