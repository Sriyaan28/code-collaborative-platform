import axios from "axios";
import { config } from "dotenv";

config();

const GROQ_API_KEY = process.env.GROQ_API_KEY_2?.trim();
const GROQ_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

export const smartMergeService = async (userContent, latestBackendContent) => {
    try {
        const systemPrompt = `You are a strict code merge tool. Merge 'Your Code' into 'Remote Code'.
Rules:
- Resolve conflicts intelligently, keeping the user's intent.
- If 'Remote Code' has removed lines of code, you should also remove them in the merged code, UNLESS 'Your Code' specifically depends on those lines.
- DO NOT add new lines, comments, or logic unless strictly necessary to fix conflicts.
- Output ONLY the raw merged code. No markdown formatting, no explanations.`;

        const userPrompt = `Remote Code:\n${latestBackendContent}\n\nYour Code:\n${userContent}`;

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: GROQ_MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.1
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        let aiResponse = response.data?.choices?.[0]?.message?.content;

        if (!aiResponse) throw new Error("No AI response received");

        aiResponse = aiResponse
            .replace(/^```[a-z]*\n?/gm, "")
            .replace(/```\n?$/gm, "")
            .trim();

        return aiResponse;
    } catch (error) {
        console.log("Smart Merge AI Error:", error.message);
        throw new Error("Failed to merge code");
    }
};
