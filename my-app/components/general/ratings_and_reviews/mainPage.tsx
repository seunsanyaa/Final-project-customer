import { useState } from 'react'
import { Star, BookOpen, StarHalf, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useQuery, useMutation } from 'convex/react'
import { getReviewsByUserId, createReview } from '../../../convex/review'
import PreviousBookings from './PreviousBookings'
import { api } from '@/convex/_generated/api'
import { Dialog, DialogContent } from "@/components/ui/dialog"

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
    pictures: string[];
    registrationNumber: string;
  } | null;
};

type MainPageProps = {
  userId: string;
};

export default function MainPage({ userId }: MainPageProps) {
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

  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const toggleExpand = (reviewId: string) => {
    setExpandedReview(expandedReview === reviewId ? null : reviewId);
  };

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

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
  };

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Reviews & Bookings</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Your Previous Reviews</h2>
        {userReviews && userReviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userReviews.map((review) => (
              <Card 
                key={review._id} 
                // className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }}
                onClick={() => handleReviewClick(review)}
              >
                <CardHeader className="p-0">
                  {review.carDetails?.pictures ? (
                    <img 
                      src={review.carDetails.pictures[0]} 
                      alt={`${review.carDetails.maker} ${review.carDetails.model}`} 
                      className="w-full h-48 object-cover" 
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      No image available
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle>{review.carDetails ? 
                    `${review.carDetails.maker} ${review.carDetails.model} ${review.carDetails.year}` : 
                    'Car Details Unavailable'}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    Rating: 
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.numberOfStars 
                              ? 'text-customyello fill-customyello' 
                              : 'text-primary-300'
                          }`}
                        />
                      ))}
                    </div>
                  </CardDescription>
                  <Separator className="my-4" />
                  <p className="text-sm line-clamp-2">{review.comment}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Reviewed on {new Date(review.reviewDate).toLocaleDateString()}
                  </p>
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

      {selectedReview && (
        <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)} >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <DialogContent className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ opacity: 1, backgroundColor: '#ffffff', zIndex: 50, border: "none" }}>
            <div className="relative">
              {/* <button
                onClick={() => setSelectedReview(null)}
                className="absolute right-0 top-0 p-2 hover:bg-muted rounded-full"
              >
                <X className="h-4 w-4" />
              </button> */}
              
              {/* Car Image */}
              <div className="w-full h-64 overflow-hidden rounded-t-lg">
                {selectedReview.carDetails?.pictures ? (
                  <img 
                    src={selectedReview.carDetails.pictures[0]} 
                    alt={`${selectedReview.carDetails.maker} ${selectedReview.carDetails.model}`} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    No image available
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Car Title and Rating */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedReview.carDetails ? 
                      `${selectedReview.carDetails.maker} ${selectedReview.carDetails.model} ${selectedReview.carDetails.year}` : 
                      'Car Details Unavailable'
                    }
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Rating:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < selectedReview.numberOfStars 
                              ? 'text-customyello fill-customyello' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Your Review</h3>
                  <p className="text-sm leading-relaxed">{selectedReview.comment}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Reviewed on {new Date(selectedReview.reviewDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Car Details */}
                {selectedReview.carDetails && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Car Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>Color: {selectedReview.carDetails.color}</p>
                      <p>Trim: {selectedReview.carDetails.trim}</p>
                    </div>
                  </div>
                )}

                {/* Book Again Button */}
                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => {
                      const regNumber = selectedReview?.carDetails?.registrationNumber;
                      if (regNumber) {
                        window.location.href = `/carinfo?id=${regNumber}`;
                      }
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Book Again  
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
