import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from './components/Footer';

const Chats = () => {
  const [chats] = useState([
    { id: 'sunny_boi', lastMessage: 'Found your ID!', time: '2h ago' },
    { id: 'trichy_girl23', lastMessage: 'Did you lose a watch?', time: '5h ago' },
    { id: 'snap_anon', lastMessage: 'Let’s meet at admin block.', time: '1d ago' },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <h1 className="text-xl font-bold text-yellow-600 p-4">📨 Private Chats</h1>
      <div className="flex-1 px-4">
        {chats.map((chat) => (
          <Link
            to={`/chats/${chat.id}`}
            key={chat.id}
            className="block border-b border-gray-200 py-4 hover:bg-yellow-50 rounded px-2 transition"
          >
            <div className="flex justify-between">
              <div>
                <div className="font-semibold text-gray-800">@{chat.id}</div>
                <div className="text-sm text-gray-500 truncate">{chat.lastMessage}</div>
              </div>
              <span className="text-xs text-gray-400">{chat.time}</span>
            </div>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Chats;
