import React from 'react';

const SidebarItem = ({ name, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${
        isActive
          ? 'bg-gradient-to-r from-[#9B8AC7] to-[#8B7AB7] text-white shadow-lg shadow-[#9B8AC7]/30'
          : 'text-gray-600 hover:bg-[#9B8AC7]/10 hover:text-[#9B8AC7]'
      }`}
    >
      <i className={`fa-solid ${icon} text-base w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#9B8AC7]'}`}></i>
      <span>{name}</span>
      {isActive && (
        <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-sm"></div>
      )}
    </button>
  );
};

export default SidebarItem;