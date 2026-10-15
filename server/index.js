const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getIsMongoConnected } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database connection (MongoDB with MemoryStore fallback)
connectDB();

// Routes
app.use('/api/gis', require('./routes/gisRoutes'));
app.use('/api/telemetry', require('./routes/telemetryRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/crop-health', require('./routes/cropScanRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/irrigation', require('./routes/irrigationRoutes'));

// Root API Landing Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'AgriPulse AI & GIS Platform Backend API',
    message: 'Backend server is running successfully! Access the web frontend on Vercel.',
    healthCheck: '/api/health',
    endpoints: [
      '/api/gis/fields',
      '/api/telemetry',
      '/api/recommendations',
      '/api/crop-health/scans',
      '/api/market/prices',
      '/api/irrigation/schedule'
    ]
  });
});

// System Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'AgriPulse AI & GIS Platform API',
    mongoDBConnected: getIsMongoConnected(),
    timestamp: new Date().toISOString()
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌾 AgriPulse FSD Backend Server running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});
