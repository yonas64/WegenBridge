const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const swaggerUI = require("swagger-ui-express");

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

require("dotenv").config();

const app = express();

connectDB();

app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", true);
app.set("view engine", "ejs");

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "https://wegenbridge.onrender.com",
];
const envAllowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = envAllowedOrigins.length > 0 ? envAllowedOrigins : defaultAllowedOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
  })
);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/missing-persons", missingPersonRoutes);
app.use("/api/sightings", sightingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/telemetry", telemetryRoutes);
app.use("/api/siem", siemRoutes);

app.use((req, res) => {
  res.status(404).send("Page not found");
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
