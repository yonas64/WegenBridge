// server.js
const express    = require('express');
const connectDB  = require('./config/db');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const missingPersonRoutes = require('./routes/missingPerson.routes');
const sightingRoutes = require('./routes/sighting.routes');
const app = express();

// Connect to MongoDB
 connectDB();

// Middleware
app.use(express.json());
app.set('view engine', 'ejs');

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/missing-persons', missingPersonRoutes);
app.use('/api/sightings', sightingRoutes);

//404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
