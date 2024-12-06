import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import CalendarDaysIcon from "@/svgs/CalendarDaysIcon";
import { useRouter } from "next/router";
import Image from "next/image";

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
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";

interface PromotionCardProps {
  _id: string;
  title: string;
  description: string;
  endDate: string;
  type: 'discount' | 'offer' | 'upgrade'|'permenant';
  image: string;
  goldenMembersOnly: boolean;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ _id, title, description, endDate, type, image, goldenMembersOnly }) => {
  const { user } = useUser();
  const router = useRouter();
  const redeemPromo = useMutation(api.promotions.redeemPromo);
  
  const customerData = useQuery(api.customers.getCustomerByUserId, { 
    userId: user?.id ?? "" 
  });

  const isRedeemed = customerData?.promotions?.includes(_id as Id<"promotions">);
  const isGoldenMember = customerData?.goldenMember ?? false;

  const handleRedeem = async () => {
    if (!user?.id) return;
    
    if (goldenMembersOnly && !isGoldenMember) {
      router.push("/Golden");
      return;
    }
    
    try {
      await redeemPromo({
        userId: user.id,
        promotionId: _id as Id<"promotions">, 
      });
    } catch (error) {
      console.error('Error redeeming promotion:', error);
    }
  };

  return (
    <Card className={isRedeemed ? "opacity-50" : ""}>
      <Image
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
          <div>
            <CalendarDaysIcon className="mr-2 h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              Expires: {new Date(endDate).toLocaleDateString()}
            </span>
          </div>
          <Badge variant="secondary">{type}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            <p>
              {goldenMembersOnly 
                ? "Offer valid for Golden members Only"
                : "Offer valid for members"}
            </p>
          </div>
          <Button 
            onClick={handleRedeem}
            disabled={isRedeemed}
            variant={isRedeemed ? "ghost" : "default"}
          >
            {isRedeemed 
              ? "Redeemed" 
              : (goldenMembersOnly && !isGoldenMember)
                ? "Upgrade" 
                : "Redeem"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export function PromotionsPage() {
  const [filter, setFilter] = useState("all");
  const promotions = useQuery(api.promotions.getAllPromotions) ?? [];

  const filteredPromotions = promotions.filter(promotion => {
    if (filter === "expiring-soon") {
      return new Date(promotion.promotionEndDate ?? "") < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    return true;
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
                soon, so don&apos;t miss out!
              </p>
              <Button size="lg" variant="secondary" className="hover:bg-secondary-foreground hover:text-white transition duration-300">
                Redeem Offer
              </Button>
            </div>
            <div className="hidden md:block">
              <Image
                src="/placeholder.svg"
                width={500}
                height={300}
                alt="Featured Promotion"
                className="object-cover"
                style={{ aspectRatio: "500/300", objectFit: "cover" }}
                priority
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
            {filteredPromotions.map((promotion) => (
              <PromotionCard 
                key={promotion._id}
                _id={promotion._id}
                title={promotion.promotionTitle}
                description={promotion.promotionDescription}
                endDate={promotion.promotionEndDate ?? ""}
                type={promotion.promotionType }
                image={promotion.promotionImage}
                goldenMembersOnly={promotion.goldenMembersOnly}
              />
            ))}
          </div>
        </div>
      </div>
  
<Separator />
<Footer/>
</>
);
}




