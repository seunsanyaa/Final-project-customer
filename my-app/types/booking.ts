export type Booking = {
  /** The name of the booking or event */
  name: string;

  /** The category or type of the booking (e.g., "Workshop", "Tour", "Class") */
  category: string;

  /** The duration of the booking (e.g., "2 hours", "3 days") */
  duration: string;

  /** The start date and time of the booking (ISO 8601 format recommended) */
  startDate: string;

  /** The price of the booking in the default currency */
  price: number;

  /** URL or path to an image representing the booking */
  image: string;

  /** Email address of the customer who made the booking */
  customerEmail: string;

  /** Unique identifier for the booking */
  id: string;

  /** Status of the booking (e.g., "confirmed", "pending", "cancelled") */
  status: 'confirmed' | 'pending' | 'cancelled';
};
