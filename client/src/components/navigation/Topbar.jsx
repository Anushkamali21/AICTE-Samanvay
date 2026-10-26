import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  User,
  Shield,
  CheckCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { ROLES, ROLE_LABELS } from '../../utils/constants';

export const Topbar = ({ onToggleSidebar }) => {
  const { user, quickDemoLogin, logout } = useAuth();
  const { notifications, unreadCount, markSingleRead, markAllRead } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef(null);
  const roleRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifMenu(false);
      if (roleRef.current && !roleRef.current.contains(e.target)) setShowRoleMenu(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/complaints?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleRoleSwitch = async (role) => {
    setShowRoleMenu(false);
    await quickDemoLogin(role);
    navigate('/dashboard');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left section: toggle and search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-700"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs sm:max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Complaint ID or Title..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-hidden focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-colors"
          />
        </form>
      </div>

      {/* Right section: Demo Role Switcher, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Role Switcher for Hackathon Judges */}
        <div className="relative" ref={roleRef}>
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-blue-700" />
            <span>Role: {ROLE_LABELS[user?.role] || user?.role}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
              <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Demo Role Switcher (SIH Evaluation)
              </div>
              {Object.keys(ROLE_LABELS).map((roleKey) => (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => handleRoleSwitch(roleKey)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    user?.role === roleKey ? 'font-semibold text-blue-700 bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{ROLE_LABELS[roleKey]}</span>
                  {user?.role === roleKey && <CheckCircle className="w-3.5 h-3.5 text-blue-700" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md relative transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-slate-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-[11px] text-blue-700 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No notifications at this time.
                  </div>
                ) : (
                  notifications.slice(0, 6).map((n) => (
                    <div
                      key={n._id}
                      onClick={() => {
                        markSingleRead(n._id);
                        if (n.complaintId) {
                          setShowNotifMenu(false);
                          navigate(`/complaints/${n.complaintId}`);
                        }
                      }}
                      className={`px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                        !n.isRead ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifMenu(false);
                    navigate('/notifications');
                  }}
                  className="text-xs text-blue-700 hover:underline font-medium"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown */}
        <div className="relative" ref={userRef}>
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-md bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{user?.email}</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded-sm font-medium">
                  {ROLE_LABELS[user?.role] || user?.role}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/profile');
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>My Profile</span>
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
