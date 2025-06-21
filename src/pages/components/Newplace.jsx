import React, { useState, useEffect } from 'react';
import CameraPhoto from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useNavigate } from 'react-router-dom';
import { Repeat } from 'lucide-react';

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

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !image || !location) return;

    const newMarker = {
      id: Date.now(),
      title: form.title,
      description: form.description,
      coordinates: [location.lat, location.lng],
      image,
    };

    localStorage.setItem('newMarker', JSON.stringify(newMarker));
    navigate('/');
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div className="w-screen h-screen relative bg-white">
      {!image ? (
        <>
          {/* Flip Button */}
          <button
            onClick={toggleCamera}
            className="absolute top-4 right-4 bg-white text-black p-2 rounded-full z-20 shadow hover:bg-yellow-300"
          >
            <Repeat size={20} />
          </button>

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
