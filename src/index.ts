import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma/client.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Welcome to the API");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});