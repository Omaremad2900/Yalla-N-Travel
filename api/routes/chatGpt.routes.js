// routes/openai.routes.js
import express from 'express';
import { getOpenAIResponse } from "../controllers/chatGpt.controller.js";

const router = express.Router();

router.post('/openai-response', getOpenAIResponse);

export default router;