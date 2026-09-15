require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const employeeRoutes = require('./src/routes/employeeRoutes');
const tripRoutes = require('./src/routes/tripRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const inquiryRoutes = require('./src/routes/inquiryRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const organizerRoutes = require('./src/routes/organizerRoutes');
const routeRoutes = require('./src/routes/routeRoutes');
const vehicleRoutes = require('./src/routes/vehicleRoutes');

// Initialize app
const app = express();

// Connect Database — called once at startup, then cached for warm invocations
connectDB();

// Middleware: ensure DB connection is live before each API request.
// On Vercel, the first cold-start attempt might fail due to TLS latency.
// This retry middleware reconnects automatically on subsequent requests.
app.use('/api', async (req, res, next) => {
  const store = require('./src/config/store');
  if (!store.isMongo()) {
    // Silently attempt to reconnect — won't block the request
    connectDB().catch(() => {});
  }
  next();
});

// CORS — allow local dev + all Vercel preview/production deployments + CLIENT_URL env
// CLIENT_URL can be a comma-separated list e.g. "https://app.vercel.app,https://custom.com"
const extraOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((u) => u.trim())
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  ...extraOrigins,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, server-to-server)
      if (!origin) return callback(null, true);
      // Allow any *.vercel.app subdomain (covers preview & production deployments)
      if (/^https:\/\/[a-zA-Z0-9-]+(\.vercel\.app)$/.test(origin)) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads folder if used
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Sri Sai Ram Consultancy (SSRC) API',
    timestamp: new Date(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/organizers', organizerRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Root greeting
app.get('/', (req, res) => {
  res.send('Sri Sai Ram Consultancy (SSRC) Backend API is running...');
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SSRC Server running on http://localhost:${PORT}`);
});
