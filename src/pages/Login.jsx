import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import logo from "/logo.png";

// Slide images
import slide1Img from "/slide1.png";
import slide2Img from "/slide2.png";
import slide3Img from "/slide3.png";
import slide4Img from "/slide4.png";

const slides = [
  {
    title: "Welcome to LostAF",
    description:
      "Discover lost and found items around campus. Stay updated and help your peers!",
    image: slide1Img,
  },
  {
    title: "Post an Item",
    description:
      "Lost something? Post it here and let everyone on campus know. Found an item? Share it and help find the owner.",
    image: slide2Img,
  },
  {
    title: "Browse Items",
    description:
      "Easily see all lost and found items. Filter by type, search for keywords, and find what you need quickly.",
    image: slide3Img,
  },
  {
    title: "Private Chats",
    description:
      "Chat directly with item owners to coordinate pickups or returns securely and privately.",
    image: slide4Img,
  },
];

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const googleSignIn = async () =>
    signInWithPopup(auth, new GoogleAuthProvider());

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await googleSignIn();
      navigate("/onboarding");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
    else setShowLogin(true);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  return (
    <div className="relative flex flex-col h-screen w-full">
      {/* Fullscreen slide */}
      <img
        src={slides[currentSlide].image}
        alt={slides[currentSlide].title}
        className="object-cover w-full h-full"
      />

      {/* Optional dark overlay to make text readable */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Bottom overlay panel for slides */}
      {!showLogin && (
        <div className="absolute bottom-0 w-full bg-yellow-400/95 backdrop-blur-md rounded-t-3xl p-6 flex flex-col items-center shadow-lg">
          <h1 className="text-2xl font-bold text-black mb-3 text-center">
            {slides[currentSlide].title}
          </h1>
          <p className="text-center text-black text-base max-w-md mb-4">
            {slides[currentSlide].description}
          </p>

          {/* Pagination dots */}
          <div className="flex gap-2 mb-4">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 w-8 rounded-full transition-all ${
                  currentSlide === idx ? "bg-black" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between w-full max-w-xs">
            {currentSlide > 0 && (
              <button
                onClick={prevSlide}
                className="px-6 py-3 bg-white rounded-lg hover:bg-gray-100 font-semibold"
              >
                Back
              </button>
            )}
            <button
              onClick={nextSlide}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 font-semibold"
            >
              {currentSlide < slides.length - 1 ? "Next" : "Get Started"}
            </button>
          </div>
        </div>
      )}

      {/* Bottom overlay login panel */}
      {showLogin && (
        <div className="absolute bottom-0 w-full bg-yellow-400/95 backdrop-blur-md rounded-t-3xl p-8 flex flex-col items-center shadow-2xl transition-all duration-500">
          <img
            src={logo}
            alt="LostAF Logo"
            className="mb-4"
            height={100}
            width={100}
          />
          <h1 className="text-xl font-bold text-black mb-6 text-center">
            Lost And Found
          </h1>

          {/* Google login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg hover:bg-yellow-100 transition duration-200 mb-4 bg-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <FcGoogle className="text-xl" />
            )}
            <span className="text-black font-medium">
              {loading ? "Signing in..." : "Continue with Google"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
