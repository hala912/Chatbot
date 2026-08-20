import supabase from "@/lib/supabase";

 export async function POST(request: Request) {

  const body = await request.json();
  const {data , error }= await supabase.from('conversation').insert({
    title: body.title,
  })
  .select()
  .single();
  if (error) console.error(error);
  return new Response(JSON.stringify({ conversation: data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}