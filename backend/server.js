const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('Starting server initialization...');

// Import routes with error handling
let authRoutes, userRoutes, jobRoutes, applicationRoutes, paymentRoutes, uploadRoutes;

try {
  authRoutes = require('./routes/auth');
  console.log('✓ Auth routes loaded');
} catch (e) {
  console.error('✗ Error loading auth routes:', e.message);
  process.exit(1);
}

try {
  userRoutes = require('./routes/users');
  console.log('✓ User routes loaded');
} catch (e) {
  console.error('✗ Error loading user routes:', e.message);
  process.exit(1);
}

try {
  jobRoutes = require('./routes/jobs');
  console.log('✓ Job routes loaded');
} catch (e) {
  console.error('✗ Error loading job routes:', e.message);
  process.exit(1);
}

try {
  applicationRoutes = require('./routes/applications');
  console.log('✓ Application routes loaded');
} catch (e) {
  console.error('✗ Error loading application routes:', e.message);
  process.exit(1);
}

try {
  paymentRoutes = require('./routes/payments');
  console.log('✓ Payment routes loaded');
} catch (e) {
  console.error('✗ Error loading payment routes:', e.message);
  process.exit(1);
}

try {
  uploadRoutes = require('./routes/upload');
  console.log('✓ Upload routes loaded');
} catch (e) {
  console.error('✗ Error loading upload routes:', e.message);
  process.exit(1);
}

// Import middleware
let errorHandler;
try {
  errorHandler = require('./middleware/error').errorHandler;
  console.log('✓ Error handler loaded');
} catch (e) {
  console.error('✗ Error loading error handler:', e.message);
  process.exit(1);
}

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV}`);
  console.log(`✓ Client URL: ${process.env.CLIENT_URL}`);
  console.log('\nServer is ready to accept requests!\n');
});

module.exports = app;
