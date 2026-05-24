import axios from "axios";
import { config } from "dotenv";

config();

const GROQ_API_KEY =
    process.env.GROQ_API_KEY?.trim();

const GROQ_MODEL =
    "meta-llama/llama-4-scout-17b-16e-instruct";

export const analyzeCodeHealth = async (
    code
) => {

    try {

        if (!code) {

            throw new Error(
                "Code is required"
            );
        }

        const prompt = `
You are an expert senior software engineer.

Analyze the following code.

Return ONLY valid JSON.

Response format:

{
  "codeHealth": number,
  "summary": string,
  "hasSuggestions": boolean,
  "strengths": [],
  "issues": [],
  "suggestions": [],
  "performanceScore": number,
  "readabilityScore": number,
  "maintainabilityScore": number,
  "securityScore": number,
  "scalabilityScore": number,
  "complexityLevel": string,
  "techDebt": number,
  "improvedCodeLines": []
}

Rules:
- CRITICAL: If the code contains syntax, compilation, or obvious runtime errors, instantly drop all scores below 30.
- Be extremely generous with scoring. If the code is functionally correct and has no serious errors, give it a score of 95-100.
- Do NOT point out minor styling, formatting, or nitpicky errors. Only report issues if they are compilation, runtime, or serious security/logic flaws.
- codeHealth must be out of 100
- performanceScore must be out of 100
- readabilityScore must be out of 100
- maintainabilityScore must be out of 100
- securityScore must be out of 100
- scalabilityScore must be out of 100
- techDebt must be out of 100
- improvedCodeLines must contain the FULL improved code
- improvedCodeLines must be an array of strings
- Each array item must contain EXACTLY one line of code
- Add comments if needed
- Return ONLY valid parsable JSON
- Do not explain outside JSON
- Do not use markdown
- Do not wrap response in triple backticks

Code:
${code}
`;

        const response =
            await axios.post(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    model: GROQ_MODEL,

                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],

                    temperature: 0.2
                },
                {
                    headers: {
                        Authorization: `Bearer ${GROQ_API_KEY}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );

        let aiResponse =
            response.data
                ?.choices?.[0]
                ?.message?.content;

        if (!aiResponse) {

            throw new Error(
                "No AI response received"
            );
        }

        // CLEAN RESPONSE
        aiResponse = aiResponse
            .replace(/```json\s*/g, "")
            .replace(/```/g, "")
            .replace(
                /[\u0000-\u0008\u000B\u000C\u000E-\u001F]+/g,
                ""
            )
            .trim();

        // PARSE JSON
        let parsedResponse;

        try {

            parsedResponse =
                JSON.parse(aiResponse);

        }
        catch (parseError) {

            console.log(
                "RAW AI RESPONSE:\n",
                aiResponse
            );

            console.log(
                "PARSE ERROR:\n",
                parseError.message
            );

            throw new Error(
                "Invalid AI JSON response"
            );
        }

        // JOIN CODE LINES
        const improvedCode =
            Array.isArray(
                parsedResponse.improvedCodeLines
            )
                ? parsedResponse
                    .improvedCodeLines
                    .join("\n")
                : "";

        // FINAL RESPONSE
        return {

            codeHealth:
                parsedResponse.codeHealth || 0,

            summary:
                parsedResponse.summary ||
                "No summary provided",

            hasSuggestions:
                parsedResponse.hasSuggestions || false,

            strengths:
                parsedResponse.strengths || [],

            issues:
                parsedResponse.issues || [],

            suggestions:
                parsedResponse.suggestions || [],

            performanceScore:
                parsedResponse.performanceScore || 0,

            readabilityScore:
                parsedResponse.readabilityScore || 0,

            maintainabilityScore:
                parsedResponse.maintainabilityScore || 0,

            securityScore:
                parsedResponse.securityScore || 0,

            scalabilityScore:
                parsedResponse.scalabilityScore || 0,

            complexityLevel:
                parsedResponse.complexityLevel || "Unknown",

            techDebt:
                parsedResponse.techDebt || 0,

            improvedCode
        };

    }
    catch (error) {

        console.log(
            "Code Health AI Error:",
            error.message
        );

        if (error.response) {

            console.log(
                "API ERROR DATA:",
                error.response.data
            );
        }

        throw new Error(
            "Failed to analyze code health"
        );
    }
};