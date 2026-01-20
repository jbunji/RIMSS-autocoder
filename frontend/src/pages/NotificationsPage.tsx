import { useState, useEffect } from 'react';
import { BellIcon, CheckCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface Notification {
  msg_id: number;
  pgm_id: number;
  loc_id: number | null;
  msg_text: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  start_date: string;
  stop_date: string | null;
  from_user: string | null;
  to_user: string | null;
  acknowledged: boolean;
  ack_by: string | null;
  ack_date: string | null;
  active: boolean;
  ins_by: string;
  ins_date: string;
  program_cd?: string;
  program_name?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acknowledgingIds, setAcknowledgingIds] = useState<Set<number>>(new Set());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const response = await fetch('http://localhost:3000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (msgId: number) => {
    try {
      setAcknowledgingIds(prev => new Set(prev).add(msgId));
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const response = await fetch(`http://localhost:3000/api/notifications/${msgId}/acknowledge`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to acknowledge notification');
      }

      // Update the notification in state
      setNotifications(prev =>
        prev.map(n =>
          n.msg_id === msgId
            ? { ...n, acknowledged: true, ack_by: 'current_user', ack_date: new Date().toISOString() }
            : n
        )
      );

      // Show success message
      setSuccessMessage('Notification acknowledged successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setAcknowledgingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(msgId);
        return newSet;
      });
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return <ExclamationCircleIcon className="h-6 w-6 text-red-600" />;
      case 'HIGH':
        return <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />;
      case 'MEDIUM':
        return <InformationCircleIcon className="h-6 w-6 text-blue-600" />;
      case 'LOW':
        return <InformationCircleIcon className="h-6 w-6 text-gray-600" />;
      default:
        return <BellIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'LOW':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unacknowledgedCount = notifications.filter(n => !n.acknowledged).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BellIcon className="h-8 w-8 text-blue-600" />
              Notifications
            </h1>
            <p className="text-gray-600 mt-1">
              System notifications and announcements
            </p>
          </div>
          <div className="text-sm text-gray-600">
            {unacknowledgedCount > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                {unacknowledgedCount} unread
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircleIcon className="h-5 w-5 text-green-600" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <BellIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.msg_id}
              className={`bg-white rounded-lg shadow border-l-4 ${
                notification.acknowledged
                  ? 'border-gray-300 opacity-75'
                  : notification.priority === 'CRITICAL'
                  ? 'border-red-500'
                  : notification.priority === 'HIGH'
                  ? 'border-orange-500'
                  : notification.priority === 'MEDIUM'
                  ? 'border-blue-500'
                  : 'border-gray-400'
              } p-6 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-4">
                {/* Priority Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getPriorityIcon(notification.priority)}
                </div>

                {/* Content */}
                <div className="flex-grow">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadgeClass(
                          notification.priority
                        )}`}
                      >
                        {notification.priority}
                      </span>
                      {notification.program_cd && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                          {notification.program_cd}
                        </span>
                      )}
                      {notification.acknowledged && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                          <CheckCircleIcon className="h-3 w-3" />
                          Acknowledged
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(notification.start_date)}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-gray-900 mb-3 leading-relaxed">{notification.msg_text}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {notification.from_user && (
                        <span>From: <span className="font-medium">{notification.from_user}</span></span>
                      )}
                      {notification.acknowledged && notification.ack_by && (
                        <span className="ml-4">
                          Acknowledged by: <span className="font-medium">{notification.ack_by}</span>
                          {notification.ack_date && (
                            <span className="ml-1">on {formatDate(notification.ack_date)}</span>
                          )}
                        </span>
                      )}
                    </div>

                    {/* Acknowledge Button */}
                    {!notification.acknowledged && (
                      <button
                        onClick={() => handleAcknowledge(notification.msg_id)}
                        disabled={acknowledgingIds.has(notification.msg_id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {acknowledgingIds.has(notification.msg_id) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Acknowledging...
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="h-4 w-4" />
                            Acknowledge
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {notifications.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          {unacknowledgedCount > 0 && (
            <span className="ml-2">
              ({unacknowledgedCount} unread)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
