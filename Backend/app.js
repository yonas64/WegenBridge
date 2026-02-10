// server.js
const express    = require('express');
const connectDB  = require('./config/db');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const missingPersonRoutes = require('./routes/missingPerson.routes');
const sightingRoutes = require('./routes/sighting.routes');
const notificationRoutes = require('./routes/notification.routes');
const adminRoutes = require('./routes/admin.routes');
const telemetryRoutes = require('./routes/telemetry.routes');
const swaggerUI = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");

app.use(cookieParser());
require('dotenv').config();
// Connect to MongoDB
 connectDB();

// Middleware
app.use(express.json());
app.set('trust proxy', true);
app.set('view engine', 'ejs');
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));
//swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
//frontend
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/missing-persons', missingPersonRoutes);
app.use('/api/sightings', sightingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/telemetry', telemetryRoutes);

//404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
