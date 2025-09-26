require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoRoutes = require('./src/routes/todo.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/todos', todoRoutes);

// basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('Connected to MongoDB');
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error', err);
  });
