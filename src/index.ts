import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { connectDB } from "./db/db.js";
import minerRoutes from "./routes/minerRoutes.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || "/api/v1";

const app = express();

// Enable CORS and parse JSON requests
app.use(cors());
app.use(express.json());

// Connect to database
await connectDB();

// Setup routes
app.use(`${API_PREFIX}/miners`, minerRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});