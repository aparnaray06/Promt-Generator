import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
console.log("API key loaded:", !!process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/journal-prompt", async (req, res) => {
    try {
        const { mood } = req.body;

        if (!mood || !mood.trim()) {
            return res.status(400).json({
                error: "Mood is required"
            });
        }

        const prompt = `
Generate one short, encouraging journal prompt
for someone who is feeling ${mood.trim()}.
Keep it simple, positive, and reflective.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const journalPrompt = response.text;

        if (!journalPrompt) {
            return res.status(500).json({
                error: "No journal prompt generated"
            });
        }

        res.json({
            prompt: journalPrompt
        });

    } 
    // catch (error) {
    //     console.error("Gemini API Error:", error);

    //     res.status(500).json({
    //         error: "Something went wrong"
    //     });
    catch (error) {
    console.error("FULL ERROR:", error);

    res.status(500).json({
        error: error.message
    });
    }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});