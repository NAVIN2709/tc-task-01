import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ChatDetail = () => {
  const { id } = useParams(); // Username from URL
  const [messages, setMessages] = useState([
    { sender: "me", text: "Hey! I lost something.", time: "10:00 AM" },
    { sender: id, text: "Oh, what was it?", time: "10:01 AM" },
    { sender: "me", text: "A yellow bag near admin block.", time: "10:02 AM" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      sender: "me",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white text-yellow-500 font-semibold p-4 flex items-center justify-between border-b border-yellow-400 shadow-sm z-10">
        <Link to="/chats" className="flex items-center gap-1 text-yellow-500">
          <ArrowLeft size={20} />
        </Link>
        <span className="text-md font-bold">@{id}</span>
        <div className="w-6" />
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[75%] px-3 py-2 rounded-xl ${
              msg.sender === "me"
                ? "ml-auto bg-yellow-100"
                : "mr-auto bg-gray-100"
            }`}
          >
            <p
              className={`text-xs font-semibold mb-1 ${
                msg.sender === "me"
                  ? "text-red-500 text-right"
                  : "text-blue-500 text-left"
              }`}
            >
              {msg.sender === "me" ? "You" : msg.sender}
            </p>
            <p className="text-sm text-black break-words">{msg.text}</p>
            <span className="text-xs text-gray-500 block mt-1 text-right">
              {msg.time}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-2 px-4 py-3 border-t border-gray-300 bg-white sticky bottom-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-black rounded-full text-sm focus:outline-yellow-400"
        />
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-full text-sm font-semibold"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatDetail;
