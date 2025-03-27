import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import preferenceRoutes from "./routes/perferences";

dotenv.config();

const app = express();
const port = process.env.port

app.use(cors());
app.use(express.json());
connectDB();
app.use("/api/preference", preferenceRoutes);
app.get("/", (req,res) => {
    res.send("Travel Recommendation Backend is running!");
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});