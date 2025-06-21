const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// CORS middleware (allow requests from Vite frontend)
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server default
  credentials: true
}));

// JSON parser middleware
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Budgetly API');
});

// Routes
const transactionRoute = require('./routes/transactionRoute');
const userRoute = require('./routes/userRoute'); 
const categoryRoute = require("./routes/categoryRoute");

app.use('/api/transaction', transactionRoute);
app.use('/api/users', userRoute); // ✅ Register user routes correctly
app.use("/api/categories", categoryRoute);


// Catch-all for undefined routes
// app.use((req, res, next) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found"
//   });
// });


// MongoDB connection + server start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));


