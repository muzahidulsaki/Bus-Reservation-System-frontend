# Bus Reservation System - Real-time Notifications with Pusher

## Overview
This bus reservation system now includes real-time notifications using Pusher. Users receive instant notifications for booking confirmations, profile updates, and system messages.

## Setup Instructions

### 1. Environment Variables
Create or update your `.env.local` file with your Pusher credentials:

```env
# Pusher Configuration
NEXT_PUBLIC_PUSHER_KEY=your_actual_pusher_key_here
NEXT_PUBLIC_PUSHER_CLUSTER=mt1

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 2. Pusher Configuration
Replace `your_actual_pusher_key_here` with your actual Pusher key from your Pusher dashboard.

## Features Implemented

### 1. **Global Notification System**
- **Location**: `lib/pusher.ts`
- **Purpose**: Centralized Pusher configuration and notification helpers
- **Functions**:
  - `subscribeToGeneralNotifications()` - System-wide notifications
  - `subscribeToUserNotifications()` - User-specific notifications
  - `subscribeToBookingNotifications()` - Booking-related notifications

### 2. **Booking Page Notifications**
- **File**: `app/booking/page.tsx`
- **Features**:
  - Real-time booking confirmations
  - User-specific notifications
  - Visual notification popup with auto-dismiss
  - Success notifications when booking is created

### 3. **User Dashboard Notifications**
- **File**: `app/user/page.tsx`
- **Features**:
  - Profile update notifications
  - Booking status updates
  - User-specific messages
  - Visual notification popup

### 4. **Header Notification Bell**
- **File**: `app/components/Header.tsx`
- **Features**:
  - Notification bell icon with count badge
  - Dropdown notification list
  - Clear all notifications option
  - Real-time notification updates

## Notification Types

### Backend Channels
Your backend should emit events to these channels:

#### 1. **General Notifications**
```javascript
// Channel: 'general'
// Event: 'system-notification'
pusher.trigger('general', 'system-notification', {
  message: 'System maintenance scheduled at 2 AM'
});
```

#### 2. **User-Specific Notifications**
```javascript
// Channel: 'user-{userId}'
// Event: 'notification'
pusher.trigger(`user-${userId}`, 'notification', {
  message: 'Your booking has been confirmed!'
});
```

#### 3. **Booking Notifications**
```javascript
// Channel: 'bookings'
// Event: 'booking-created'
pusher.trigger('bookings', 'booking-created', {
  message: 'New booking created!',
  bookingId: 123
});
```

#### 4. **Profile Update Notifications**
```javascript
// Channel: 'user-{userId}'
// Event: 'profile-updated'
pusher.trigger(`user-${userId}`, 'profile-updated', {
  message: 'Your profile has been updated successfully!'
});
```

## How It Works

### 1. **Connection Initialization**
- Pusher connection is established when user logs in
- Subscribes to relevant channels based on user ID
- Disconnects when user logs out

### 2. **Event Listening**
- Each page listens to specific channels
- Events trigger notification display functions
- Notifications auto-dismiss after 5 seconds

### 3. **Visual Feedback**
- Toast notifications appear in top-right corner
- Header bell shows notification count
- Dropdown shows notification history
- Color-coded notifications (blue for info, green for success)

## Usage Examples

### Frontend - Showing Custom Notifications
```javascript
import { showNotificationMessage } from './lib/pusher';

// Show success notification
showNotificationMessage('Booking confirmed successfully!');

// Show error notification
showNotificationMessage('❌ Booking failed. Please try again.');
```

### Backend - Triggering Notifications
```javascript
// When user books a ticket
pusher.trigger(`user-${userId}`, 'notification', {
  message: `✅ Booking successful! Your ticket number is: ${ticketNumber}`
});

// When admin updates system
pusher.trigger('general', 'system-notification', {
  message: '📢 New bus route added: Dhaka to Cox\'s Bazar'
});
```

## Testing

### 1. **Local Testing**
- Start your backend server with Pusher configured
- Start frontend: `npm run dev`
- Log in as a user
- Create a booking to see notifications
- Check Header notification bell

### 2. **Pusher Debug Console**
- Go to your Pusher dashboard
- Use Debug Console to send test events
- Channel: `user-1` (replace 1 with actual user ID)
- Event: `notification`
- Data: `{"message": "Test notification!"}`

## Files Modified

1. **`app/booking/page.tsx`** - Added booking notifications
2. **`app/user/page.tsx`** - Added user dashboard notifications  
3. **`app/components/Header.tsx`** - Added notification bell and dropdown
4. **`lib/pusher.ts`** - Created global Pusher configuration
5. **`.env.local`** - Added environment variables

## Next Steps

1. **Customize Notification Styling**: Modify CSS in notification components
2. **Add Sound Notifications**: Include audio alerts for important notifications
3. **Notification Persistence**: Store notifications in database for history
4. **Push Notifications**: Add browser push notifications for offline users
5. **Admin Notifications**: Add admin-specific notification features

## Troubleshooting

### Common Issues:

1. **Notifications Not Appearing**
   - Check Pusher key in `.env.local`
   - Verify backend is triggering correct channels
   - Check browser console for errors

2. **Connection Issues**
   - Verify Pusher cluster setting
   - Check network connectivity
   - Ensure CORS is configured in Pusher dashboard

3. **Channel Subscription Errors**
   - Verify user ID is correct
   - Check channel naming convention
   - Ensure user is logged in before subscribing

## Support
For any issues or questions, check the Pusher documentation or contact the development team.