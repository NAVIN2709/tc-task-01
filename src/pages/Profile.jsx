import React, { useState, useEffect } from "react";
import { Share2 } from "lucide-react";
import { Info, X } from "lucide-react";
import Footer from "./components/Footer";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import collegeData from "../data/collegeData.json";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [userItems, setUserItems] = useState([]);
  const [collegeId, setCollegeId] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);

  const navigate = useNavigate();
  const user = auth.currentUser;

  // Fetch user profile
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
        localStorage.setItem("collegeId", data.collegeId);
        setCollegeId(data.collegeId);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  // Fetch user's submitted items
  useEffect(() => {
    const fetchUserItems = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "items"),
          where("submitted_by", "==", user.uid),
        );
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserItems(items);
      } catch (err) {
        console.error("Error fetching user items:", err);
      }
    };

    fetchUserItems();
  }, [user]);

  const collegeName =
      collegeId &&
      Object.keys(collegeData).find((key) => collegeData[key].id === collegeId);

  const inviteUrl = collegeName
    ? `${window.location.origin}/invite/${collegeName}`
    : null;

  // Save updated username
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

  // Sign out
  const handleSignOut = async () => {
    try {
      localStorage.removeItem("collegeId");
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Mark an item as done (delete it)
  const handleDeleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, "items", itemId));
      setUserItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleShare = async () => {
    if (!inviteUrl) return;

    const shareData = {
      title: "Try this app",
      text: "Hey! Try out this cool snapchat style app to find your lost things !",
      url: inviteUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text}\n${shareData.url}`,
        );
        alert("Invite link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  if (loading || !userItems || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-16 bg-white px-4">
      <button
        onClick={() => setShowContactModal(true)}
        className="
    absolute
    top-4
    right-4
    flex
    items-center
    gap-2
    text-yellow-600
    hover:text-yellow-700
    font-medium
  "
      >
        <Info className="w-5 h-5" />
        <span className="text-sm">Help</span>
      </button>

      {/* Avatar */}
      <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-yellow-300 shadow-md mb-4">
        <img
          src={
            profilePic || "https://api.dicebear.com/7.x/bottts/svg?seed=Ghost"
          }
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

      {/* User Items Section */}
      <div className="mt-8 w-full max-w-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
          📦 Your Items
        </h3>

        {userItems.length === 0 ? (
          <p className="text-center text-gray-500">No items submitted yet.</p>
        ) : (
          <ul className="space-y-4">
            {userItems.map((item) => (
              <li
                key={item.id}
                className="border border-yellow-200 rounded-lg bg-white shadow-sm p-3"
              >
                <div className="flex gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt="item"
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-yellow-700">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>

                <button
                  className="mt-3 bg-green-500 hover:bg-green-600 text-white text-xs px-4 py-1 rounded-full font-medium transition duration-200"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  ✅ Mark as Done
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Public Note */}
      <div className="mt-10 text-base text-gray-500">
        👻 Your public profile
      </div>

      {/* Invite Friends */}
      {inviteUrl && (
        <div className="mt-4 w-full max-w-sm flex">
          <p className="text-sm text-gray-700 font-medium text-center mb-3">
            🎓 Invite friends from your college
          </p>

          <button
            onClick={handleShare}
            className="
        w-60
        flex
        items-center
        justify-center
        gap-2
        bg-yellow-500
        hover:bg-yellow-600
        text-white
        font-semibold
        py-2
        rounded-full
        shadow-md
      "
          >
            <Share2 className="w-5 h-5" />
            Share App
          </button>
        </div>
      )}

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-medium shadow transition duration-200"
      >
        🚪 Sign Out
      </button>
      <Footer />

      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative bg-white w-11/12 max-w-md rounded-xl shadow-lg p-6">
            {/* Close Button */}
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2 className="text-lg font-bold text-yellow-600 mb-3 text-center">
              📩 Contact & Support
            </h2>

            {/* Contact Info */}
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                For any queries, feedback, or issues, feel free to reach out:
              </p>
              <p>
                📧 Email:{" "}
                <a
                  href="mailto:snavinnitt2006@gmail.com"
                  className="text-yellow-600 underline"
                >
                  navinnitt2006@gmail.com
                </a>
              </p>
            </div>

            {/* Divider */}
            <div className="my-4 border-t"></div>

            {/* Policy Links */}
            <div className="flex flex-col gap-2 text-center text-sm">
              <button
                onClick={() => {
                  setShowContactModal(false);
                  navigate("/terms-and-conditions");
                }}
                className="text-blue-600 hover:underline"
              >
                📄 Terms & Conditions
              </button>

              <button
                onClick={() => {
                  setShowContactModal(false);
                  navigate("/privacy-policies");
                }}
                className="text-blue-600 hover:underline"
              >
                🔐 Privacy Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
