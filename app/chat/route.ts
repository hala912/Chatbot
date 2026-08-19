import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env.Gemini_api_key,
});



export async function POST(request: Request) {

    const body = await request.json();
    return new Response(JSON.stringify({message: "Hello from the server!"}), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    })
}