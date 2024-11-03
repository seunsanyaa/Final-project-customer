'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Car, Search } from "lucide-react"
import Image from "next/image"

const allRatedCars = [
  { id: 1, name: "Toyota Camry", image: "/placeholder.svg", averageRating: 4.7, totalRatings: 253 },
  { id: 2, name: "Honda Civic", image: "/placeholder.svg", averageRating: 4.5, totalRatings: 201 },
  { id: 3, name: "Ford Mustang", image: "/placeholder.svg", averageRating: 4.8, totalRatings: 189 },
  { id: 4, name: "Tesla Model 3", image: "/placeholder.svg", averageRating: 4.9, totalRatings: 176 },
  { id: 5, name: "BMW 3 Series", image: "/placeholder.svg", averageRating: 4.6, totalRatings: 152 },
  { id: 6, name: "Audi A4", image: "/placeholder.svg", averageRating: 4.4, totalRatings: 145 },
  { id: 7, name: "Mercedes-Benz C-Class", image: "/placeholder.svg", averageRating: 4.7, totalRatings: 168 },
  { id: 8, name: "Volkswagen Golf", image: "/placeholder.svg", averageRating: 4.3, totalRatings: 132 },
]

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
      <span className="text-blue-700 font-semibold">{rating.toFixed(1)}</span>
    </div>
  )
}

export function MostRatedCars() {
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')

  const filteredCars = allRatedCars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = ratingFilter === 'all' || 
      (ratingFilter === '4.5+' && car.averageRating >= 4.5) ||
      (ratingFilter === '4.0-4.4' && car.averageRating >= 4.0 && car.averageRating < 4.5) ||
      (ratingFilter === 'below4' && car.averageRating < 4.0)
    return matchesSearch && matchesRating
  })

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-600">Most Rated Cars</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search cars..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4.5+">4.5 and above</SelectItem>
                  <SelectItem value="4.0-4.4">4.0 - 4.4</SelectItem>
                  <SelectItem value="below4">Below 4.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4">
            {filteredCars.map((car) => (
              <Card key={car.id} className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={car.image}
                      alt={car.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-blue-700">{car.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <StarRating rating={car.averageRating} />
                        <span className="text-sm text-blue-600/80">
                          {car.totalRatings} ratings
                        </span>
                      </div>
                    </div>
                    <Car className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredCars.length === 0 && (
            <p className="text-center text-blue-700">No cars found matching your criteria.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
