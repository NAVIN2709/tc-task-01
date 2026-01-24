import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db, auth, messaging } from "../firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";
import { useNavigate } from "react-router-dom";
import collegeData from "../data/collegeData.json";

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
      { merge: true },
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
  const [collegeId, setCollege] = useState("");
  const [collegeLocked, setCollegeLocked] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const savedCollegeId = localStorage.getItem("collegeId");

    if (savedCollegeId) {
      setCollege(savedCollegeId);
      setCollegeLocked(true);
    }

    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
    } else {
      const userDocRef = doc(db, "users", user.uid);
      getDoc(userDocRef).then((snap) => {
        if (snap.exists() && snap.data().onboarding_completed) {
          navigate("/");
        }
      });
    }
  }, [navigate]);

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % profilePics.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? profilePics.length - 1 : prev - 1,
    );
  };

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!collegeId) {
      alert("Please select your college.");
      return;
    }
    localStorage.setItem("collegeId", collegeId);

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
        collegeId: collegeId,
      };

      // 1️⃣ Save profile data
      await setDoc(userDocRef, userData, { merge: true });

      // 2️⃣ Ask permission & save notification token
      await saveFcmToken(user.uid);

      console.log("Onboarding completed");
      if (deferredPrompt) {
        setShowInstallModal(true);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    localStorage.setItem("installPromptDismissed", "true");

    setDeferredPrompt(null);
    setShowInstallModal(false);
    navigate("/");
  };

  const handleSkipInstall = () => {
    setShowInstallModal(false);
    navigate("/");
  };

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
      {/* College Dropdown */}
      <select
        value={collegeId}
        onChange={(e) => setCollege(e.target.value)}
        disabled={collegeLocked}
        className="mb-6 px-4 py-3 rounded-full w-full max-w-sm text-center text-black border border-yellow-300 shadow focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option value="" disabled>
          Select your college 🎓
        </option>

        {Object.entries(collegeData).map(([name, data]) => (
          <option key={data.id} value={data.id}>
            {name.toUpperCase()}
          </option>
        ))}
      </select>

      {collegeLocked && (
        <p className="text-sm text-black/70 mb-4">
          College is locked and cannot be changed 🎓
        </p>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!username.trim() || loading || !collegeId}
        className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-40"
      >
        {loading ? "Loading ..." : "Submit"}
      </button>
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
            <h2 className="text-xl font-extrabold mb-2">Install App 🚀</h2>
            <p className="text-sm text-gray-600 mb-6">
              Get faster access, notifications, and a full-screen experience.
            </p>

            <button
              onClick={handleInstall}
              className="w-full bg-black text-white py-3 rounded-full font-semibold mb-3"
            >
              Install App
            </button>

            <button
              onClick={handleSkipInstall}
              className="w-full text-gray-600 py-2 text-sm"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
