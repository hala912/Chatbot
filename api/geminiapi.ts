import {GoogleGenAI} from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.Gemini_api_key,
});


async function main() {
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: ["hello"]
  });
  console.log(response.text);
}

main()