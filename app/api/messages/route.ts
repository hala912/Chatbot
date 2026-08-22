import supabase from "@/lib/supabase";

export async function GET(request: Request) {
   
    const {searchParams} = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const {data , error }= await supabase.from('messages').select('*').
    eq('conversation_id', conversationId);
    
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
    return new Response(JSON.stringify({ messages: data }), {
        status: 200,
        headers: {  "Content-Type": "application/json" },
    });

}