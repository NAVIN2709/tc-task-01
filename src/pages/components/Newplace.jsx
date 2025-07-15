import React, { useState, useEffect } from "react";
import CameraPhoto from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { useNavigate } from "react-router-dom";
import { Repeat, Image as ImageIcon } from "lucide-react";
import { auth, db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Select from "react-select";

const Newplace = () => {
  const [image, setImage] = useState("");
  const [location, setLocation] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "found", // 'lost' or 'found'
    submitted: "",
  });
  const [facingMode, setFacingMode] = useState("environment");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const securityOptions = [
    { value: "Main Gate Security", label: "Main Gate Security" },
    { value: "Admin Security", label: "Admin Security" },
    { value: "Orion Security", label: "Orion Security" },
    { value: "Archie Security", label: "Archie Security" },
    { value: "Ojas Security", label: "Ojas Security" },
    { value: "GJCH Security", label: "GJCH Security" },
    { value: "Hostel Office", label: "Hostel Office" },
    { value: "Logos Security", label: "Logos Security" },
    { value: "Third-Eye/Octa Security", label: "Third-Eye/Octa Security" },
    { value: "Capstone Security", label: "Capstone Security" },
    { value: "MM1 Mess", label: "MM1 Mess" },
    { value: "MM2 Mess", label: "MM2 Mess" },
    { value: "Sabari Mess", label: "Sabari Mess" },
    { value: "Kailash Mess", label: "Kailash Mess" },
    { value: "Annapoorna Mess", label: "Annapoorna Mess" },
    { value: "Opal Mess", label: "Opal Mess" },
    { value: "Hospital Security", label: "Hospital Security" },
    {
      value: "Departments (Specify in description)",
      label: "Departments (Specify in description)",
    },
    {
      value: "Others (Specify in description)",
      label: "Others (Specify in description)",
    },
    { value: "Coral Security", label: "Coral Security" },
    { value: "Garnet Security", label: "Garnet Security" },
    { value: "Opal Security", label: "Opal Security" },
    { value: "Amber Security", label: "Amber Security" },
    { value: "Zircon Security", label: "Zircon Security" },
    { value: "Diamond Security", label: "Diamond Security" },
    { value: "Jasper Security", label: "Jasper Security" },
    { value: "Aquamarine Security", label: "Aquamarine Security" },
    { value: "Topaz Security", label: "Topaz Security" },
    { value: "Ruby Security", label: "Ruby Security" },
    { value: "Sapphire Security", label: "Sapphire Security" },
    { value: "Amethyst Security", label: "Amethyst Security" },
    { value: "Pearl Security", label: "Pearl Security" },
    { value: "Beryl Security", label: "Beryl Security" },
  ];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
      },
      (err) => console.error("Location error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  const handleTakePhoto = (dataUri) => {
    setImage(dataUri);
  };

  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !image ||
      !location ||
      (form.type === "found" && !form.submitted)
    )
      return;

    setLoading(true);

    try {
      const currentUser = auth.currentUser;

      const newItem = {
        title: form.title,
        description: form.description,
        image,
        coordinates: [location.lat, location.lng],
        submitted_by: currentUser.uid,
        submitted_to: form.type === "found" ? form.submitted : null,
        type: form.type,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "items"), newItem);
      console.log(newItem)
      navigate("/");
    } catch (error) {
      console.error("Failed to submit item:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div className="w-screen h-screen relative bg-white">
      {!image ? (
        <>
          {/* Top Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            <label className="bg-white text-black p-2 rounded-full shadow hover:bg-yellow-300 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImagePick}
                className="hidden"
              />
              <ImageIcon size={20} />
            </label>
            <button
              onClick={toggleCamera}
              className="bg-white text-black p-2 rounded-full shadow hover:bg-yellow-300"
            >
              <Repeat size={20} />
            </button>
          </div>

          {/* Fullscreen Camera */}
          <div className="absolute inset-0 z-10">
            <CameraPhoto
              isFullscreen={true}
              idealFacingMode={facingMode}
              onTakePhoto={handleTakePhoto}
            />
          </div>
        </>
      ) : (
        <div className="p-4 max-w-lg mx-auto mt-6">
          <h1 className="text-xl font-bold mb-4 text-yellow-600">
            📍 Add Lost/Found Item
          </h1>

          <img src={image} alt="Captured" className="rounded w-full mb-4" />

          <form onSubmit={handleSubmit}>
            <div className="flex gap-4 mb-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="found"
                  checked={form.type === "found"}
                  onChange={handleChange}
                />
                Found
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="lost"
                  checked={form.type === "lost"}
                  onChange={handleChange}
                />
                Lost
              </label>
            </div>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Name of the item"
              className="w-full p-2 border border-black rounded mb-2"
              required
            />

            {form.type === "found" && (
              <Select
                options={securityOptions}
                value={securityOptions.find(
                  (option) => option.value === form.submitted
                )}
                onChange={(selected) =>
                  setForm((prev) => ({ ...prev, submitted: selected.value }))
                }
                placeholder="Select or search handovered to..."
                className="mb-2"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "black",
                    padding: "2px",
                  }),
                }}
                isSearchable
              />
            )}

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              rows={4}
              className="w-full p-2 border border-black rounded mb-2"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded font-semibold text-white transition ${
                loading
                  ? "bg-yellow-400 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                    />
                  </svg>
                  Submitting...
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Newplace;
