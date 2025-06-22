import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

const ChatDetail = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUid = auth.currentUser?.uid;

  // 🔄 Fetch messages
  useEffect(() => {
    const q = query(
      collection(db, "chats", id, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [id]);

  // ⬇ Scroll to bottom on message update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 👤 Fetch other user's profile
  useEffect(() => {
    const fetchOtherUser = async () => {
      try {
        const userIds = id.split("_");
        const otherUserId = userIds.find((uid) => uid !== currentUid);
        const userRef = doc(db, "users", otherUserId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setOtherUser(userSnap.data());
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchOtherUser();
  }, [id]);

  // 🚀 Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await addDoc(collection(db, "chats", id, "messages"), {
        text: input.trim(),
        sender: currentUid,
        createdAt: serverTimestamp(),
      });
      setInput("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white text-yellow-500 font-semibold p-4 flex items-center justify-between border-b border-yellow-400 shadow-sm z-10">
        <Link to="/chats" className="flex items-center gap-1 text-yellow-500">
          <ArrowLeft size={20} />
        </Link>

        <div className="flex items-center gap-2">
          {otherUser?.profile_pic && (
            <img
              src={otherUser.profile_pic}
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover"
            />
          )}
          <span className="text-md font-bold">
            @{otherUser?.username || "Loading..."}
          </span>
        </div>

        <div className="w-6" />
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[75%] px-3 py-2 rounded-xl ${
              msg.sender === currentUid
                ? "ml-auto bg-yellow-100"
                : "mr-auto bg-gray-100"
            }`}
          >
            <p
              className={`text-xs font-semibold mb-1 ${
                msg.sender === currentUid
                  ? "text-red-500 text-right"
                  : "text-blue-500 text-left"
              }`}
            >
              {msg.sender === currentUid ? "You" : "Them"}
            </p>
            <p className="text-sm text-black break-words">{msg.text}</p>
            <span className="text-xs text-gray-500 block mt-1 text-right">
              {msg.createdAt?.toDate
                ? msg.createdAt.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
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
