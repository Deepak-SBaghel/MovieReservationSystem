import "dotenv/config";
import "./utils/redisClient.js";
import express, { json } from "express";
import sequelize from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import reservationRoutes from "./routes/reservationRoute.js";
// esure redis is connected

const PORT = process.env.PORT || 3000;

const app = express();

app.use(json());

// Routes
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/reservations", reservationRoutes);

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
