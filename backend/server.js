require('dotenv').config(); // ensure env is loaded

const app = require('./src/app');
const connectDB = require('./src/config/db');  // Your DB connection

// Connect to DB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
