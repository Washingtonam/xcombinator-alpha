require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// 1. Connect to DB
connectDB();

// 2. Trust Proxy for Render/Vercel
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// 3. Security Middlewares
app.use(helmet());

// 4. CORS Configuration
// We explicitly allow your Vercel domain without trailing slashes to avoid header mismatch
const corsOptions = {
  origin: process.env.CLIENT_URL || 'https://xcombinator-alpha.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// 5. Rate Limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// 6. Body Parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// 7. Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/wallet', require('./routes/wallet.routes'));
app.use('/api/services/nimc', require('./routes/services/nimc.routes'));
app.use('/api/services/cac', require('./routes/services/cac.routes'));

// 8. Paystack webhook
const paystackController = require('./controllers/paystack.controller');
app.post(
  '/api/paystack/webhook',
  express.raw({ type: 'application/json' }),
  paystackController.webhook
);

// 9. Health Check
app.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));

// 10. Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.info('SIGTERM received. Shutting down gracefully.');
  server.close(() => process.exit(0));
});