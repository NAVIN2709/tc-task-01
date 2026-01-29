import React, { useState, useEffect } from "react";
import { Share2, Bell } from "lucide-react";
import { Info, X } from "lucide-react";
import Footer from "./components/Footer";
import { signOut } from "firebase/auth";
import { auth, db, messaging } from "../firebase";
import { getToken, deleteToken } from "firebase/messaging";
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

/* ================= FCM TOKEN SAVE ================= */
const saveFcmToken = async (userId) => {
  try {
    if (!("Notification" in window)) return;

    // 1️⃣ Register Service Worker
    let registration;
    if ("serviceWorker" in navigator) {
      registration = await navigator.serviceWorker.register("/sw.js");
    }

    // 2️⃣ Request Notification Permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return;
    }

    // 3️⃣ Delete old token (Force Refresh)
    try {
      await deleteToken(messaging);
      console.log("Old FCM token deleted.");
    } catch (err) {
      console.warn("Failed to delete old token:", err);
    }

    // 4️⃣ Get New FCM Token
    const token = await getToken(messaging, {
      vapidKey:
        "BNd8QsYSe4Pmtqgs7o4E1nSaDycK_pQyC1lIgD3FvxQJCzbMqlbjE-tuucysFX1FDxJRQnthPnwi80GGr4gum_U",
      serviceWorkerRegistration: registration,
    });

    if (!token) return;

    // 5️⃣ Save token to Firestore
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      fcmToken: token,
      notificationsEnabled: true,
      tokenUpdatedAt: serverTimestamp(),
    });

    console.log("New FCM token saved: ", token);
  } catch (error) {
    console.error("Error saving FCM token:", error);
  }
};

const Profile = () => {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [userItems, setUserItems] = useState([]);
  const [collegeId, setCollegeId] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

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
        if (data.notificationsEnabled !== undefined) {
          setNotificationsEnabled(data.notificationsEnabled);
        }
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

  const handleLogin = () => {
    navigate("/login");
  };

  const confirmToggle = async () => {
    if (!user) return;
    try {
      if (notificationsEnabled) {
        // Disable
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          notificationsEnabled: false,
        });
        setNotificationsEnabled(false);
      } else {
        // Enable
        await saveFcmToken(user.uid);
        // saveFcmToken updates firestore, so just update local state
        setNotificationsEnabled(true);
      }
    } catch (error) {
      console.error("Error updating notifications:", error);
    } finally {
      setShowNotificationModal(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen pt-16 bg-white px-4">
        <div className="button flex flex-col items-center justify-center mt-10">
          <p className="mt-2 text-lg text-gray-600">
            To view your profile , please login
          </p>
          <button
            onClick={handleLogin}
            className="bg-yellow-400 px-2 py-3 text-md mt-2 text-center text-black w-40 rounded-full font-semibold"
          >
            Login
          </button>
        </div>
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

      {/* Notifications Toggle */}
      <div className="mt-6 w-full max-w-sm flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
            <Bell className="w-5 h-5" />
          </div>
          <span className="font-semibold text-gray-700">Notifications</span>
        </div>

        <button
          onClick={() => setShowNotificationModal(true)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${notificationsEnabled ? "bg-green-500" : "bg-gray-300"}`}
        >
          <span
            className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ease-in-out ${notificationsEnabled ? "translate-x-6" : "translate-x-0"}`}
          />
        </button>
      </div>

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
                  href="mailto:navinnitt2006@gmail.com"
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

      {/* Notification Confirmation Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-11/12 max-w-sm rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {notificationsEnabled
                ? "Disable Notifications?"
                : "Enable Notifications?"}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {notificationsEnabled
                ? "You won't receive updates about your lost items."
                : "You will receive updates when someone finds your item."}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="flex-1 py-2 text-gray-600 bg-gray-100 font-semibold rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggle}
                className={`flex-1 py-2 text-white font-semibold rounded-lg hover:opacity-90 ${notificationsEnabled ? "bg-red-500" : "bg-green-500"}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
