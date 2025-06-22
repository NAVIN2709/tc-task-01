import React, { useState, useEffect } from "react";
import Footer from "./components/Footer";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.username);
        setInputValue(data.username);
        setProfilePic(data.profile_pic);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    if (!inputValue.trim()) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        username: inputValue.trim(),
        updatedAt: serverTimestamp(),
      });
      setUsername(inputValue.trim());
      setEditing(false);
    } catch (err) {
      console.error("Error updating username:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Placeholder user items (replace with Firestore later if needed)
  const userItems = [
    { id: 1, title: "Lost Bag", type: "lost" },
    { id: 2, title: "Found ID Card", type: "found" },
    { id: 3, title: "Lost Watch", type: "lost" },
    { id: 4, title: "Found Phone", type: "found" },
  ];

  const lostCount = userItems.filter((item) => item.type === "lost").length;
  const foundCount = userItems.filter((item) => item.type === "found").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yellow-100">
        <div className="animate-spin w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-16 bg-white px-4">
      {/* Avatar */}
      <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-yellow-300 shadow-md mb-4">
        <img
          src={profilePic || "https://api.dicebear.com/7.x/bottts/svg?seed=Ghost"}
          alt="avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Username + Edit */}
      <div className="flex flex-col items-center">
        {editing ? (
          <>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="p-2 border rounded w-48 text-center mb-2"
            />
            <button
              onClick={handleSave}
              className="bg-yellow-500 text-white px-4 py-1 rounded shadow"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-yellow-600 mb-1">
              @{username}
            </h2>
            <button
              onClick={() => setEditing(true)}
              className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-3 py-1 rounded-full shadow transition duration-200"
            >
              ✏️ Edit Username
            </button>
          </>
        )}
      </div>

      {/* Stats Section */}
      <div className="mt-8 border border-yellow-200 bg-white rounded-xl shadow p-4 w-full max-w-sm text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          📦 Your Contributions
        </h3>
        <div className="flex justify-around text-yellow-600 font-bold text-lg">
          <div>
            <p className="text-sm text-gray-500">Lost Items</p>
            {lostCount}
          </div>
          <div>
            <p className="text-sm text-gray-500">Found Items</p>
            {foundCount}
          </div>
        </div>
      </div>

      <div className="mt-10 text-sm text-gray-500">
        👻 Your public profile on SnapMap
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-medium shadow transition duration-200"
      >
        🚪 Sign Out
      </button>

      <Footer />
    </div>
  );
};

export default Profile;
