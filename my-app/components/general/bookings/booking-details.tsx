'use client'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Navi } from '../head/navi';
import { Footer } from '../head/footer';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

export default function BookingDetails() {
  const router = useRouter();
  const { bookingId } = router.query;

  const bookingDetails = useQuery(
    api.bookings.getBookingDetails,
    typeof bookingId === 'string'? { bookingId: bookingId as Id<"bookings"> }: "skip"
  );

  if (!bookingId || typeof bookingId !== 'string') {
    return <div>Invalid booking ID</div>;
  }

  if (!bookingDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navi/>
      <Separator />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8">
          <div className="bg-background rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 bg-muted">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Booking Details</h1>
                <Button variant="outline" size="sm" className='hover:bg-muted'>
                  Modify Booking
                </Button>
              </div>
            </div>
            <div className="px-6 py-5 grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Booking ID
                  </div>
                  <div className="text-base font-semibold">{bookingDetails._id}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Rental Dates
                  </div>
                  <div className="text-base font-semibold">
                    {bookingDetails.startDate} - {bookingDetails.endDate}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Original Booking Cost
                  </div>
                  <div className="text-base font-semibold">${bookingDetails.totalCost}.00</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Paid Amount
                  </div>
                  <div className="text-base font-semibold text-green-500">
                    ${bookingDetails.paidAmount}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Remaining Cost
                  </div>
                  <div className="text-base font-semibold">${bookingDetails.totalCost - bookingDetails.paidAmount}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Rewards Points Earned
                  </div>
                  <div className="text-base font-semibold">{bookingDetails.rewardsPointsEarned} points</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Car Details
                  </div>
                  <div className="text-base font-semibold">{bookingDetails.carDetails}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Pickup & Dropoff Location
                  </div>
                  <div className="text-base font-semibold">{bookingDetails.pickupLocation} - {bookingDetails.dropoffLocation}</div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Rewards Points Used
                  </div>
                  <div className="text-base font-semibold">{bookingDetails.rewardsPointsUsed} points</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Rewards Points Credited
                  </div>
                  <div className="text-base font-semibold">{bookingDetails.rewardsPointsCredited}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Booking Status
                  </div>
                  <div className="text-base font-semibold text-yellow-500">{bookingDetails.status}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Cancellation Policy
                  </div>
                  <div className="text-base font-semibold">{bookingDetails.cancellationPolicy}</div>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Modify Rewards Points
                </div>
                <div className="text-base">
                  You can modify the number of rewards points used for this
                  booking. Changing the points used may affect the final price
                  and the number of points earned.
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max={bookingDetails.rewardsPointsEarned}
                    defaultValue={bookingDetails.rewardsPointsUsed}
                  />
                  <Button variant="outline" className='hover:bg-muted'>Update</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <Footer/>
    </div>
  );
}
