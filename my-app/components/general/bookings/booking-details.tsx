import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Navi } from '../head/navi';
import { Footer } from '../head/footer';

// Define interface for booking details
interface BookingDetail {
  label: string;
  value: string | number;
  className?: string;
}

export default function BookingDetails() {
  // Define booking details as an array of objects for easier rendering
  const bookingDetails: BookingDetail[] = [
    { label: "Booking ID", value: "ABC123" },
    { label: "Rental Dates", value: "June 1, 2023 - June 8, 2023" },
    { label: "Original Booking Cost", value: "$500.00" },
    { label: "Rewards Discount", value: "-$50.00", className: "text-green-500" },
    { label: "Final Price", value: "$450.00" },
    { label: "Rewards Points Earned", value: "150 points" },
    { label: "Car Details", value: "Toyota Camry 2023" },
    { label: "Pickup & Dropoff Location", value: "Airport Terminal 1" },
    { label: "Rewards Points Used", value: "50 points" },
    { label: "Rewards Points Credited", value: "June 15, 2023" },
    { label: "Booking Status", value: "Confirmed", className: "text-yellow-500" },
    { label: "Cancellation Policy", value: "Free cancellation up to 24 hours before pickup" },
  ];

  // Function to render a booking detail
  const renderBookingDetail = ({ label, value, className }: BookingDetail) => (
    <div key={label}>
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className={`text-base font-semibold ${className || ''}`}>{value}</div>
    </div>
  );

  return (
    <div>
      <Navi />
      <Separator />

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8">
          <div className="bg-background rounded-lg shadow-sm overflow-hidden">
            {/* Header section */}
            <div className="px-6 py-5 bg-muted">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Booking Details</h1>
                <Button variant="outline" size="sm">
                  Modify Booking
                </Button>
              </div>
            </div>

            {/* Booking details section */}
            <div className="px-6 py-5 grid gap-6">
              {/* Render booking details in a 2-column grid */}
              <div className="grid grid-cols-2 gap-4">
                {bookingDetails.slice(0, 8).map(renderBookingDetail)}
              </div>

              <Separator />

              {/* Render remaining booking details */}
              <div className="grid grid-cols-2 gap-4">
                {bookingDetails.slice(8).map(renderBookingDetail)}
              </div>

              {/* Modify Rewards Points section */}
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
                    aria-label="Rewards points to use"
                  />
                  <Button variant="outline">Update</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />
      <Footer />
    </div>
  );
}
