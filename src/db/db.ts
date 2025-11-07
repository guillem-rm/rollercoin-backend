import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/mydatabase";

/**
 * Connects to the MongoDB database using Mongoose.
 * 
 * @throws Exits the process if the connection fails.
 */
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};