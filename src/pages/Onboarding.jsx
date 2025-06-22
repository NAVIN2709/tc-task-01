import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db, auth } from "../firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const profilePics = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Ghost1",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Ghost2",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Ghost3",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Ghost4",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Ghost5",
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(()=>{
    const user = auth.currentUser;
    if (!user) {
      alert("Not signed in!");
      return;
    }
    const userDocRef = doc(db, "users", user.uid);
    getDoc(userDocRef).then((doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        if (userData.onboarding_completed) {
          navigate("/");
        }
      }
    });
  },[auth.currentUser.uid])

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % profilePics.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? profilePics.length - 1 : prev - 1
    );
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Not signed in!");
      return;
    }

    if (!username.trim()) {
      alert("Username cannot be empty.");
      return;
    }

    try {
      // 💾 Save onboarding data
      const userDocRef = doc(db, "users", user.uid);
      
      const userData = {
        username: username.trim(),
        profile_pic: profilePics[selectedIndex],
        created: serverTimestamp(),
        onboarding_completed: true,
      };

      await setDoc(userDocRef, userData, { merge: true });
      console.log("User profile saved!");
      navigate("/");
    } catch (error) {
      console.error("Error during onboarding:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-400 px-6 py-10 text-center">
      <h1 className="text-3xl font-extrabold text-black mb-4">
        Pick your vibe 👻
      </h1>

      {/* Username Input */}
      <input
        type="text"
        placeholder="Enter a cool username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-6 px-4 py-3 rounded-full w-full max-w-sm text-center text-black placeholder-gray-600 border border-yellow-300 shadow focus:outline-none focus:ring-2 focus:ring-black"
      />

      {/* Image Slider */}
      <div className="relative w-40 h-40 mb-6">
        <img
          src={profilePics[selectedIndex]}
          alt="Avatar"
          className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg bg-white transition-all duration-300"
        />

        {/* Prev Button */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-[-2.5rem] -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5 text-black" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-[-2.5rem] -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!username.trim()}
        className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Start Swagging
      </button>
    </div>
  );
};

export default Onboarding;
