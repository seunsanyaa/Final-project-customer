'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, User } from "lucide-react";

const recentReviews = [
  { id: 1, user: "Alice Johnson", rating: 5, comment: "Great service! The car was in perfect condition.", date: "2023-06-15" },
  { id: 2, user: "Bob Smith", rating: 4, comment: "Good experience overall. Pickup was a bit slow.", date: "2023-06-14" },
  { id: 3, user: "Carol White", rating: 5, comment: "Excellent customer service and very clean car.", date: "2023-06-13" },
  { id: 4, user: "David Brown", rating: 3, comment: "Car was okay, but the return process was confusing.", date: "2023-06-12" },
  { id: 5, user: "Eva Green", rating: 5, comment: "Fantastic! Will definitely use this service again.", date: "2023-06-11" },
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

export function RecentReviews() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-600">Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {recentReviews.map((review) => (
            <Card key={review.id} className="bg-white/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-10 h-10 text-blue-500" />
                    <div>
                      <p className="font-semibold text-blue-700">{review.user}</p>
                      <p className="text-sm text-blue-600/80">{review.date}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="mt-2 text-blue-800">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
