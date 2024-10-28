import { useState } from 'react'
import { Star, ChevronDown, ChevronUp, BookOpen, StarHalf } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type Review = {
  id: number
  user: string
  rating: number
  comment: string
  date: string
}

type Car = {
  id: number
  name: string
  image: string
  reviews: Review[]
}

const cars: Car[] = [
  {
    id: 1,
    name: "Tesla Model 3",
    image: "/placeholder.svg?height=100&width=200",
    reviews: [
      { id: 1, user: "John D.", rating: 5, comment: "Amazing electric car, smooth ride!", date: "2023-05-15" },
      { id: 2, user: "Sarah M.", rating: 4, comment: "Great for city driving, but charging can be a hassle.", date: "2023-06-02" },
    ]
  },
  {
    id: 2,
    name: "Toyota Camry",
    image: "/placeholder.svg?height=100&width=200",
    reviews: [
      { id: 3, user: "Mike R.", rating: 4, comment: "Reliable and comfortable for long trips.", date: "2023-05-20" },
      { id: 4, user: "Emily L.", rating: 5, comment: "Excellent fuel efficiency and smooth ride.", date: "2023-06-10" },
    ]
  },
  {
    id: 3,
    name: "Ford Mustang",
    image: "/placeholder.svg?height=100&width=200",
    reviews: [
      { id: 5, user: "Alex K.", rating: 5, comment: "Powerful and fun to drive! A true American classic.", date: "2023-05-25" },
      { id: 6, user: "Olivia P.", rating: 4, comment: "Great performance, but not very practical for everyday use.", date: "2023-06-15" },
    ]
  }
]

export default function CarReviews() {
  const [expandedCar, setExpandedCar] = useState<number | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleExpand = (carId: number) => {
    setExpandedCar(expandedCar === carId ? null : carId)
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-25 bg-muted p-4 border-r">
        <div className="space-y-2">
          <div>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full p-2 text-left hover:bg-muted-foreground/10 rounded-md text-sm"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Reviews & Ratings</span>
              </div>
              {isDropdownOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {isDropdownOpen && (
              <div className="ml-4 space-y-1 mt-1">
                <a
                  href="/Rating_Reviews"
                  className="flex items-center gap-2 p-2 text-xs hover:bg-muted-foreground/10 rounded-md"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>My Ratings</span>
                </a>
                <a
                  href="/Rating_Reviews/all_ratings"
                  className="flex items-center gap-2 p-2 text-xs hover:bg-muted-foreground/10 rounded-md"
                >
                  <StarHalf className="w-3 h-3" />
                  <span>All Ratings</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Popular Car Reviews</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <img src={car.image} alt={car.name} className="w-full h-48 object-cover" />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle>{car.name}</CardTitle>
                <CardDescription>
                  Average Rating: {(car.reviews.reduce((sum, review) => sum + review.rating, 0) / car.reviews.length).toFixed(1)}
                </CardDescription>
                <Separator className="my-4" />
                <div className="space-y-4">
                  {car.reviews.slice(0, expandedCar === car.id ? undefined : 1).map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{review.user}</span>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
                {car.reviews.length > 1 && (
                  <Button
                    variant="ghost"
                    className="w-full mt-4"
                    onClick={() => toggleExpand(car.id)}
                  >
                    {expandedCar === car.id ? (
                      <>
                        <ChevronUp className="mr-2 h-4 w-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-2 h-4 w-4" />
                        Show More Reviews
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}