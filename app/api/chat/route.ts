import { GoogleGenAI } from "@google/genai";
import supabase from "@/lib/supabase";

const ai = new GoogleGenAI({
  apiKey: process.env.Gemini_api_key,
});

export async function POST(request: Request) {
  const body = await request.json();
  const conversationId = body.conversationId;
  const result = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: body.history,
  });

  const { error: userError } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    role: "user",
    text: body.history[body.history.length - 1].parts[0].text,
  });

  let newTitle = null;
  if (body.history.length === 1) {
    newTitle = body.history[0].parts[0].text.slice(0, 20);
    await supabase
      .from("conversation")
      .update({ title: newTitle })
      .eq("id", conversationId);
  }
  if (userError) console.error(userError);

  const { error: aiError } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    role: "model",
    text: result.text,
  });
  if (aiError) console.error(aiError);

  return new Response(
    JSON.stringify({ message: result.text, title: newTitle }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}

export async function GET() {
  const { data, error } = await supabase
    .from("conversation")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) console.error(error);

  return new Response(JSON.stringify({ conversations: data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
