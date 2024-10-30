import React, { useState } from "react";
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

interface PromotionCardProps {
  title: string;
  description: string;
  expiration: string;
  badgeType: string;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ title, description, expiration, badgeType }) => (
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
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <div className="flex justify-between items-center mb-4">
        <div>
          <CalendarDaysIcon className="mr-2 h-4 w-4" />
          <span className="text-sm text-muted-foreground">Expires: {expiration}</span>
        </div>
        <Badge variant="secondary">{badgeType}</Badge>
      </div>
      <div className="text-sm text-muted-foreground">
        <p>Offer valid for members. See terms and conditions for details.</p>
      </div>
    </CardContent>
  </Card>
);

const promotions = [ // Define the promotions array
  {
    title: "20% Off Compact Car Rentals",
    description: "Rent a compact car and save 20% on your next booking.",
    expiration: "2024-09-30",
    badgeType: "Discount",
  },
  {
    title: "Complimentary Upgrade to Midsize",
    description: "Rent a midsize car at the price of a compact.",
    expiration: "2024-11-15",
    badgeType: "Upgrade",
  },
  // ... add other promotions as needed ...
];

export function PromotionsPage() {
  const [filter, setFilter] = useState("all");

  const filteredPromotions = promotions.filter(promotion => {
    if (filter === "expiring-soon") {
      return new Date(promotion.expiration) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Next 7 days
    }
    return true; // Show all promotions
  });

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
              <Button size="lg" variant="secondary" className="hover:bg-secondary-foreground hover:text-white transition duration-300">
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
              <Select name="filter" defaultValue="all" onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Promotions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Promotions</SelectItem>
                  <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
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
            <PromotionCard 
              title="20% Off Compact Car Rentals" 
              description="Rent a compact car and save 20% on your next booking." 
              expiration="2024-09-30" 
              badgeType="Discount" 
            />
            <PromotionCard 
              title="Complimentary Upgrade to Midsize" 
              description="Rent a midsize car at the price of a compact." 
              expiration="2024-11-15" 
              badgeType="Upgrade" 
            />
            <PromotionCard 
              title="Free Weekend Rental for New Members" 
              description="Enjoy a free weekend rental when you sign up for our rewards program." 
              expiration="2024-12-31" 
              badgeType="Free Rental" 
            />
            <PromotionCard 
              title="10% Off SUV Rentals for Members" 
              description="Rent an SUV and save 10% on your next booking." 
              expiration="2025-03-31" 
              badgeType="Discount" 
            />
            <PromotionCard 
              title="Free Rental Day for Loyalty Members" 
              description="Earn a free rental day for every 5 rentals." 
              expiration="2025-06-30" 
              badgeType="Free Rental" 
            />
            <PromotionCard 
              title="15% Off Luxury Car Rentals" 
              description="Treat yourself to a luxury car rental and save 15%." 
              expiration="2025-09-30" 
              badgeType="Discount" 
            />
          </div>
        </div>
      </div>
  
<Separator />
<Footer/>
</>
);
}




