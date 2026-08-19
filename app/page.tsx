"use client";
import { useState } from "react";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ history: updatedHistory }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const aiMessage = { role: "model", parts: [{ text: data.message }] };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm px-6">
        <span className="text-lg font-semibold">My Chatbot</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 max-w-2xl w-full mx-auto">
        {chatHistory.map((msg, index) => (
          <div key={index} className={msg.role === "user" ? "chat chat-end" : "chat chat-start"}>
            <div className={msg.role === "user" ? "chat-bubble chat-bubble-primary" : "chat-bubble"}>
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
      </div>
    </div>
  );
};

export default ChatPage;