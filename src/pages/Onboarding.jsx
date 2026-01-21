import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db, auth, messaging } from "../firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";
import { useNavigate } from "react-router-dom";

const profilePics = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Ghost1",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Ghost2",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Ghost3",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Ghost4",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Ghost5",
];

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

    // 3️⃣ Get FCM Token
    const token = await getToken(messaging, {
      vapidKey:
        "BNd8QsYSe4Pmtqgs7o4E1nSaDycK_pQyC1lIgD3FvxQJCzbMqlbjE-tuucysFX1FDxJRQnthPnwi80GGr4gum_U",
      serviceWorkerRegistration: registration,
    });

    if (!token) return;

    // 4️⃣ Save token to Firestore
    await setDoc(
      doc(db, "users", userId),
      {
        fcmToken: token,
        notificationsEnabled: true,
        tokenUpdatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log("FCM token saved");
  } catch (error) {
    console.error("Error saving FCM token:", error);
  }
};

/* ================= COMPONENT ================= */
const Onboarding = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ================= Check Existing User ================= */
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    getDoc(userDocRef).then((snap) => {
      if (snap.exists() && snap.data().onboarding_completed) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % profilePics.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? profilePics.length - 1 : prev - 1
    );
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const user = auth.currentUser;
    const collegeId = localStorage.getItem("collegeId")

    if (!user) {
      alert("Not signed in!");
      return;
    }

    if (!username.trim()) {
      alert("Username cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const userDocRef = doc(db, "users", user.uid);

      const userData = {
        username: username.trim(),
        profile_pic: profilePics[selectedIndex],
        onboarding_completed: true,
        created: serverTimestamp(),
        collegeId : collegeId 
      };

      // 1️⃣ Save profile data
      await setDoc(userDocRef, userData, { merge: true });

      // 2️⃣ Ask permission & save notification token
      await saveFcmToken(user.uid);

      console.log("Onboarding completed");
      navigate("/");
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-400 px-6 py-10 text-center">
      <h1 className="text-3xl font-extrabold text-black mb-4">
        Pick your name 👻
      </h1>

      {/* Username Input */}
      <input
        type="text"
        placeholder="Enter a cool username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-6 px-4 py-3 rounded-full w-full max-w-sm text-center text-black placeholder-gray-600 border border-yellow-300 shadow focus:outline-none focus:ring-2 focus:ring-black"
      />

      {/* Avatar Slider */}
      <div className="relative w-40 h-40 mb-6">
        <img
          src={profilePics[selectedIndex]}
          alt="Avatar"
          className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg bg-white"
        />

        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-[-2.5rem] -translate-y-1/2 bg-white p-2 rounded-full shadow"
        >
          <ChevronLeft className="w-5 h-5 text-black" />
        </button>

        <button
          onClick={handleNext}
          className="absolute top-1/2 right-[-2.5rem] -translate-y-1/2 bg-white p-2 rounded-full shadow"
        >
          <ChevronRight className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!username.trim() || loading}
        className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-40"
      >
        {loading ? "Loading ..." : "Submit"}
      </button>
    </div>
  );
};

export default Onboarding;
