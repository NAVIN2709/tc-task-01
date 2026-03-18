import React from "react";
import { MapPin, Tag, MessageSquare, User, Camera } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Map", Icon: MapPin },
    { path: "/items", label: "Items", Icon: Tag },
    { path: "/newplace", label: "New Place", Icon: Camera },
    { path: "/chats", label: "Chats", Icon: MessageSquare },
    { path: "/profile", label: "Profile", Icon: User },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] bg-black rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex items-center justify-evenly px-1 py-1.5 z-[6000] border border-zinc-800">
      {navItems.map(({ path, label, Icon }) => {
        const isActive = location.pathname === path;

        return (
          <Link
            key={path}
            to={path}
            className={`flex items-center justify-center gap-1.5 rounded-full transition-all duration-300 ${
              isActive
                ? "bg-yellow-400 text-black px-4 py-2"
                : "text-zinc-400 hover:text-white p-2"
            }`}
          >
            <Icon
              size={24}
              strokeWidth={isActive ? 2.5 : 2}
              className={isActive ? "fill-white" : "fill-none"}
            />
            {isActive && <span className="font-semibold text-sm">{label}</span>}
          </Link>
        );
      })}
    </div>
  );
};

export default Footer;
