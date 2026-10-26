import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  CheckCheck,
  Inbox
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useNotifications } from '../context/NotificationContext';
import { formatDateTime } from '../utils/formatters';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markSingleRead, markAllRead, loading } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'
  const navigate = useNavigate();

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Notification Center
            </h1>
            {unreadCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-sm">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time administrative alerts, workflow transition notices, and resolution updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button onClick={markAllRead} variant="secondary" size="sm" icon={CheckCheck}>
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            filter === 'all'
              ? 'bg-blue-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            filter === 'unread'
              ? 'bg-blue-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread Only ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      <Card bodyClassName="p-0">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <Inbox className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-800">No Notifications</p>
            <p className="mt-1">You have no active alerts in this category.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((notif) => (
              <div
                key={notif._id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors ${
                  !notif.isRead ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-md mt-0.5 shrink-0 ${
                    !notif.isRead
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-700 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(notif.createdAt)}
                      </span>
                      {notif.referenceId && (
                        <span className="font-semibold text-slate-600">
                          Ref: {notif.referenceId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!notif.isRead && (
                    <Button
                      onClick={() => markSingleRead(notif._id)}
                      variant="text"
                      size="sm"
                    >
                      Mark Read
                    </Button>
                  )}
                  {notif.complaintId && (
                    <Button
                      onClick={() => {
                        markSingleRead(notif._id);
                        navigate(`/complaints/${notif.complaintId}`);
                      }}
                      variant="secondary"
                      size="sm"
                      icon={ExternalLink}
                      iconPosition="right"
                    >
                      View Complaint
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default NotificationsPage;
