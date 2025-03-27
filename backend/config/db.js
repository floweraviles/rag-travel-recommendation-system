import pg from "pg";
import dotenv from "dotenv";
import pgvector from "pgvector/pg";

dotenv.config();

const { Pool } = require("pg");

const pool = new Pool ({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pgvector.registerType(pg); 

const connectDB = async () => {
    try {
        await pool.connect();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
};

export { connectDB, pool };