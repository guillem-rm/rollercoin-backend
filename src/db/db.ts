import mongoose from "mongoose";
import dotenv from "dotenv";

import logger from "../utils/logger.js";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

/**
 * Connects to the MongoDB database using Mongoose.
 * 
 * @throws Exits the process if the connection fails.
 */
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        logger.info("MongoDB connected successfully");
    } catch (error) {
        logger.error("MongoDB connection error:", error);
        process.exit(1);
    }
};