import React from 'react';
import { MapPin, MessageSquare, TagIcon, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Tag } from 'lucide-react';

const Footer = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black text-white flex items-center justify-around h-16 shadow-lg z-150 border-t">
      
      {/* Map */}
      <Link to="/" className="flex flex-col items-center text-xs">
        <div className={`p-2 rounded-full ${isActive('/') ? 'bg-yellow-400' : ''}`}>
          <MapPin size={24} />
        </div>
        <span className={`${isActive('/') ? 'text-yellow-500 font-semibold' : ''}`}>Map</span>
      </Link>

      {/* Tags */}
      <Link to="/items" className="flex flex-col items-center text-xs">
        <div className={`p-2 rounded-full ${isActive('/items') ? 'bg-yellow-400' : ''}`}>
          <TagIcon size={24} />
        </div>
        <span className={`${isActive('/items') ? 'text-yellow-500 font-semibold' : ''}`}>Items</span>
      </Link>

      {/* Chat */}
      <Link to="/chats" className="flex flex-col items-center text-xs">
        <div className={`p-2 rounded-full ${isActive('/chats') ? 'bg-yellow-400' : ''}`}>
          <MessageSquare size={24} />
        </div>
        <span className={`${isActive('/chats') ? 'text-yellow-500 font-semibold' : ''}`}>Chats</span>
      </Link>

      {/* Profile */}
      <Link to="/profile" className="flex flex-col items-center text-xs">
        <div className={`p-2 rounded-full ${isActive('/profile') ? 'bg-yellow-400' : ''}`}>
          <User size={24} />
        </div>
        <span className={`${isActive('/profile') ? 'text-yellow-500 font-semibold' : ''}`}>Profile</span>
      </Link>
    </div>
  );
};

export default Footer;
