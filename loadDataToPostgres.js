import pg from "pg";
import csvParser from "csv-parser";
import fs from "fs";
import dotenv from "dotenv";
import pgvector from "pgvector/pg";

dotenv.config();

const { Pool } = pg;
pgvector.registerType(pg);

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

async function loadData() {
    const data = [];

    fs.createReadStream("mountains_vs_beaches_preferences.cvs")

        .pipe(csvParser())
        .on("data", (row) => {
            data.push(row);

        })
        .on("end", async () => {
            try {
                for (const row of data) {
                    const respondentId = parseInt(row['Respondent ID'], 10);
                    const timestamp = row['Timestamp'];
                    const mountainsPreference = parseInt(row['Mountains_preference'], 10);
                    const beachesPreference = parseInt(row['Beaches_preference'], 10);
                    const age = parseInt(row['Age'], 10);
                    const gender = row['Gender'];
                    const income = row['Income'];
                    const education = row['Education'];
                    const location = row['Location'];
                    const embeddingVector = JSON.parse(row.embedding);
                    const query = `INSERT INTO preference_profiles (respondent_id, "Timestamp", "Mountains_preference", "Beaches_preference", "Age", "Gender", "Income", "Education", "Location", preference_embedding)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    ON CONFLICT (respondent_id) DO NOTHING; -- Skip if respondent_id already exists`;

                    const values = [respondentId, timestamp, mountainsPreference, beachesPreference, age, gender, income, education, location, embeddingVector];

                    await pool.query(query, values);
                    console.log(`Data inserted for Respondent ID: ${respondentId}`);
                }
                console.log("Data inserted complete.");
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                pool.end();
            }
        });
}

loadData();