import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Footer from '../pages/components/Footer';

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(data);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (otherUserId) => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId || !otherUserId) return;

    const combinedId = currentUserId > otherUserId
      ? `${currentUserId}_${otherUserId}`
      : `${otherUserId}_${currentUserId}`;

    try {
      const chatRef = doc(db, "chats", combinedId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          users: [currentUserId, otherUserId],
          createdAt: serverTimestamp(),
        });
      }

      navigate(`/chats/${combinedId}`);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <div className="text-center mt-16 text-gray-500">🔄 Loading items...</div>;

  return (
    <div className="pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-yellow-100 py-4 px-4 border-b border-yellow-300 shadow-md">
        <h1 className="text-2xl font-bold text-yellow-600">📦 All Lost & Found</h1>
        <p className="text-sm text-gray-600">See what's reported around campus</p>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {items.length === 0 ? (
          <div className="text-gray-500 mt-10 text-center">No items found.</div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300"
              >

                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  {item.title}
                </h2>

                <p className="text-sm text-gray-600 mb-3">
                  {item.description}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Submitted To : {item.submitted_to}
                </p>

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="rounded-lg w-full object-cover max-h-56 mb-4"
                  />
                )}

                {item.submitted_by &&
                  item.submitted_by !== auth.currentUser?.uid && (
                    <button
                      onClick={() => handleReport(item.submitted_by)}
                      className="text-sm bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1.5 rounded-full font-medium transition"
                    >
                      💬 Post Message
                    </button>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Items;
