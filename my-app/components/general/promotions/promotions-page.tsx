
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import CalendarDaysIcon from "@/svgs/CalendarDaysIcon";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"; // Assuming this is imported correctly from your components
import { Navi } from "../head/navi";
import { Footer } from "../head/footer";
export function PromotionsPage() {

  return (
    <>
      <Navi/>
      <Separator />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-primary rounded-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                Get 20% Off Your Next Rental
              </h2>
              <p className="text-primary-foreground mb-6">
                New members can save big on their next car rental. Offer ends
                soon, so don't miss out!
              </p>
              <Button size="lg" variant="secondary">
                Redeem Offer
              </Button>
            </div>
            <div className="hidden md:block">
              <img
                src="/placeholder.svg"
                width={500}
                height={300}
                alt="Featured Promotion"
                className="object-cover"
                style={{ aspectRatio: "500/300", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Current Promotions</h2>
            <div className="flex items-center gap-4">
              <Label htmlFor="filter">Filter by:</Label>
              <Select name="filter" defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Promotions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Promotions</SelectItem>
                  <SelectItem value="discount">Discount Offers</SelectItem>
                  <SelectItem value="upgrade">Upgrade Offers</SelectItem>
                  <SelectItem value="free-rental">Free Rental Offers</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="sort">Sort by:</Label>
              <Select name="sort" defaultValue="newest">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                  <SelectItem value="discount-amount">
                    Discount Amount
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Repeat for each card */}
            <Card>
              <img
                src="/placeholder.svg"
                width={400}
                height={200}
                alt="Promotion Image"
                className="rounded-t-lg object-cover"
                style={{ aspectRatio: "400/200", objectFit: "cover" }}
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  20% Off Compact Car Rentals
                </h3>
                <p className="text-muted-foreground mb-4">
                  Rent a compact car and save 20% on your next booking.
                </p>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <CalendarDaysIcon className="mr-2 h-4 w-4" />
                    <span className="text-sm text-muted-foreground">
                      Expires: 2024-09-30
                    </span>
                  </div>
                  <Badge variant="secondary">Discount</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Offer valid for new members only. Minimum rental period of 3
                    days. See terms and conditions for details.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
            <img
              src="/placeholder.svg"
              width={400}
              height={200}
              alt="Promotion Image"
              className="rounded-t-lg object-cover"
              style={{ aspectRatio: "400/200", objectFit: "cover" }} />
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Complimentary Upgrade to Midsize</h3>
              <p className="text-muted-foreground mb-4">Rent a midsize car at the price of a compact.</p>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <CalendarDaysIcon className="mr-2 h-4 w-4" />
                  <span className="text-sm text-muted-foreground">Expires: 2024-11-15</span>
                </div>
                <Badge variant="secondary">Upgrade</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Offer valid for members with 6 or more rentals in the past year. Blackout dates may apply.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <img
              src="/placeholder.svg"
              width={400}
              height={200}
              alt="Promotion Image"
              className="rounded-t-lg object-cover"
              style={{ aspectRatio: "400/200", objectFit: "cover" }} />
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Free Weekend Rental for New Members</h3>
              <p className="text-muted-foreground mb-4">
                Enjoy a free weekend rental when you sign up for our rewards program.
              </p>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <CalendarDaysIcon className="mr-2 h-4 w-4" />
                  <span className="text-sm text-muted-foreground">Expires: 2024-12-31</span>
                </div>
                <Badge variant="secondary">Free Rental</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  Offer valid for new members only. Minimum rental period of 2 days. See terms and conditions for
                  details.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <img
              src="/placeholder.svg"
              width={400}
              height={200}
              alt="Promotion Image"
              className="rounded-t-lg object-cover"
              style={{ aspectRatio: "400/200", objectFit: "cover" }} />
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">10% Off SUV Rentals for Members</h3>
              <p className="text-muted-foreground mb-4">Rent an SUV and save 10% on your next booking.</p>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <CalendarDaysIcon className="mr-2 h-4 w-4" />
                  <span className="text-sm text-muted-foreground">Expires: 2025-03-31</span>
                </div>
                <Badge variant="secondary">Discount</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Offer valid for members with 3 or more rentals in the past year. Blackout dates may apply.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <img
              src="/placeholder.svg"
              width={400}
              height={200}
              alt="Promotion Image"
              className="rounded-t-lg object-cover"
              style={{ aspectRatio: "400/200", objectFit: "cover" }} />
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Free Rental Day for Loyalty Members</h3>
              <p className="text-muted-foreground mb-4">Earn a free rental day for every 5 rentals.</p>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <CalendarDaysIcon className="mr-2 h-4 w-4" />
                  <span className="text-sm text-muted-foreground">Expires: 2025-06-30</span>
                </div>
                <Badge variant="secondary">Free Rental</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  Offer valid for members with 10 or more rentals in the past year. See terms and conditions for
                  details.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <img
              src="/placeholder.svg"
              width={400}
              height={200}
              alt="Promotion Image"
              className="rounded-t-lg object-cover"
              style={{ aspectRatio: "400/200", objectFit: "cover" }} />
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">15% Off Luxury Car Rentals</h3>
              <p className="text-muted-foreground mb-4">Treat yourself to a luxury car rental and save 15%.</p>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <CalendarDaysIcon className="mr-2 h-4 w-4" />
                  <span className="text-sm text-muted-foreground">Expires: 2025-09-30</span>
                </div>
                <Badge variant="secondary">Discount</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Offer valid for members with 15 or more rentals in the past year. Blackout dates may apply.</p>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
  
<Separator />
<Footer/>
</>
);
}




