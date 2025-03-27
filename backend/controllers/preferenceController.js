import { pool } from "../config/db";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getRecommendations = async (req, res) => {
    try {
        const userPreferences = req.body;

        if (!userPreferences || !userPreferences.mountain_preference || !userPreferences.beach_preference) {
            return res.status(400).json({ message: "Mountain and beach preferences are required." });
        }

        const preferenceText = `Mountain perference level:
        ${userPreferences.mountain_preference}, Beach perference level:
        ${userPreferences.beach_preference}`;

        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: preferenceText,
        });
        const userEmbedding = embeddingResponse.data[0].embedding;

        const query = `
        SELECT respondent_id, "Mountain_perference", "Beaches_preference"
        FROM perference_profiles
        ORDER BY perferences_embedding <-> $1
        LIMIT 5;
        `;

        const values = [userEmbedding];
        const result = await pool.query(query, values);
        const recommendations = result.rows;

        res.json({ success: true, data: recommendations });

    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ success: false, message: 'Failed to generate recommendations', error: error.message});
    }
};

export default { getRecommendations };