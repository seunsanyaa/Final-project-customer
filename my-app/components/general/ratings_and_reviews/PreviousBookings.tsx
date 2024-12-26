import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { Button } from "@/components/ui/button";
import { api } from '@/convex/_generated/api';
import { ChevronUp, ChevronDown, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Id } from '../../../convex/_generated/dataModel'
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
  reviewed: boolean;
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

  const createReview = useMutation(api.review.createReview);

  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [newReview, setNewReview] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleExpandBooking = (bookingId: string) => {
    setExpandedBooking(prev => (prev === bookingId ? null : bookingId));
  };

  const handleSubmitReview = async (bookingId: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createReview({
        bookingId: bookingId as   Id<'bookings'>,
        rating: newRating,
        userId: customerId,
        comment: newReview,
        numberOfStars: newRating,
      });
      console.log(`Review submitted for booking ${bookingId}`);
      
      setNewReview('');
      setNewRating(0);
      setExpandedBooking(null);
      // Optionally, refetch bookings or update state to reflect the new review
    } catch (err: any) {
      console.error(`Error submitting review for booking ${bookingId}:`, err);
      setError(err.message || 'An error occurred while submitting your review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!pendingBookings) return <p>Loading...</p>; // Added a loading state

  if (pendingBookings.length === 0) return <p>You have no previous bookings pending reviews.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h1 className="text-3xl font-bold mb-6">Your Previous Bookings</h1> */}
      
      <section className="mb-12">
        <div className="space-y-4">
          {pendingBookings.map((booking) => {
            const car = booking.carDetails;
            const isExpanded = expandedBooking === booking._id;
            const bookingEndDate = new Date(booking.endDate);
            const currentDate = new Date();
            const isBookingEnded = currentDate > bookingEndDate;

            return (
              <Card key={booking._id} className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-2xl" style={{ border: "none" }}>
                <CardHeader>
                  <CardTitle>{car ? `${car.maker} ${car.model} (${car.year})` : 'Car Details Not Available'}</CardTitle>
                  <CardDescription>{new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p><strong>Total Cost:</strong> ${booking.totalCost.toFixed(2)}</p>
                  <p><strong>Status:</strong> {booking.status}</p>
                  {booking.reviewId ? (
                    <p className="text-green-600">You&apos;ve already reviewed this booking.</p>
                  ) : !isBookingEnded ? (
                    <p className="text-yellow-600">You can review this booking after {bookingEndDate.toLocaleDateString()}</p>
                  ) : (
                    <Button onClick={() => handleExpandBooking(booking._id)}>
                      Leave a Review
                      {isExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                    </Button>
                  )}
                </CardContent>
                {isExpanded && isBookingEnded && (
                  <CardFooter className="flex flex-col items-start">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 cursor-pointer ${i < newRating ? 'text-foreground fill-foreground' : 'text-gray-300'}`}
                          onClick={() => setNewRating(i + 1)}
                        />
                      ))}
                    </div>
                    <Textarea
                      placeholder="Write your review here..."
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      className="w-full mb-4"
                    />
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    <Button onClick={() => handleSubmitReview(booking._id)} disabled={isSubmitting} className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl">
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default PreviousBookings;
