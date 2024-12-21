const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require("./routes/product-routes/productsRoutes");
const userRoutes = require("./routes/user-routes/userRoutes")
const TextRoutes = require("./routes/text-routes/TextRoutes")

const cookieParser = require('cookie-parser');
const { PORT } = require('./global/constants/keys');
const cors = require("cors")
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser())

// Enable CORS for all origins

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    credentials: true, // Allow cookies and other credentials
  }));

const uri = 'mongodb://localhost:27017/at-3';

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

// Handle connection events
db.on('connected', () => {
    console.log('Connected to MongoDB');
});



db.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error);
});

db.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});


// MongoDB connection
// mongoose.connect("mongodb+srv://alismevn:WebDev976!!@cluster0.smtlc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
//   .then(() => console.log('MongoDB connected'))
//   .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/text',TextRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
