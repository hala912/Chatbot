"use client";
import { useEffect, useState } from "react";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);

  const handelsend = async () => {
    if (!message.trim()) return;
    const newMessage = { role: "user", parts: [{ text: message }] };
    const updatedHistory = [...chatHistory, newMessage];
    setChatHistory(updatedHistory);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: updatedHistory, conversationId }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const aiMessage = { role: "model", parts: [{ text: data.message }] };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostConversationId = async () => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "tet Conversation" }),
      });
      const data = await response.json();
      setConversationId(data.conversation.id);
      setChatHistory([]);
    } catch (err) {
      console.error(err);
    }
  };

  const Getconversations = async () => {
    try {
      const response = await fetch("/api/chat", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setConversations(data.conversations);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    Getconversations();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm px-6">
        <span className="text-lg font-semibold">My Chatbot</span>
      </div>
      <h3 className="text-lg font-semibold px-6 py-2 bg-base-100 shadow-sm">
        {conversations[0]?.title || "No Conversations"}
      </h3>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 max-w-2xl w-full mx-auto">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={
              msg.role === "user" ? "chat chat-end" : "chat chat-start"
            }
          >
            <div
              className={
                msg.role === "user"
                  ? "chat-bubble chat-bubble-primary"
                  : "chat-bubble"
              }
            >
              {msg.parts.map((part: any, i: number) => (
                <span key={i}>{part.text}</span>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat chat-start">
            <div className="chat-bubble">
              <span className="loading loading-dots loading-sm"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-base-100 border-t max-w-2xl w-full mx-auto flex gap-2">
        <input
          type="text"
          className="input input-bordered flex-1"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handelsend()}
        />
        <button className="btn btn-primary" onClick={handelsend}>
          Send
        </button>
        <button
          className="btn btn-secondary"
          onClick={handlePostConversationId}
        >
          New Conversation
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
