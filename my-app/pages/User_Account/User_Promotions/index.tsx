import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Navi } from "@/components/general/head/navi";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import CalendarDaysIcon from "@/svgs/CalendarDaysIcon";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RedeemedPromotionCardProps {
  _id: string;
  title: string;
  description: string;
  endDate: string;
  type: 'discount' | 'offer' | 'upgrade';
  image: string;
  goldenMembersOnly: boolean;
  isUsed: boolean;
}

const RedeemedPromotionCard: React.FC<RedeemedPromotionCardProps> = ({
  title,
  description,
  endDate,
  type,
  image,
  goldenMembersOnly,
  isUsed
}) => {
  return (
    <Card className={isUsed ? "opacity-50" : ""}>
      <img
        src={image || "/placeholder.svg"}
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
          <div className="flex items-center">
            <CalendarDaysIcon className="mr-2 h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              Expires: {new Date(endDate).toLocaleDateString()}
            </span>
          </div>
          <Badge variant="secondary">{type}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {goldenMembersOnly ? "Golden Member Offer" : "Regular Member Offer"}
          </div>
          <Badge variant={isUsed ? "destructive" : "default"}>
            {isUsed ? "Used" : "Available"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default function UserPromotions() {
  const { user } = useUser();
  const [filter, setFilter] = useState("all");
  
  // Use the new query instead of filtering manually
  const redeemedPromotions = useQuery(api.promotions.getUserRedeemedPromotions, { 
    userId: user?.id ?? "" 
  }) ?? [];

  const filteredPromotions = redeemedPromotions.filter(promotion => {
    if (filter === "used") {
      return promotion.isUsed;
    }
    if (filter === "available") {
      return !promotion.isUsed;
    }
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navi />
      <Separator />
      <div className="flex flex-row h-[92vh]">
        <aside className="flex flex-col items-left justify-between w-fit px-4 md:px-6 border-b bg-primary text-primary-foreground py-2 md:py-12">
          <nav className="flex flex-col items-left justify-between h-fit w-fit gap-4 sm:gap-6">
            <div className="flex flex-col md:flex items-left gap-4 w-fit">
              <Link
                href="/User_Account"
                className="text-muted-foreground hover:text-customyello transition-colors"
                prefetch={false}
              >
                Account Details
              </Link>
              <Link
                href="#"
                className="text-background drop-shadow-glow hover:text-customyello transition-colors"
                prefetch={false}
              >
                My Promotions
              </Link>
              <Link
                href="/User_Account/User_Bookings"
                className="text-muted-foreground hover:text-customyello transition-colors"
                prefetch={false}
              >
                Previous Bookings
              </Link>
            </div>
          </nav>
        </aside>

        <main className="flex-1 bg-background py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen mx-auto">
            <Card className="bg-muted mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-black">My Redeemed Promotions</CardTitle>
                  <div className="flex items-center gap-4">
                    <Label htmlFor="filter">Filter by:</Label>
                    <Select name="filter" defaultValue="all" onValueChange={setFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Promotions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Promotions</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="used">Used</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPromotions.length > 0 ? (
                    filteredPromotions.map((promotion) => (
                      <RedeemedPromotionCard
                        key={promotion._id}
                        {...promotion}
                        title={promotion.promotionTitle}
                        description={promotion.promotionDescription}
                        endDate={promotion.promotionEndDate}
                        type={promotion.promotionType}
                        image={promotion.promotionImage}
                        goldenMembersOnly={promotion.goldenMembersOnly}
                        isUsed={promotion.isUsed}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">No promotions redeemed yet.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => window.location.href = '/Promotions'}
                      >
                        Browse Available Promotions
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
} 