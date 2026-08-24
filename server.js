import express from "express";
import cors from "cors";

import "dotenv/config"

const app = express()

app.use(cors());
app.use(express.json());

app.post("/journal-prompt", async (req, res) => {
    try {
        const { mood } = req.body;

        if (!mood) {
            return res.status(400).json({
                error: "Mood is required"
            })
        }

        const prompt = `write a short, encouraging journal prompt for someone feeling ${mood}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            }
        );
        const data = await response.json();

        if (!response.ok){
            return res.status(response.status).json({
                error: data.error?.message || `gemini api error`
            });
        }
        const journalPrompt = data.candidates?.[0]?.content?.parts?.[0]?.text;

        return res.json({ prompt: journalPrompt });
    } catch(error){
            console.log(error);
            res.status(500).json({
                error: 'something went wrong'
            });
    }
});
const PORT = 8000
app.listen(PORT,()=>{
    console.log(`server is running at PORT ${PORT}`);
    
});