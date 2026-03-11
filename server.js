const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/database');
const menuRoutes = require('./routes/menuRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Restaurant Reservation API is running'
  });
});

app.use('/menu', menuRoutes);
app.use('/', reservationRoutes);

async function startServer() {
  try {
    const connection = await db.getConnection();
    console.log('✅ Connected to MySQL');
    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

startServer();
