import React, { useEffect, useState, useMemo } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Footer from "../pages/components/Footer";

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("lost");
  const [search, setSearch] = useState(""); // 🔍 search text

  const navigate = useNavigate();

  /* ================= Fetch Items ================= */
  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "items"),
        where("type", "==", selectedType),
        orderBy("createdAt", "desc")
      );

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

  /* ================= Chat ================= */
  const handleReport = async (otherUserId) => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId || !otherUserId) return;

    const combinedId =
      currentUserId > otherUserId
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

  /* ================= Effects ================= */
  useEffect(() => {
    fetchItems();
  }, [selectedType]);

  /* ================= Search Filter ================= */
  const filteredItems = useMemo(() => {
    const text = search.toLowerCase().trim();
    if (!text) return items;

    return items.filter(
      (item) =>
        item.title?.toLowerCase().includes(text) ||
        item.description?.toLowerCase().includes(text)
    );
  }, [items, search]);

  /* ================= Loading ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col pb-24">
        <div className="sticky top-0 z-10 bg-yellow-100 border-b border-yellow-300 shadow-md">
          <div className="py-4 px-4">
            <h1 className="text-2xl font-bold text-yellow-600">
              📦 Lost & Found
            </h1>
            <p className="text-sm text-gray-600">
              See what's reported around campus
            </p>
          </div>
        </div>
        <div className="text-center mt-12 text-gray-500">
          🔄 Loading items...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-24">

      {/* ================= Sticky Header ================= */}
      <div className="sticky top-0 z-10 bg-yellow-100 border-b border-yellow-300 shadow-md">
        <div className="py-4 px-4">
          <h1 className="text-2xl font-bold text-yellow-600">
            📦 Lost & Found
          </h1>
          <p className="text-sm text-gray-600">
            See what's reported around campus
          </p>
        </div>

        {/* ================= Tabs ================= */}
        <div className="flex justify-center pb-3">
          <div className="bg-white rounded-full shadow-md flex overflow-hidden">
            {["lost", "found"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-2 text-sm font-semibold transition-all
                  ${
                    selectedType === type
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
              >
                {type === "lost" ? "🔴 Lost" : "🟢 Found"}
              </button>
            ))}
          </div>
        </div>

        {/* ================= Search Bar ================= */}
        <div className="px-4 pb-4">
          <input
            type="text"
            placeholder="🔍 Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-2xl mx-auto block px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      {/* ================= Items List ================= */}
      <div className="p-4 max-w-2xl mx-auto flex-1">
        {filteredItems.length === 0 ? (
          <div className="text-gray-500 mt-10 text-center">
            No matching {selectedType} items found.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredItems.map((item) => (
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

                {item.submitted_to && (
                  <p className="text-sm text-gray-600 mb-3">
                    Submitted To: {item.submitted_to}
                  </p>
                )}

                <p className="text-xs font-semibold mb-2">
                  {item.type === "lost" ? "🔴 Lost Item" : "🟢 Found Item"}
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

      {/* ================= Footer ================= */}
      <Footer />
    </div>
  );
};

export default Items;
