import React, { useState, useEffect } from 'react';
import CameraPhoto from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useNavigate } from 'react-router-dom';
import { Repeat, Image as ImageIcon } from 'lucide-react';
import { auth, db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Newplace = () => {
  const [image, setImage] = useState('');
  const [location, setLocation] = useState(null);
  const [form, setForm] = useState({ title: '', description: '' });
  const [facingMode, setFacingMode] = useState('environment');
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
      },
      (err) => console.error('Location error:', err),
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
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !image || !location) return;

    try {
      const currentUser = auth.currentUser;

      const newItem = {
        title: form.title,
        description: form.description,
        image, // base64 string
        coordinates: [location.lat, location.lng],
        submitted_by: currentUser.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "items"), newItem);

      console.log("Item added:", newItem);
      navigate('/');
    } catch (error) {
      console.error("Failed to submit item:", error);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div className="w-screen h-screen relative bg-white">
      {!image ? (
        <>
          {/* Top Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            {/* Gallery Picker */}
            <label className="bg-white text-black p-2 rounded-full shadow hover:bg-yellow-300 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImagePick}
                className="hidden"
              />
              <ImageIcon size={20} />
            </label>

            {/* Flip Button */}
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
        // Form After Photo
        <div className="p-4 max-w-lg mx-auto mt-6">
          <h1 className="text-xl font-bold mb-4 text-yellow-600">📍 Add Lost/Found Item</h1>

          <img src={image} alt="Captured" className="rounded w-full mb-4" />

          <form onSubmit={handleSubmit}>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full p-2 border border-black rounded mb-2"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              rows={4}
              className="w-full p-2 border border-black rounded mb-2"
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white w-full py-2 rounded font-semibold"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Newplace;
