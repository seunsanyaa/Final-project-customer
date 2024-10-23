import React from 'react';
import { useQuery } from 'convex/react';
import { getPendingReviewsByCustomer } from '../../../convex/bookings';
import { Button } from "@/components/ui/button";
import { api } from '@/convex/_generated/api'
type BookingWithCarDetails = {
  _id: string;
  customerId: string;
  carId: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  paidAmount: number;
  status: string;
  pickupLocation: string;
  dropoffLocation: string;
  customerInsurancetype: string;
  customerInsuranceNumber: string;
  reviewId?: string;
  carDetails: CarDetails | null;
};

type CarDetails = {
  maker: string;
  model: string;
  year: number;
  color: string;
  trim: string;
};

const PreviousBookings: React.FC<{ customerId: string }> = ({ customerId }) => {
  const pendingBookings = useQuery(api.bookings.getPendingReviewsByCustomer, { customerId });

  if (!pendingBookings || pendingBookings.length === 0) return <p>You have no previous bookings pending reviews.</p>;

  return (
    <div>
      <ul>
        {pendingBookings.map((booking: BookingWithCarDetails) => {
          const car = booking.carDetails;
          return (
            <li key={booking._id} className="mb-6">
              <div className="border rounded-md p-4 shadow-sm">
                <h3 className="text-xl font-semibold">Booking ID: {booking._id}</h3>
                {car ? (
                  <p className="mt-2">
                    <strong>Car:</strong> {car.maker} {car.model} ({car.year}) - {car.color} - {car.trim}
                  </p>
                ) : (
                  <p className="mt-2">Car details not available.</p>
                )}
                <p>
                  <strong>Rental Period:</strong> {new Date(booking.startDate).toLocaleDateString()} -{' '}
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total Cost:</strong> ${booking.totalCost.toFixed(2)}
                </p>
                <p>
                  <strong>Status:</strong> {booking.status}
                </p>
                <Button
                  className="mt-4"
                  onClick={() => {
                    // Implement navigation to the review submission page or open a modal
                    console.log(`Redirecting to review for booking ID: ${booking._id}`);
                    // Example using Next.js router:
                    // router.push(`/reviews/create?bookingId=${booking._id}`);
                  }}
                >
                  Leave a Review
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PreviousBookings;
