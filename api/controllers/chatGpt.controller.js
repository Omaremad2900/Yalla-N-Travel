// controllers/openaiController.js
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getOpenAIResponse = async (req, res) => {
  try {
    const userMessage = req.body.prompt; // Get the user's message from the request body

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo", // Use "gpt-4-turbo" or "gpt-4" based on availability
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage },
      ],
    });

    res.status(200).json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error fetching OpenAI response:", error);
    res.status(500).json({ error: error.message });
  }
};