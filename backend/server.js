require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Connect to DB
connectDB();

if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// Routes (placeholders)
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/wallet', require('./routes/wallet.routes'));
app.use('/api/services/nimc', require('./routes/services/nimc.routes'));
app.use('/api/services/cac', require('./routes/services/cac.routes'));

// Paystack webhook: raw body
const paystackController = require('./controllers/paystack.controller');
app.post(
  '/api/paystack/webhook',
  express.raw({ type: 'application/json' }),
  paystackController.webhook
);

app.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));

if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(staticPath));
  app.get('*', (_, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

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
