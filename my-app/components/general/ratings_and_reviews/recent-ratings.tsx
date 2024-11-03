'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, User, Search } from "lucide-react";

const allRecentRatings = [
  { id: 1, user: "Alice Johnson", carName: "Toyota Camry", rating: 5, date: "2023-06-15" },
  { id: 2, user: "Bob Smith", carName: "Honda Civic", rating: 4, date: "2023-06-14" },
  { id: 3, user: "Carol White", carName: "Ford Mustang", rating: 5, date: "2023-06-13" },
  { id: 4, user: "David Brown", carName: "Tesla Model 3", rating: 3, date: "2023-06-12" },
  { id: 5, user: "Eva Green", carName: "BMW 3 Series", rating: 5, date: "2023-06-11" },
  { id: 6, user: "Frank Lee", carName: "Audi A4", rating: 4, date: "2023-06-10" },
  { id: 7, user: "Grace Chen", carName: "Mercedes-Benz C-Class", rating: 5, date: "2023-06-09" },
  { id: 8, user: "Henry Wilson", carName: "Volkswagen Golf", rating: 3, date: "2023-06-08" },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
        />
      ))}
    </div>
  );
};

export function RecentRatings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  const filteredRatings = allRecentRatings.filter(rating => {
    const matchesSearch = rating.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rating.carName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || 
      (ratingFilter === '5' && rating.rating === 5) ||
      (ratingFilter === '4' && rating.rating === 4) ||
      (ratingFilter === '3' && rating.rating === 3) ||
      (ratingFilter === '1-2' && rating.rating <= 2);
    return matchesSearch && matchesRating;
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-600">Recent Ratings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users or cars..."
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
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="1-2">1-2 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4">
            {filteredRatings.map((rating) => (
              <Card key={rating.id} className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="font-semibold text-blue-700">{rating.user}</p>
                        <p className="text-sm text-blue-600/80">{rating.carName}</p>
                        <p className="text-xs text-blue-600/60">{rating.date}</p>
                      </div>
                    </div>
                    <StarRating rating={rating.rating} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredRatings.length === 0 && (
            <p className="text-center text-blue-700">No ratings found matching your criteria.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
