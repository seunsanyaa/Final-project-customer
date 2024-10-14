import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Navi } from '../head/navi';
import { Footer } from '../head/footer';
export default function BookingDetails() {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState({
    bookingId: '',
    rentalDates: '',
    originalCost: 0,
    rewardsDiscount: 0,
    finalPrice: 0,
    rewardsPointsEarned: 0,
    carDetails: '',
    pickupLocation: '',
    rewardsPointsUsed: 0,
    rewardsPointsCredited: '',
    bookingStatus: '',
    cancellationPolicy: ''
  });

  useEffect(() => {
    if (router.isReady) {
      setBookingDetails({
        bookingId: router.query.bookingId as string,
        rentalDates: router.query.rentalDates as string,
        originalCost: Number(router.query.originalCost),
        rewardsDiscount: Number(router.query.rewardsDiscount),
        finalPrice: Number(router.query.finalPrice),
        rewardsPointsEarned: Number(router.query.rewardsPointsEarned),
        carDetails: router.query.carDetails as string,
        pickupLocation: router.query.pickupLocation as string,
        rewardsPointsUsed: Number(router.query.rewardsPointsUsed),
        rewardsPointsCredited: router.query.rewardsPointsCredited as string,
        bookingStatus: router.query.bookingStatus as string,
        cancellationPolicy: router.query.cancellationPolicy as string
      });
    }
  }, [router.isReady, router.query]);

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
                  <div className="text-base font-semibold">{bookingDetails.bookingId}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Rental Dates
                  </div>
                  <div className="text-base font-semibold">
                    {bookingDetails.rentalDates}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Original Booking Cost
                  </div>
                  <div className="text-base font-semibold">${bookingDetails.originalCost}.00</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Rewards Discount
                  </div>
                  <div className="text-base font-semibold text-green-500">
                    -${bookingDetails.rewardsDiscount}.00
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Final Price
                  </div>
                  <div className="text-base font-semibold">${bookingDetails.finalPrice}.00</div>
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
                  <div className="text-base font-semibold">{bookingDetails.pickupLocation}</div>
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
                  <div className="text-base font-semibold text-yellow-500">{bookingDetails.bookingStatus}</div>
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
