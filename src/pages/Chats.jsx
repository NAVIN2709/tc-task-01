import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import { db, auth } from '../firebase';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc
} from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const fetchChats = async () => {
      try {
        const chatsRef = collection(db, 'chats');
        const q = query(chatsRef, where('users', 'array-contains', currentUser.uid));
        const snapshot = await getDocs(q);

        const chatData = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const chatId = docSnap.id;
            const data = docSnap.data();

            const otherUserId = data.users.find((uid) => uid !== currentUser.uid);
            const otherUserRef = doc(db, 'users', otherUserId);
            const otherUserSnap = await getDoc(otherUserRef);

            const otherUsername = otherUserSnap.exists()
              ? otherUserSnap.data().username || otherUserId
              : otherUserId;

            return {
              id: chatId,
              username: otherUsername,
            };
          })
        );

        setChats(chatData);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [currentUser]);

  const handleBack = () =>{
    navigate(-1)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white p-3">
      <div className="topbar flex mt-5">
        <div className="backbutton mr-2" onClick={handleBack}>
          <ArrowLeft/>
        </div>
        <h1 className="text-xl font-bold text-yellow-600">📨 Private Chats</h1>
      </div>
      <div className="flex-1 px-4">
        {chats.map((chat) => (
          <Link
            to={`/chats/${chat.id}`}
            key={chat.id}
            className="block border-b border-gray-200 py-4 hover:bg-yellow-50 rounded px-2 transition"
          >
            <div className="flex justify-between">
              <div>
                <div className="font-semibold text-gray-800">@{chat.username}</div>
                <div className="text-sm text-gray-500 truncate">Tap to view chat</div>
              </div>
            </div>
          </Link>
        ))}
        {chats.length === 0 && (
          <div className="text-center text-sm text-gray-500 mt-20">No chats yet 👻</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Chats;
