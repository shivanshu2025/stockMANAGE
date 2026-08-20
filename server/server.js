const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Stock Inventory API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  console.log('✓ MongoDB connected');

  const server = app.listen(PORT, () => {
    console.log(`✓ Backend running: http://localhost:${PORT}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error('');
      console.error(`Port ${PORT} is already in use. A previous server instance is still running.`);
      console.error('Find the process:  netstat -ano | findstr :5000');
      console.error('Stop the process:  taskkill /PID <PID> /F');
      console.error('Then retry:        npm run dev');
      console.error('');
    } else {
      console.error('Server failed to start:', error.message);
    }
    process.exit(1);
  });

  const shutdown = (signal) => {
    console.log(`\nReceived ${signal}. Closing backend...`);
    server.close(() => {
      mongoose.connection.close(() => process.exit(0));
    });
    setTimeout(() => process.exit(0), 2000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

start();
