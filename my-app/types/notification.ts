export type Notification = {
  id: string;
  userId: string;
  bookingId: string;
  message: string;
  isRead: boolean;
  type: 'booking' | 'offer' | 'payment' | 'rewards' | 'reminder';
};
