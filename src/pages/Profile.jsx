import React, { useState } from "react";
import Footer from "./components/Footer";

const Profile = () => {
  const [username, setUsername] = useState("snap_user42");
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(username);

  // Sample user items (replace with actual data later)
  const userItems = [
    { id: 1, title: "Lost Bag", type: "lost" },
    { id: 2, title: "Found ID Card", type: "found" },
    { id: 3, title: "Lost Watch", type: "lost" },
    { id: 4, title: "Found Phone", type: "found" },
  ];

  const lostCount = userItems.filter((item) => item.type === "lost").length;
  const foundCount = userItems.filter((item) => item.type === "found").length;

  const handleSave = () => {
    if (inputValue.trim()) {
      setUsername(inputValue.trim());
      setEditing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-16 bg-white px-4">
      {/* Avatar */}
      <div className="w-28 h-28 rounded-full bg-yellow-400 border-4 border-white shadow-md mb-4"></div>

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

      <Footer />
    </div>
  );
};

export default Profile;
