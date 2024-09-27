import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Navi } from '../head/navi';
import { Footer } from '../head/footer';
export default function BookingDetails() {

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
                <Button variant="outline" size="sm">
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
                  <div className="text-base font-semibold">ABC123</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Rental Dates
                  </div>
                  <div className="text-base font-semibold">
                    June 1, 2023 - June 8, 2023
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Original Booking Cost
                  </div>
                  <div className="text-base font-semibold">$500.00</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Rewards Discount
                  </div>
                  <div className="text-base font-semibold text-green-500">
                    -$50.00
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Final Price
                  </div>
                  <div className="text-base font-semibold">$450.00</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Rewards Points Earned
                  </div>
                  <div className="text-base font-semibold">150 points</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Car Details
                  </div>
                  <div className="text-base font-semibold">Toyota Camry 2023</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Pickup & Dropoff Location
                  </div>
                  <div className="text-base font-semibold">Airport Terminal 1</div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Rewards Points Used
                  </div>
                  <div className="text-base font-semibold">50 points</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Rewards Points Credited
                  </div>
                  <div className="text-base font-semibold">June 15, 2023</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Booking Status
                  </div>
                  <div className="text-base font-semibold text-yellow-500">Confirmed</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Cancellation Policy
                  </div>
                  <div className="text-base font-semibold">Free cancellation up to 24 hours before pickup</div>
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
                    max="150"
                    defaultValue="50"
                  />
                  <Button variant="outline">Update</Button>
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
