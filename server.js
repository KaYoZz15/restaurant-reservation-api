const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Restaurant Reservation API running' });
});

async function startServer() {
  try {
    await db.getConnection();
    console.log("✅ Connected to MySQL");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

startServer();