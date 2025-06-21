import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer";

// Fix default marker icon
const defaultIcon = L.icon({
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const Home = () => {
  const mapRef = useRef();
  const navigate = useNavigate();

  const [locations, setLocations] = useState([
    {
      id: 1,
      title: "Lost Bag",
      description: "Black backpack near hostel.",
      coordinates: [10.7602, 78.8142],
      image: null,
    },
  ]);

  // Load marker from localStorage if present
  useEffect(() => {
    const stored = localStorage.getItem("newMarker");
    if (stored) {
      const marker = JSON.parse(stored);
      setLocations((prev) => [...prev, marker]);
      localStorage.removeItem("newMarker");
    }
  }, []);

  // Handle map click to go to Newplace with location
  const AddMarkerOnClick = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        navigate("/newplace", { state: { lat, lng } });
      },
    });
    return null;
  };

  // When camera is clicked
  const handleOpenCamera = () => {
  navigate('/newplace');
};


  return (
    <div className="h-screen w-full relative">
      <MapContainer
        center={[10.7602, 78.8142]}
        zoom={15}
        scrollWheelZoom={true}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        style={{ height: "calc(100vh - 64px)", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <AddMarkerOnClick />

        {locations.map((loc) => (
          <Marker key={loc.id} position={loc.coordinates}>
            <Popup>
              <strong>{loc.title}</strong>
              <br />
              {loc.description}
              {loc.image && (
                <img
                  src={loc.image}
                  alt="Lost Item"
                  className="mt-2 rounded w-32"
                />
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Info Note */}
      <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-full shadow-md text-sm font-semibold z-[1000]">
        🗺️ Tap the camera or map to report an item
      </div>

      {/* Camera FAB */}
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
