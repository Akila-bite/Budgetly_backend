const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
app.use(express.json()); // Middleware for parsing JSON

app.get('/', (req, res) => {
  res.send('Welcome to Budgetly API');
});

const transactionRoute = require("./routes/transactionRoutes");
app.use("/api/transactions", transactionRoute);

const UserRoute = require("./routes/transactionRoutes");
app.use("/api/transactions", UserRoute);



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

