import React from 'react';

const Card = ({ title, children, actions }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-borderDiv shadow-sm">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold text-textPrimary">
            {typeof title === 'string' ? <h3>{title}</h3> : title}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;