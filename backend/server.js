require("dns").setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const activityRoutes = require("./routes/activityRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// Make Socket.IO available inside controllers
app.set("io", io);

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/expenses", expenseRoutes);

// Simple health check route
app.get("/", (req, res) => {
  res.send("Travel Planner API is running...");
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinTrip", (tripId) => {
    socket.join(`trip:${tripId}`);

    console.log(
      `Socket ${socket.id} joined trip room: trip:${tripId}`
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
