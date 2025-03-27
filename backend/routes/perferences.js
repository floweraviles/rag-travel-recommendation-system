import express from "express";
import preferenceController from "../controllers/preferenceController";

const router = express.Router();

router.post("/recommendations", preferenceController.getRecommendations);

export default router;