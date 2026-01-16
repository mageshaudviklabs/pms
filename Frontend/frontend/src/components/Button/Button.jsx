import React from 'react';

const Button = ({ label, onClick, variant = 'primary', disabled = false, icon }) => {
  const baseClasses = 'px-6 py-3 rounded-lg font-bold text-sm transition-all';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primaryDark',
    secondary: 'bg-white border border-primary text-primary hover:bg-primary/5',
    danger: 'bg-error text-white hover:bg-error/90'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={label}
    >
      {icon && <i className={`fa-solid ${icon} mr-2`}></i>}
      {label}
    </button>
  );
};

export default Button;