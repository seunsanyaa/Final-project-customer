import { useState } from 'react'
import { Star, ChevronDown, ChevronUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Mock data for previous reviews
const previousReviews = [
  { id: 1, carName: 'Tesla Model 3', rating: 5, review: 'Great electric car, smooth ride!', date: '2023-05-15' },
  { id: 2, carName: 'Toyota Camry', rating: 4, review: 'Reliable and comfortable for long trips.', date: '2023-04-22' },
  { id: 3, carName: 'Ford Mustang', rating: 5, review: 'Awesome sports car experience!', date: '2023-03-10' },
]

// Mock data for previous bookings
const previousBookings = [
  { id: 1, carName: 'BMW X5', startDate: '2023-06-01', endDate: '2023-06-05', reviewed: false },
  { id: 2, carName: 'Audi A4', startDate: '2023-05-20', endDate: '2023-05-22', reviewed: false },
]

export  function Reviews_Page() {
  const [expandedBooking, setExpandedBooking] = useState(null)
  const [newReview, setNewReview] = useState('')
  const [newRating, setNewRating] = useState(0)

  const handleExpandBooking = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId)
  }

  const handleSubmitReview = (bookingId) => {
    console.log(`Submitting review for booking ${bookingId}:`, { rating: newRating, review: newReview })
    // Here you would typically send this data to your backend
    setNewReview('')
    setNewRating(0)
    setExpandedBooking(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Reviews & Bookings</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Your Previous Reviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {previousReviews.map((review) => (
            <Card key={review.id} className="flex flex-col h-48">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{review.carName}</CardTitle>
                <CardDescription className="text-xs">Reviewed on {review.date}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 overflow-hidden">
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-sm line-clamp-3">{review.review}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-8" />
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Previous Bookings</h2>
        <div className="space-y-4">
          {previousBookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <CardTitle>{booking.carName}</CardTitle>
                <CardDescription>{booking.startDate} to {booking.endDate}</CardDescription>
              </CardHeader>
              <CardContent>
                {booking.reviewed ? (
                  <p className="text-green-600">You've already reviewed this booking.</p>
                ) : (
                  <Button onClick={() => handleExpandBooking(booking.id)}>
                    Leave a Review
                    {expandedBooking === booking.id ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                  </Button>
                )}
              </CardContent>
              {expandedBooking === booking.id && (
                <CardFooter className="flex flex-col items-start">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 cursor-pointer ${i < newRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
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
                  <Button onClick={() => handleSubmitReview(booking.id)}>Submit Review</Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
