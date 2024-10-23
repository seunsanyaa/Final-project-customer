import { useState } from 'react'
import { Star, ChevronDown, ChevronUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useUser } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { getReviewsByUserId, createReview } from '../../../convex/review'
import PreviousBookings from './PreviousBookings'
import { api } from '@/convex/_generated/api'
type Review = {
  _id: string;
  bookingId: string;
  rating: number;
  userId: string;
  comment: string;
  numberOfStars: number;
  reviewDate: string;
  carDetails: {
    maker: string;
    model: string;
    year: number;
    color: string;
    trim: string;
  } | null;
};

export function Reviews_Page() {
  const { user } = useUser();
  const userId = user?.id || '';
  
  // Fetch user reviews
  const userReviews = useQuery(api.review.getReviewsByUserId, 
    userId ? { userId } : "skip"
  );
  
  // Mutation to create a review
  const createReviewMutation = useMutation(api.review.createReview);
  
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [newReview, setNewReview] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleExpandBooking = (bookingId: string) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  const handleSubmitReview = async (bookingId: string) => {
    if (newRating === 0 || newReview.trim() === '') {
      setSubmitError('Please provide a rating and review.');
      return;
    }

    try {
      const reviewId = await createReviewMutation({
        bookingId,
        rating: newRating,
        userId,
        comment: newReview,
        numberOfStars: newRating,
      });

      console.log(`Review created with ID: ${reviewId}`);
      // Optionally refetch reviews or update UI
      setNewReview('');
      setNewRating(0);
      setExpandedBooking(null);
      setSubmitError(null);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setSubmitError(err.message || 'Failed to submit review.');
    }
  };

  if (!user) {
    return <p>Please log in to view your reviews and bookings.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Reviews & Bookings</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Your Previous Reviews</h2>
        {userReviews && userReviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {userReviews.map((review: Review) => (
              <Card key={review._id} className="flex flex-col h-48">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {review.carDetails ? `${review.carDetails.maker} ${review.carDetails.model}` : 'Car Details Unavailable'}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Reviewed on {new Date(review.reviewDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 overflow-hidden">
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.numberOfStars ? 'text-foreground fill-foreground' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm line-clamp-3">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>You have not submitted any reviews yet.</p>
        )}
      </section>

      <Separator className="my-8" />
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Previous Bookings</h2>
        <PreviousBookings customerId={userId} />
      </section>
    </div>
  )
}
