import React, { useState, useEffect } from 'react';
import { Bell, User, Check, X, Menu } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const { notifications, unreadCount, toast, markAsRead, clearToast } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  // Manage auto-hiding toast notifications
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <nav className="h-16 border-b border-white/5 bg-[#090e18] px-4 sm:px-6 md:px-8 flex items-center justify-between relative select-none shrink-0">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-4 right-4 z-[999] flex items-center gap-3 max-w-xs sm:max-w-sm p-4 rounded-xl shadow-2xl bg-slate-900 border border-white/10 glass-panel animate-in slide-in-from-top-4 duration-300">
          <div className="w-2.5 h-2.5 rounded-full bg-accentPurple shrink-0 animate-ping"></div>
          <p className="text-xs font-medium text-slate-200 line-clamp-2">{toast.message}</p>
          <button 
            onClick={clearToast} 
            className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all ml-auto shrink-0"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Left: Hamburger (mobile/tablet) + Title */}
      <div className="flex items-center gap-3">
        {/* Hamburger menu button — only visible on mobile/tablet */}
        <button
          id="sidebar-toggle-btn"
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <h2 className="text-sm sm:text-base font-semibold text-slate-200 truncate">Workspace Dashboard</h2>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-accentPurple text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Glassmorphic Dropdown Panel */}
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-72 sm:w-80 max-h-96 overflow-y-auto rounded-2xl glass-panel shadow-2xl z-20 border border-white/10 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notifications</span>
                  <span className="text-[10px] text-slate-500 font-medium">{unreadCount} Unread</span>
                </div>
                
                <div className="flex flex-col max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`px-4 py-3 border-b border-white/5 flex gap-2.5 transition-all ${
                        !notif.isRead ? 'bg-accentPurple/5' : 'opacity-60'
                      }`}
                    >
                      <div className="flex flex-col gap-1 grow">
                        <p className="text-xs text-slate-200 leading-normal">{notif.message}</p>
                        <span className="text-[9px] text-slate-500">{new Date(notif.createdAt).toLocaleTimeString()}</span>
                      </div>
                      {!notif.isRead && (
                        <button 
                          onClick={() => markAsRead(notif.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-accentPurple hover:bg-accentPurple/15 transition-all shrink-0 self-center"
                          title="Mark as read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  ))}

                  {notifications.length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-500 italic">No notifications found.</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 rounded-full bg-accentIndigo/30 flex items-center justify-center font-bold text-accentIndigo text-sm border border-accentIndigo/45 shrink-0">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <span className="text-xs font-medium text-slate-300 hidden lg:block">{user?.name}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
