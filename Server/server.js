const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/batches', require('./routes/batch'));
app.use('/api/student', require('./routes/student'));
app.use('/api', require('./routes/scheduleList'));

app.use((req, res, next) => {
  res.status(404).send('Route not found');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});