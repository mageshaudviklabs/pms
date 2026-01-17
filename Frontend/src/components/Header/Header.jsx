import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <header className="h-16 bg-primary flex items-center justify-between px-8 text-white z-50 shrink-0">
      <h2 className="text-lg font-bold">Dashboard</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium opacity-90">{user.name}</span>
        <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-bold text-xs uppercase">
          {user.name[0]}
        </div>
      </div>
    </header>
  );
};

export default Header;