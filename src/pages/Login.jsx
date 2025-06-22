import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import logo from "/logo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const googleSignIn = async () => {
    console.log("Signing in with Google...");
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await googleSignIn();
      console.log("Signed in with Google");
      navigate("/onboarding");
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-yellow-400 px-6">
      <img src={logo} alt="LostAF Logo" className="w-32 mb-6 drop-shadow" />
      <h1 className="text-3xl font-bold text-black mb-6">LostAF</h1>

      {/* 🔐 Google Login Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full max-w-xs flex items-center justify-center gap-3 py-3 px-4 rounded-lg hover:bg-pink-50 transition duration-200 mb-4 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="w-5 h-5 border-1 border-black border-t-transparent rounded-full animate-spin" />
        ) : (
          <FcGoogle className="text-xl" />
        )}
        <span className="text-black font-medium">
          {loading ? "Signing in..." : "Continue with Google"}
        </span>
      </button>
    </div>
  );
};

export default Login;
