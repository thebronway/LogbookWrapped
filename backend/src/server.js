import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5298;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('Logbook Wrapped Print Proxy is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`[Backend] Server listening on port ${PORT}`);
});