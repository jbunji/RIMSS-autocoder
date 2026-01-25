import { useState, useEffect, Fragment } from 'react';
import { BellIcon, CheckCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon, InformationCircleIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { useAuthStore } from '../stores/authStore';

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

interface Program {
  pgm_id: number;
  pgm_cd: string;
  pgm_name: string;
}

export default function NotificationsPage() {
  const { token, user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acknowledgingIds, setAcknowledgingIds] = useState<Set<number>>(new Set());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    msg_text: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    pgm_id: user?.programs?.[0]?.pgm_id || 1,
    start_date: new Date().toISOString().split('T')[0],
    stop_date: '',
  });

  const isAdmin = user?.role === 'ADMIN';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchNotifications();
    if (isAdmin) {
      fetchPrograms();
    }
  }, [token, isAdmin]);

  const fetchPrograms = () => {
    // For admins, fetch all programs from a static list
    // For now, use the programs available in the system
    const allPrograms = [
      { pgm_id: 1, pgm_cd: 'CRIIS', pgm_name: 'Common Remotely Operated Integrated Reconnaissance System' },
      { pgm_id: 2, pgm_cd: 'ACTS', pgm_name: 'Advanced Targeting Capability System' },
      { pgm_id: 3, pgm_cd: 'ARDS', pgm_name: 'Airborne Reconnaissance Data System' },
      { pgm_id: 4, pgm_cd: '236', pgm_name: 'Program 236' },
    ];
    setPrograms(allPrograms);
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        setError('Not authenticated');
        return;
      }

      const response = await fetch('/api/notifications', {
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

  const handleCreateNotification = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      const payload = {
        msg_text: formData.msg_text,
        priority: formData.priority,
        pgm_id: formData.pgm_id,
        start_date: new Date(formData.start_date).toISOString(),
        stop_date: formData.stop_date ? new Date(formData.stop_date).toISOString() : null,
      };

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create notification');
      }

      // Success
      setSuccessMessage('Notification created successfully');
      setTimeout(() => {
        setShowAddModal(false);
        setSuccessMessage(null);
        setFormData({
          msg_text: '',
          priority: 'MEDIUM',
          pgm_id: user?.programs?.[0]?.pgm_id || 1,
          start_date: new Date().toISOString().split('T')[0],
          stop_date: '',
        });
      }, 1500);

      // Refresh notifications list
      fetchNotifications();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating notification:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAcknowledge = async (msgId: number) => {
    try {
      setAcknowledgingIds(prev => new Set(prev).add(msgId));
      setError(null);

      if (!token) {
        setError('Not authenticated');
        return;
      }

      const response = await fetch(`/api/notifications/${msgId}/acknowledge`, {
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

      // Get the updated notification from the response
      const data = await response.json();
      const updatedNotification = data.notification;

      // Update the notification in state
      setNotifications(prev =>
        prev.map(n =>
          n.msg_id === msgId
            ? updatedNotification
            : n
        )
      );

      // Show success message
      setSuccessMessage('Notification acknowledged successfully');
      setTimeout(() => setSuccessMessage(null), 3000);

      // Dispatch event to notify other components (like Navbar) to refresh unread count
      window.dispatchEvent(new Event('notificationAcknowledged'));
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
          <div className="flex items-center gap-3">
            {unacknowledgedCount > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                {unacknowledgedCount} unread
              </span>
            )}
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Notification
              </button>
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

      {/* Add Notification Modal */}
      <Transition.Root show={showAddModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setShowAddModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                  <div className="absolute right-0 top-0 pr-4 pt-4">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                      onClick={() => setShowAddModal(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                      <BellIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                        Create Notification
                      </Dialog.Title>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {/* Notification Text */}
                    <div>
                      <label htmlFor="msg_text" className="block text-sm font-medium text-gray-700">
                        Notification Text *
                      </label>
                      <textarea
                        id="msg_text"
                        rows={4}
                        value={formData.msg_text}
                        onChange={(e) => setFormData({ ...formData, msg_text: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="Enter notification message..."
                      />
                    </div>

                    {/* Priority Level */}
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                        Priority Level *
                      </label>
                      <select
                        id="priority"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                      </select>
                    </div>

                    {/* Target Program */}
                    <div>
                      <label htmlFor="pgm_id" className="block text-sm font-medium text-gray-700">
                        Target Program *
                      </label>
                      <select
                        id="pgm_id"
                        value={formData.pgm_id}
                        onChange={(e) => setFormData({ ...formData, pgm_id: parseInt(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        {programs.map((program) => (
                          <option key={program.pgm_id} value={program.pgm_id}>
                            {program.pgm_cd} - {program.pgm_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          id="start_date"
                          value={formData.start_date}
                          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="stop_date" className="block text-sm font-medium text-gray-700">
                          Stop Date
                        </label>
                        <input
                          type="date"
                          id="stop_date"
                          value={formData.stop_date}
                          onChange={(e) => setFormData({ ...formData, stop_date: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Error message */}
                    {saveError && (
                      <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                          <div className="ml-3">
                            <p className="text-sm text-red-800">{saveError}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Success message */}
                    {saving === false && successMessage && showAddModal && (
                      <div className="rounded-md bg-green-50 p-4">
                        <div className="flex">
                          <CheckCircleIcon className="h-5 w-5 text-green-400" />
                          <div className="ml-3">
                            <p className="text-sm text-green-800">Notification created successfully!</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateNotification}
                      disabled={saving || !formData.msg_text || !formData.start_date}
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Creating...' : 'Create Notification'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
