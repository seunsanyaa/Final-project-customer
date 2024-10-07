import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from 'react' // Add this import

// Define types for better type safety
type Car = {
  id: string;
  name: string;
  rating: number;
  reviews: number;
}

export function Reveve() {
  // Add state for form inputs
  const [selectedCar, setSelectedCar] = useState<string>('')
  const [rating, setRating] = useState<string>('4')
  const [review, setReview] = useState<string>('')

  // Mock data for top rated cars
  const topRatedCars: Car[] = [
    { id: 'toyota-camry', name: 'Toyota Camry', rating: 4.5, reviews: 120 },
    { id: 'honda-civic', name: 'Honda Civic', rating: 4.5, reviews: 98 },
    { id: 'ford-mustang', name: 'Ford Mustang', rating: 3.5, reviews: 75 },
    { id: 'jeep-wrangler', name: 'Jeep Wrangler', rating: 5, reviews: 50 },
  ]

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ selectedCar, rating, review })
    // TODO: Implement actual submission logic
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background p-4 sm:flex">
        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search reviews..."
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
        <nav className="flex flex-col gap-4">
          {/* Navigation links */}
          {['Recent Reviews', 'Recent Ratings', 'Most Rated'].map((item) => (
            <Link
              key={item}
              href="#"
              className="flex items-center gap-2 rounded-lg bg-accent p-2 text-accent-foreground"
              prefetch={false}
            >
              <StarIcon className="h-5 w-5" />
              {item}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col sm:pl-64">
        <main className="p-4 sm:p-6">
          {/* Top Rated Cars section */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">Top Rated Cars</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {topRatedCars.map((car) => (
                <Card key={car.id}>
                  <CardContent className="flex flex-col items-center gap-4 p-6">
                    <img
                      src="/placeholder.svg"
                      alt={`${car.name} Image`}
                      width={200}
                      height={150}
                      className="rounded-lg"
                      style={{ aspectRatio: "200/150", objectFit: "cover" }}
                    />
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={`h-5 w-5 ${
                            index < Math.floor(car.rating)
                              ? 'fill-primary'
                              : 'fill-muted stroke-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-lg font-semibold">{car.name}</div>
                    <p className="text-muted-foreground">{car.rating} out of 5 stars</p>
                    <p className="text-sm text-muted-foreground">({car.reviews} reviews)</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Write a Review section */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Write a Review</h2>
            <Card>
              <CardContent className="p-6">
                <form className="grid gap-4" onSubmit={handleSubmit}>
                  <div className="grid gap-2">
                    <Label htmlFor="car">Car</Label>
                    <Select name="car" value={selectedCar} onValueChange={setSelectedCar}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a car" />
                      </SelectTrigger>
                      <SelectContent>
                        {topRatedCars.map((car) => (
                          <SelectItem key={car.id} value={car.id}>
                            {car.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rating">Rating</Label>
                    <RadioGroup id="rating" value={rating} onValueChange={setRating}>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <div key={value} className="flex items-center">
                            <RadioGroupItem id={`rating-${value}`} value={value.toString()} />
                            <Label htmlFor={`rating-${value}`}>
                              <StarIcon className="h-5 w-5 fill-primary" />
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="review">Review</Label>
                    <Textarea
                      id="review"
                      rows={4}
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="justify-self-end">
                    Submit Review
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}

// StarIcon component (unchanged)
function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}