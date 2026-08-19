import { GoogleGenAI } from "@google/genai";
import readline from "readline";
const ai = new GoogleGenAI({
  apiKey: process.env.Gemini_api_key,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let history : any[] = []
function askQuestion(){

 rl.question("You:", async (userinput) => {
    if (userinput === 'exit'){ rl.close(); return; }

    history.push({
        role:'user',
        parts:[
            {text:userinput}
        ]
    })
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: history,
    });
    history.push({
        role:'model',
        parts:[
            {text:response.text}
        ]
    })
   
    console.log(response.text);
    askQuestion()
  });
}
async function main() {
 askQuestion()
}

main();
