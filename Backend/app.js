const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const swaggerUI = require("swagger-ui-express");

require("dotenv").config();

const connectDB = require("./config/db");
const swaggerDocs = require("./swagger");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const missingPersonRoutes = require("./routes/missingPerson.routes");
const sightingRoutes = require("./routes/sighting.routes");
const notificationRoutes = require("./routes/notification.routes");
const adminRoutes = require("./routes/admin.routes");
const telemetryRoutes = require("./routes/telemetry.routes");
const siemRoutes = require("./routes/siem.routes");

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);

// Create uploads folder if not exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

/* =========================
   CORS CONFIG (FIXED)
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://wegen-bridge-djg8.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / mobile apps

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed from this origin"));
      }
    },
    credentials: true,
  })
);

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    message: "WegenBridge Backend Running 🚀",
    status: "OK",
  });
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/missing-persons", missingPersonRoutes);
app.use("/api/sightings", sightingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/telemetry", telemetryRoutes);
app.use("/api/siem", siemRoutes);

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

