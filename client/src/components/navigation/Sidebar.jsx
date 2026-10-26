import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus2,
  FileSearch,
  ShieldCheck,
  BarChart3,
  Star,
  Bell,
  HelpCircle,
  User,
  LogOut,
  X,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { ROLES, ROLE_LABELS } from '../../utils/constants';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const isStaffOrStudent = [ROLES.STUDENT, ROLES.FACULTY, ROLES.STAFF].includes(user?.role);
  const isOfficer = [ROLES.INSTITUTION_NODAL, ROLES.AICTE_ADMIN].includes(user?.role);

  const navItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    ...(isStaffOrStudent ? [
      {
        name: 'Register a Complaint',
        path: '/complaints/new',
        icon: FilePlus2
      },
      {
        name: 'Track My Complaints',
        path: '/complaints',
        icon: FileSearch
      }
    ] : []),
    ...(isOfficer ? [
      {
        name: 'Grievance Workbench',
        path: '/admin/complaints',
        icon: ShieldCheck
      }
    ] : []),
    {
      name: 'Institute Statistics',
      path: '/statistics',
      icon: BarChart3
    },
    {
      name: 'Feedback & Satisfaction',
      path: '/feedback',
      icon: Star
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null
    },
    {
      name: 'Help and Support',
      path: '/help',
      icon: HelpCircle
    },
    {
      name: 'My Profile',
      path: '/profile',
      icon: User
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-blue-700 flex items-center justify-center text-white font-bold text-sm tracking-wider">
              AS
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white leading-none">
                AICTE SAMANVAY
              </h1>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-medium">
                Grievance Portal
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div className="p-4 mx-3 my-3 bg-slate-800/80 rounded-lg border border-slate-700/60">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[11px] text-blue-400 font-medium mt-0.5">{ROLE_LABELS[user.role] || user.role}</p>
            <p className="text-[10px] text-slate-400 truncate mt-1">{user.institution}</p>
          </div>
        )}

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose && onClose()}
              className={({ isActive }) => `flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Footer with Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
