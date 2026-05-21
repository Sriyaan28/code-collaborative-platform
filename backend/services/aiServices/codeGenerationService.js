import axios from "axios";
import { config } from "dotenv";

config();

const GROQ_API_KEY = process.env.GROQ_API_KEY?.trim();
const GROQ_MODEL = "llama-3.3-70b-versatile";

export const generateCodeService = async (prompt, currentCode) => {
    try {
        if (!prompt) {
            throw new Error("Prompt is required");
        }

        let systemPrompt = `You are an expert senior software engineer. 
Your task is to generate ONLY the code requested by the user.
If there is existing code, modify or append to it based on the prompt. If there is no existing code, write it from scratch.

Rules:
- Return ONLY the raw code.
- DO NOT wrap the code in markdown blocks (e.g. \`\`\`javascript).
- DO NOT provide explanations, introductions, or summaries.
- DO NOT output any text other than the actual code.`;

        let userPrompt = `Prompt: ${prompt}`;
        if (currentCode) {
            userPrompt += `\n\nExisting Code Context:\n${currentCode}`;
        }

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: GROQ_MODEL,
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: userPrompt
                    }
                ],
                temperature: 0.2
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        let aiResponse = response.data?.choices?.[0]?.message?.content;

        if (!aiResponse) {
            throw new Error("No AI response received");
        }

        // Clean up markdown just in case the AI ignored instructions
        aiResponse = aiResponse
            .replace(/^```[a-z]*\n?/gm, "") // Remove starting ```language
            .replace(/```\n?$/gm, "") // Remove trailing ```
            .trim();

        return aiResponse;

    } catch (error) {
        console.log("Code Generation AI Error:", error.message);
        if (error.response) {
            console.log("API ERROR DATA:", error.response.data);
        }
        throw new Error("Failed to generate code");
    }
};
