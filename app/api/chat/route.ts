import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({
    apiKey: process.env.Gemini_api_key,
});

export async function POST(request: Request) {

    const body = await request.json();
    const result = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: body.history,
    });
    return new Response(JSON.stringify({message: result.text}), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    })
}