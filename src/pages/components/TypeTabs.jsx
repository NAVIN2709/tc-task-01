import React from 'react';

const TypeTabs = ({ selectedType, setSelectedType, className = "" }) => {
  return (
    <div className={`bg-white p-1.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center border border-gray-100 w-fit ${className}`}>
      {["lost", "found"].map((type) => {
        const isSelected = selectedType === type;
        return (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`
              relative z-10 flex items-center justify-center gap-2.5 px-6 py-2.5 text-[15px] font-bold rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
              ${isSelected ? "bg-black text-white shadow-[0_2px_10px_rgba(0,0,0,0.2)]" : "text-gray-500 hover:text-gray-900 bg-transparent hover:bg-gray-50"}
            `}
            style={{ minWidth: '110px' }}
          >
            {/* 3D Dot */}
            <span
              className={`w-3.5 h-3.5 rounded-full transition-transform duration-300 ${isSelected ? 'scale-110' : 'scale-100'}
              ${type === "lost" 
                ? "bg-gradient-to-br from-[#ff6b6b] to-[#dc2626] shadow-[inset_0px_-2px_4px_rgba(0,0,0,0.3),inset_0px_2px_4px_rgba(255,255,255,0.4),0_2px_6px_rgba(220,38,38,0.4)]" 
                : "bg-gradient-to-br from-[#6ee7b7] to-[#059669] shadow-[inset_0px_-2px_4px_rgba(0,0,0,0.3),inset_0px_2px_4px_rgba(255,255,255,0.4),0_2px_6px_rgba(5,150,105,0.4)]"}
              `}
            />
            <span className="tracking-wide">
              {type === "lost" ? "Lost" : "Found"}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TypeTabs;
