// lib/pusher.ts
import Pusher from 'pusher-js';

// Pusher configuration
export const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || 'your_pusher_key', {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1'
});

// Notification types
export interface NotificationData {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  timestamp?: string;
}

// Helper function to show notifications
export const showNotification = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
  // This can be used to trigger global notifications
  console.log(`${type.toUpperCase()}: ${message}`);
};

// Subscribe to general notifications
export const subscribeToGeneralNotifications = (callback: (data: NotificationData) => void) => {
  const channel = pusher.subscribe('general');
  channel.bind('system-notification', callback);
  return channel;
};

// Subscribe to user-specific notifications
export const subscribeToUserNotifications = (userId: number, callback: (data: NotificationData) => void) => {
  const channel = pusher.subscribe(`user-${userId}`);
  channel.bind('notification', callback);
  return channel;
};

// Subscribe to booking notifications
export const subscribeToBookingNotifications = (callback: (data: NotificationData) => void) => {
  const channel = pusher.subscribe('bookings');
  channel.bind('booking-created', callback);
  channel.bind('booking-updated', callback);
  channel.bind('booking-cancelled', callback);
  return channel;
};

// Admin-specific notification functions
export const subscribeToAdminNotifications = (callback: (data: NotificationData) => void) => {
  const channel = pusher.subscribe('admin-notifications');
  channel.bind('admin-notification', callback);
  channel.bind('system-alert', callback);
  return channel;
};

export const subscribeToAdminDashboard = (adminId: number, callback: (data: NotificationData) => void) => {
  const channel = pusher.subscribe(`admin-dashboard-${adminId}`);
  channel.bind('dashboard-update', callback);
  channel.bind('personal-notification', callback);
  return channel;
};

export const subscribeToSystemNotifications = (callback: (data: NotificationData) => void) => {
  const channel = pusher.subscribe('system');
  channel.bind('system-notification', callback);
  channel.bind('maintenance-alert', callback);
  channel.bind('error-report', callback);
  return channel;
};

export const subscribeToAllAdminDashboards = (callback: (data: NotificationData) => void) => {
  const channel = pusher.subscribe('admin-dashboards');
  channel.bind('broadcast-update', callback);
  channel.bind('global-alert', callback);
  return channel;
};

export const subscribeToUserActivity = (callback: (data: NotificationData) => void) => {
  const channel = pusher.subscribe('users');
  channel.bind('user-registered', callback);
  channel.bind('user-login', callback);
  channel.bind('user-activity', callback);
  return channel;
};

export const subscribeToBookingActivity = (callback: (data: NotificationData) => void) => {
  const channel = pusher.subscribe('bookings');
  channel.bind('new-booking', callback);
  channel.bind('booking-cancelled', callback);
  channel.bind('payment-received', callback);
  return channel;
};

export default pusher;