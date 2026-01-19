import React from 'react';

const NotificationDropdown = ({ 
  notifications, 
  onMarkRead, 
  onMarkAllRead, 
  onClose,
  isLoading 
}) => {
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-borderAudvik overflow-hidden z-[70] animate-fadeIn origin-top-right">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-borderAudvik flex items-center justify-between bg-bgAudvik/50">
        <h3 className="text-sm font-black text-slateBrand uppercase tracking-widest">
          Notifications
        </h3>

        {notifications.length > 0 && (
          <button 
            onClick={onMarkAllRead}
            className="text-[10px] font-black text-primary hover:text-primaryDark uppercase tracking-wider transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Body */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {isLoading && notifications.length === 0 ? (
          <div className="p-10 text-center">
            <i className="fa-solid fa-circle-notch fa-spin text-primary opacity-40 text-xl"></i>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-10 text-center opacity-40">
            <i className="fa-solid fa-bell-slash text-3xl mb-3"></i>
            <p className="text-xs font-bold uppercase tracking-widest">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-borderAudvik">
            {notifications.map((notif) => (
              <div 
                key={notif.notificationId} // ✅ FIXED
                onClick={() => {
                  if (!notif.isRead) {
                    onMarkRead(notif); // ✅ pass FULL object
                  }
                }}
                className={`p-4 hover:bg-bgAudvik cursor-pointer transition-colors relative flex gap-3 ${
                  !notif.isRead ? 'bg-primary/5' : ''
                }`}
              >
                {!notif.isRead && (
                  <div className="absolute left-2 top-5 w-1.5 h-1.5 bg-primary rounded-full"></div>
                )}

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs leading-relaxed ${
                      !notif.isRead
                        ? 'font-black text-slateBrand'
                        : 'font-medium text-textSecondary'
                    }`}
                  >
                    {notif.message}
                  </p>

                  <p className="text-[10px] text-textSecondary mt-1 font-bold opacity-60">
                    {formatRelativeTime(notif.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-borderAudvik text-center bg-bgAudvik/30">
        <button 
          onClick={onClose}
          className="text-[10px] font-black text-textSecondary uppercase tracking-widest hover:text-slateBrand transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
