import React from 'react';

const SidebarItem = ({ name, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-semibold transition-all relative ${
        isActive 
          ? 'sidebar-active text-primary' 
          : 'text-textSecondary hover:bg-bgAudvik hover:text-slateBrand'
      }`}
    >
      <i className={`fa-solid ${icon} w-5 text-center text-lg ${isActive ? 'text-primary' : 'opacity-60'}`}></i>
      {name}
    </button>
  );
};

export default SidebarItem;