const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
 
// Route imports
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const teachingRoutes = require("./routes/teachingRoutes"); // New Teaching routes
const researchRoutes = require("./routes/researchRoutes");
const interactionRoutes = require("./routes/interactionRoutes");
const creativityRoutes = require("./routes/creativityRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const contactRoutes = require("./routes/contactRoutes");
const contactInfoRoutes = require("./routes/contactInfoRoutes");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();


app.use(cors({
  origin: "https://anjanaarakerimathportfolio.vercel.app",
  credentials: true
}));
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/teaching", teachingRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/creativity", creativityRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/contact-info", contactInfoRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// Error handling middleware
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});
