import { useState } from 'react';
import { Star, ChevronDown, ChevronUp, BookOpen, StarHalf, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function AllRatings() {
  
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedCar, setExpandedCar] = useState<string | null>(null);
  
  // Get all cars with reviews
  const carsWithReviews = useQuery(api.car.getCarsWithReviews) || [];
  
  // Get detailed car info with reviews when a car is selected
  const selectedCarWithReviews = useQuery(
    api.car.getCarWithReviews,
    selectedCarId ? { registrationNumber: selectedCarId } : "skip"
  );

  const handleCarClick = (car: any) => {
    setSelectedCarId(car.registrationNumber);
  };

  const handleBack = () => {
    setSelectedCarId(null);
  };

  const renderReview = (review: any) => (
    <Card key={review._id} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">{review.userName}</CardTitle>
            <CardDescription>{new Date(review.reviewDate).toLocaleDateString()}</CardDescription>
          </div>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < review.numberOfStars ? 'text-customyello fill-customyello' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{review.comment}</p>
      </CardContent>
    </Card>
  );

  const toggleExpand = (carId: string) => {
    setExpandedCar(expandedCar === carId ? null : carId);
  };

  if (selectedCarId && selectedCarWithReviews) {
    return (
      <div className="flex-1 container mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-sm hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to all reviews
        </button>

        <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }}>
          <CardHeader className="p-0">
            {selectedCarWithReviews.pictures && selectedCarWithReviews.pictures.length > 0 ? (
              <img 
                src={selectedCarWithReviews.pictures[0]} 
                alt={`${selectedCarWithReviews.maker} ${selectedCarWithReviews.model}`} 
                width={500}
                height={400}
                className='mr-0 right-0'
              />
            ) : (
              <div className="w-full h-64 bg-muted flex items-center justify-center">
                No image available
              </div>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <CardTitle className="text-2xl mb-2">{`${selectedCarWithReviews.maker} ${selectedCarWithReviews.model} ${selectedCarWithReviews.year}`}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-lg mb-4">
              Average Rating: 
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(selectedCarWithReviews.averageRating || 0) 
                        ? 'text-customyello fill-customyello' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span>({selectedCarWithReviews.averageRating?.toFixed(1)})</span>
            </CardDescription>
            <Button 
            className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl"              
            onClick={() => window.location.href = `/carinfo?id=${selectedCarWithReviews.registrationNumber}`}
            >
              Book Now
            </Button>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-6">All Reviews</h2>
        <div className="space-y-6">
          {selectedCarWithReviews.reviews.map(renderReview)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Popular Car Reviews</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {carsWithReviews.map((car) => (
          <Card 
            key={car._id} 
            // className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" 
            style={{ border: "none" }}
            onClick={() => handleCarClick(car)}
          >
            <CardHeader className="p-0">
              {car.pictures && car.pictures.length > 0 ? (
                <img 
                  src={car.pictures[0]} 
                  alt={`${car.maker} ${car.model}`} 
                  className="w-full h-48 object-cover" 
                />
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  No image available
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle>{`${car.maker} ${car.model} ${car.year}`}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                Average Rating: 
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(car.averageRating || 0) 
                          ? 'text-customyello fill-customyello' 
                          : 'text-primary-300'
                      }`}
                    />
                  ))}
                </div>
                <span>({car.averageRating?.toFixed(1)})</span>
              </CardDescription>
              <Separator className="my-4" />
              <div className="space-y-4">
                {expandedCar === car._id ? (
                  car.topReviews?.map(renderReview)
                ) : (
                  car.reviews?.[0] && renderReview(car.reviews[0])
                )}
              </div>
              {car.reviews?.length > 1 && (
                <Button
                  variant="ghost"
                  className="w-full mt-4"
                  onClick={() => toggleExpand(car._id)}
                >
                  {expandedCar === car._id ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      Show Top Reviews ({car.topReviews?.length - 1} more)
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}