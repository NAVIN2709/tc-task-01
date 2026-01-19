import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import { Camera } from "lucide-react";
import InstallAppButton from "./components/InstallButton";
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  where,
} from "firebase/firestore";

/* ================= Leaflet Marker Fix ================= */
const defaultIcon = L.icon({
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

/* ================= Component ================= */
const Home = () => {
  const mapRef = useRef();
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [selectedType, setSelectedType] = useState("lost"); // 🔴 lost | 🟢 found

  /* ================= Fetch Items ================= */
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const q = query(
          collection(db, "items"),
          where("type", "==", selectedType),
          orderBy("createdAt", "desc"),
        );

        const snapshot = await getDocs(q);

        const markers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLocations(markers);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [selectedType]);

  /* ================= Actions ================= */
  const handleOpenCamera = () => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }
    navigate("/newplace");
  };

  const handleReport = async (otherUserId) => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) return;

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

  /* ================= Render ================= */
  return (
    <div className="h-screen w-full relative">
      <div className="absolute top-4 left-4 sm:top-10 sm:left-10 z-[6000]">
        <InstallAppButton />
      </div>

      <MapContainer
        center={[10.7602, 78.8142]}
        zoom={15}
        scrollWheelZoom
        whenCreated={(map) => (mapRef.current = map)}
        style={{ height: "calc(100vh - 64px)", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {locations.map((loc) => (
          <Marker key={loc.id} position={loc.coordinates}>
            <Popup>
              <div className="text-sm font-semibold text-black mb-1">
                {loc.title}
              </div>

              <div className="text-xs text-gray-700 mb-2">
                {loc.description}
              </div>

              <div className="text-xs text-gray-700 mb-2">
                Submitted To: {loc.submitted_to}
              </div>

              <div className="text-xs font-semibold mb-2">
                {loc.type === "lost" ? "🔴 Lost Item" : "🟢 Found Item"}
              </div>

              {loc.image && (
                <img
                  src={loc.image}
                  alt="Item"
                  className="w-full max-w-[120px] rounded mb-2"
                />
              )}

              {auth.currentUser?.uid !== loc.submitted_by && (
                <button
                  onClick={() => handleReport(loc.submitted_by)}
                  className="mt-1 bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-1 rounded-full font-medium transition"
                >
                  🚨 Report
                </button>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* ================= Info Notes ================= */}
      <div className="absolute top-4 left-12 bg-white px-4 py-2 rounded-full shadow-md text-sm font-semibold z-[1000]">
        🗺️ Tap the camera icon to report an item
      </div>

      {/* ================= Lost / Found Tabs ================= */}
      <div className="absolute top-15 left-20 bg-white rounded-full shadow-md flex overflow-hidden z-[1000]">
        {["lost", "found"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-5 py-2 text-sm font-semibold transition-all
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

      {/* ================= Floating Camera Button ================= */}
      <div
        onClick={handleOpenCamera}
        className="bg-yellow-400 rounded-full p-3 shadow-xl absolute bottom-20 left-1/2 transform -translate-x-1/2 z-[6000] cursor-pointer"
      >
        <Camera className="text-black" size={28} />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
