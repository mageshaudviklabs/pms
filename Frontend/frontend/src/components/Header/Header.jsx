import React, { useState, useEffect, useRef } from 'react';
import { UserRole } from '../../types';
import { notificationService } from '../../api/notificationApi';
import NotificationDropdown from './NotificationDropdown';

const Header = ({ user, onLogout, activeTab }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const isEmployee = user?.role === UserRole.EMPLOYEE;

  // ===============================
  // Fetch Notifications
  // ===============================
  const fetchNotifs = async () => {
    if (!isEmployee || !user?.id) return;

    try {
      setLoading(true);
      const response = await notificationService.getNotifications(user.id);

      if (response?.data?.success) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.stats?.unread || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load + polling
  useEffect(() => {
    if (!isEmployee) return;

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 60000);

    return () => clearInterval(interval);
  }, [user?.id, isEmployee]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle dropdown
  const handleToggleNotif = () => {
    if (!isNotifOpen) fetchNotifs();
    setIsNotifOpen(prev => !prev);
  };

  // ===============================
  // Mark Single Notification Read
  // ===============================
  const handleMarkRead = async (notif) => {
    if (!notif || notif.isRead) return;

    const notificationId = notif.notificationId;

    if (!notificationId) {
      console.error("Invalid notificationId:", notif);
      return;
    }

    setNotifications(prev =>
      prev.map(n =>
        n.notificationId === notificationId
          ? { ...n, isRead: true }
          : n
      )
    );

    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      await notificationService.markAsRead(notificationId);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
      fetchNotifs();
    }
  };

  // ===============================
  // Mark All Notifications Read
  // ===============================
  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;

    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await notificationService.markAllAsRead(user.id);
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
      fetchNotifs();
    }
  };

  return (
    <header className="h-16 bg-gradient-to-r from-[#9B8AC7] to-[#8B7AB7] flex items-center justify-between px-8 text-white z-50 shrink-0 shadow-lg relative">
      {/* Left Side - Page Title */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-black tracking-tight">{activeTab || 'Dashboard'}</h2>
      </div>

      {/* Right Side - User Info */}
      <div className="flex items-center gap-6">
        {/* Notification Bell (Employee Only) */}
        {isEmployee && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleToggleNotif}
              className="relative p-2 hover:bg-white/10 rounded-full transition-all group"
              aria-label="Toggle notifications"
            >
              <i className={`fa-solid fa-bell text-lg transition-transform group-hover:rotate-12 ${isNotifOpen ? 'text-white' : 'text-white/80'}`}></i>

              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-error text-[9px] font-black rounded-full flex items-center justify-center border-2 border-primary animate-bounceIn">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <NotificationDropdown
                notifications={notifications}
                onMarkRead={handleMarkRead}
                onMarkAllRead={handleMarkAllRead}
                onClose={() => setIsNotifOpen(false)}
                isLoading={loading}
              />
            )}
          </div>
        )}

        {/* User Profile */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">{user?.name || 'User'}</p>
            <p className="text-[10px] opacity-75 font-medium mt-1">
              {user?.email || (user?.role === UserRole.MANAGER ? 'manager@audviklabs.com' : 'employee@audviklabs.com')}
            </p>
          </div>

          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center font-black text-base uppercase shadow-lg hover:bg-white/30 transition-all cursor-pointer">
            {user?.name ? user.name[0] : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;