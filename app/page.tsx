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

   
    let activeId = conversationId;
    if (!activeId) {
      activeId = await createConversation();
    }

    const newMessage = { role: "user", parts: [{ text: message }] };
    const updatedHistory = [...chatHistory, newMessage];
    setChatHistory(updatedHistory);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: updatedHistory, conversationId: activeId }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const aiMessage = { role: "model", parts: [{ text: data.message }] };
      setChatHistory((prev) => [...prev, aiMessage]);

      if (data.title) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeId ? { ...conv, title: data.title } : conv
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  const createConversation = async (): Promise<string | null> => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New chat" }),
      });
      const data = await response.json();
      setConversationId(data.conversation.id);
      setConversations((prev) => [data.conversation, ...prev]);
      return data.conversation.id;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleNewChat = () => {
    setConversationId(null);
    setChatHistory([]);
  };

  const Getconversations = async () => {
    try {
      const response = await fetch("/api/conversations", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setConversations(data.conversations);
    } catch (err) {
      console.error(err);
    }
  };

  const GetMessages = async (id: string) => {
    if (!id) return;
    try {
      const response = await fetch(`/api/messages?conversationId=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      const formatted = data.messages.map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));
      setChatHistory(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    Getconversations();
  }, []);

  return (
    <div className="flex h-screen bg-[#131314] text-[#e3e3e3]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-white/10 flex flex-col p-3">
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 rounded-full px-4 py-2.5 mb-4 bg-[#1e1f20] hover:bg-[#2a2b2d] transition-colors text-sm w-fit"
        >
          <span className="text-lg leading-none">+</span>
          New chat
        </button>

        <div className="text-xs text-[#9aa0a6] px-3 mb-1 mt-2">Recent</div>
        <div className="flex-1 overflow-y-auto space-y-0.5">
          {conversations.length === 0 && (
            <p className="text-xs text-[#9aa0a6] px-3 py-2">
              No conversations yet
            </p>
          )}
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => {
                setConversationId(conv.id);
                GetMessages(conv.id);
              }}
              className={`w-full text-left truncate rounded-full px-3 py-2 text-sm transition-colors ${
                conv.id === conversationId
                  ? "bg-[#3c4043] text-white"
                  : "hover:bg-[#1e1f20] text-[#c4c7c5]"
              }`}
            >
              {conv.title}
            </button>
          ))}
        </div>
      </aside>

     
      <div className="flex-1 flex flex-col">
        {chatHistory.length === 0 ? (
         
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl font-medium mb-8 bg-gradient-to-r from-[#4285f4] via-[#9b72cb] to-[#d96570] bg-clip-text text-transparent">
              What can I help with?
            </h1>
            <div className="w-full max-w-2xl">
              <InputBar
                message={message}
                setMessage={setMessage}
                onSend={handelsend}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-8">
              <div className="max-w-2xl mx-auto space-y-6">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    <div
                      className={
                        msg.role === "user"
                          ? "bg-[#1e1f20] rounded-3xl px-4 py-2.5 max-w-[80%]"
                          : "max-w-[85%] leading-relaxed"
                      }
                    >
                      {msg.parts.map((part: any, i: number) => (
                        <span key={i} className="whitespace-pre-wrap">
                          {part.text}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <span className="loading loading-dots loading-sm text-[#9aa0a6]"></span>
                  </div>
                )}
              </div>
            </div>
            <div className="px-4 pb-6">
              <div className="max-w-2xl mx-auto">
                <InputBar
                  message={message}
                  setMessage={setMessage}
                  onSend={handelsend}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const InputBar = ({
  message,
  setMessage,
  onSend,
}: {
  message: string;
  setMessage: (v: string) => void;
  onSend: () => void;
}) => (
  <div className="flex items-center gap-2 bg-[#1e1f20] rounded-full px-5 py-3 border border-white/10">
    <input
      type="text"
      className="flex-1 bg-transparent outline-none text-[#e3e3e3] placeholder:text-[#9aa0a6]"
      placeholder="Ask anything"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onSend()}
    />
    <button
      onClick={onSend}
      disabled={!message.trim()}
      className="rounded-full w-8 h-8 flex items-center justify-center bg-[#4285f4] disabled:bg-[#3c4043] disabled:text-[#9aa0a6] transition-colors"
    >
      ↑
    </button>
  </div>
);

export default ChatPage;