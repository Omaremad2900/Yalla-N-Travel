//index
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import helmet from "helmet"; // Helmet for security headers
import rateLimit from "express-rate-limit"; // Rate limiting
import connectDB from "./config/db.js"; // Import the connectDB function
import errorHandler from "./middlewares/errorMiddleware.js"; // Import the error handler
import tourGuideRoute from "./routes/tourGuide.routes.js";
import advertisorRoute from "./routes/advertisor.routes.js";
import activityCategoryRoutes from "./routes/activityCategory.routes.js";
import tagRoute from "./routes/tag.routes.js";
import museumRoutes from "./routes/museum.routes.js";
import historicalPlaceRoutes from "./routes/historicalPlace.routes.js";
import itineraryRoutes from "./routes/itinerary.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import touristRoute from "./routes/tourist.routes.js";
import activityRoute from "./routes/activity.routes.js";
import preferenceTagRoutes from "./routes/preferenceTag.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import flightRoutes from './routes/flightBooking.routes.js';
import hotelRoutes from './routes/hotelBooking.routes.js'
import openaiRoutes from './routes/chatGpt.routes.js';
import shareRoutes from "./routes/share.routes.js";
import toursimgovernorRoutes from "./routes/tourismGovernor.routes.js";

import container from "./config/di-container.js";
import { scopePerRequest } from "awilix-express"; // Import scopePerRequest
import { initAgenda } from "./utils/Jobs/agenda.js";
import { seedAdmin } from "./utils/seeders/adminSeeder.js";
import {seedPreference} from "./utils/seeders/perferenceSeeder.js"
import { initSocketService } from "./services/socketService.js"; // Socket service
import http from 'http';


dotenv.config();
const __dirname = path.resolve();

const app = express();

app.use(express.json()); // To parse incoming JSON request bodies


// CORS
app.use(
  cors({
    origin: "http://yalla.local", // Allow only this origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow specific methods
    credentials: true, // Allow credentials like cookies
  })
);

// Security Middleware: Helmet to secure HTTP headers
app.use(helmet());

// Rate Limiting Middleware: Limit repeated requests to public APIs
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes.",
});

app.use(limiter);

// Logging
app.use(morgan("dev"));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(scopePerRequest(container));
const server = http.createServer(app);
const io = initSocketService(server); // Initialize the Socket.IO server
// Schedule Jobs
(async () => {
  try{
  const agenda =await initAgenda();
  await agenda.every('30 minutes', 'send app notifications');
  await agenda.every('40 minutes', 'send-birthday-promo');
  await agenda.every('45 minutes', 'send email notifications');
  await agenda.every('60 minutes', 'notify-open-bookings');
  }
  catch(error)
  {
    console.log(error);
  }
})();
// Database connection
connectDB();
// seed admin
seedAdmin();
// seed perference
seedPreference();

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/tourGuide", tourGuideRoute);
app.use("/api/advertiser", advertisorRoute);
app.use("/api/activity-categories", activityCategoryRoutes);
app.use("/api/tags", tagRoute);
app.use("/api", museumRoutes);
app.use("/api", historicalPlaceRoutes);
app.use("/api", itineraryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/tourist", touristRoute);
app.use("/api", activityRoute);
app.use("/api/preference-tags", preferenceTagRoutes);
app.use("/upload", uploadRoutes);
app.use("/api", paymentRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api', openaiRoutes);
app.use('/api', shareRoutes);
app.use('/api/tourismGovernor',toursimgovernorRoutes);
//Serving Uploads Folder
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // Allow cross-origin access for images
    next();
  },
  express.static("uploads")
); // Catch-all route for undefined routes (404)

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
app.use((req, res, next) => {
  console.log(`Request URL: ${req.originalUrl}`);
  console.log(`Request Method: ${req.method}`);
  next();
});

// Serve static files from React build (for deployment)
app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

// Global error handler
app.use(errorHandler);

// Server listen
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { io };
