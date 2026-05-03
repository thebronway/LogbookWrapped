import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pg from 'pg';
import rateLimit from 'express-rate-limit';

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 3000;
const API_TOKEN = process.env.API_TOKEN;

// Trust proxy so rate-limiting uses the real client IP, not Nginx's internal IP
app.set('trust proxy', 1);

const allowedOrigins = [
  'https://logbookwrapped.com',
  'https://www.logbookwrapped.com',
  'https://dev.logbookwrapped.com',
  'https://logbookwrapped.conway.im',
];

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin '${origin}' is not allowed.`));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'X-App-Token'],
}));
app.use(express.json({ limit: '10kb' }));

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const statsRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  message: { error: "Too many stats submissions from this IP, please try again tomorrow." },
  standardHeaders: true,
  legacyHeaders: false,
});

const genRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

// Rejects requests that are missing or have an invalid shared secret header
const validateToken = (req, res, next) => {
  if (!API_TOKEN || req.headers['x-app-token'] !== API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/generations', genRateLimiter, validateToken, async (req, res) => {
  try {
    const { isDemo, efbType } = req.body;
    const safeIsDemo = isDemo === true || isDemo === 'true';
    const safeEfbType = typeof efbType === 'string' ? efbType.substring(0, 50) : 'Unknown';

    await pool.query(
      'INSERT INTO generations (is_demo, efb_type) VALUES ($1, $2)',
      [safeIsDemo, safeEfbType]
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Generations Insert Error:', error);
    res.status(500).json({ success: false });
  }
});

app.post('/api/stats', statsRateLimiter, validateToken, async (req, res) => {
  try {
    const { year, flight_time, flights, distance, landings, night_hours, states_count, dominant_size } = req.body;

    const parsedYear = parseInt(year);
    if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > new Date().getFullYear() + 1) {
      return res.status(400).json({ error: "Invalid year for submission." });
    }

    if (
      flight_time < 0 || flight_time > 2000 ||
      flights < 0 || flights > 2500 ||
      states_count < 0 || states_count > 50
    ) {
      return res.status(400).json({ error: "Stats fall outside realistic single-year bounds." });
    }

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
