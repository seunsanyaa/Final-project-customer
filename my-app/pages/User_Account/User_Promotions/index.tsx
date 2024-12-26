import React, { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Navi } from "@/components/general/head/navi";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Id } from "../../../convex/_generated/dataModel";

export default function UserPromotions() {
  const { user } = useUser();
  const bookings = useQuery(api.bookings.getBookingsByCustomer, { 
    customerId: user?.id || "" 
  });
  const permanentPromotions = useQuery(api.promotions.getPermanentPromotions);
  const redeemPromo = useMutation(api.promotions.redeemPromo);
  const deactivatePromo = useMutation(api.promotions.deactivatePromo);
  const userRedeemedPromotions = useQuery(api.promotions.getUserRedeemedPromotions, { 
    userId: user?.id || "" 
  });
  const rewardPoints = useQuery(api.customers.getRewardPointsByUserId, { 
    userId: user?.id || "" 
  });

  // Calculate total money spent from bookings with proper rounding
  const totalMoneySpent = useMemo(() => {
    const total = bookings?.reduce((total, booking) => total + booking.totalCost, 0) || 0;
    return Math.ceil(total * 100) / 100; // Round up to 2 decimal places
  }, [bookings]);

  const handleClaimReward = async (promotionId: Id<"promotions">) => {
    if (!user?.id) return;
    try {
      await redeemPromo({
        userId: user.id,
        promotionId,
      });
    } catch (error) {
      console.error('Error redeeming promotion:', error);
    }
  };

  const handleDeactivate = async (promotionId: string) => {
    if (!user?.id) return;
    try {
      await deactivatePromo({
        userId: user.id,
        promotionId: promotionId as Id<"promotions">,
      });
    } catch (error) {
      console.error('Error deactivating promotion:', error);
    }
  };

  // Filter and process permanent promotions
  const processedPermanentPromotions = useMemo(() => {
    if (!permanentPromotions || !bookings) return [];

    return permanentPromotions.filter(promotion => {
      // Skip promotions that have both minimums as 0 or undefined
      if ((!promotion.minimumRentals || promotion.minimumRentals === 0) && 
          (!promotion.minimumMoneySpent || promotion.minimumMoneySpent === 0)) {
        return false;
      }
      return true;
    });
  }, [permanentPromotions, bookings]);

  // Check if a promotion is active
  const isPromotionActive = (promotionId: Id<"promotions">) => {
    return userRedeemedPromotions?.some(promo => promo?._id === promotionId) ?? false;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navi />
      <Separator />
      <div className="flex flex-row h-full">
        <aside className="flex flex-col items-left w-fit px-4 md:px-6 border-b bg-primary text-primary-foreground py-2 md:py-12 min-h-[calc(95.5vh-65px)]">
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
            </div>
          </nav>
        </aside>

        <main className="flex-1 bg-background py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen mx-auto">
            <div className="flex justify-end mb-4">
              <span className="text-sm font-medium">
                Reward Points: {rewardPoints ?? 0}
              </span>
            </div>
            <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-lg" style={{ border: "none" }}>
              <CardHeader>
                <CardTitle>Your Permanent Benefits Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Permanent Promotions */}
                {processedPermanentPromotions.map((promotion, index) => (
                  <Card key={promotion._id} className="w-full mx-auto mt-4 rounded-lg p-1 bg-white shadow-lg" style={{ border: "none" }}>
                    <CardHeader>
                      <CardTitle>{promotion.promotionTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{promotion.promotionDescription}</p>
                      <div className="space-y-6">
                        {/* Show Money Spent Progress Bar only for the last card */}
                        {index === processedPermanentPromotions.length - 1 ? (
                          <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Spending Progress</span>
                              <span className="text-sm font-medium">
                                ${totalMoneySpent.toFixed(2)} / ${(promotion.minimumMoneySpent || 0).toFixed(2)}
                              </span>
                            </div>
                            <div className="w-full h-4 bg-gray-200 rounded-full border border-blue-700" style={{ backgroundColor: '#E5E7EB', borderRadius: '0.375rem' }}>
                              <div 
                                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${Math.min((totalMoneySpent / (promotion.minimumMoneySpent || 1)) * 100, 100)}%`,
                                  borderRadius: '0.375rem',
                                  border: '1px solid #2563EB',
                                  backgroundColor: '#3B82F6',
                                  transition: 'width 0.5s ease-in-out'
                                }}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                              ${Math.max(0, Math.ceil(((promotion.minimumMoneySpent ?? 0) - totalMoneySpent) * 100) / 100)} more to unlock
                            </p>
                          </div>
                        ) : (
                          /* Show Bookings Progress Bar for first two cards */
                          <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Rental Progress</span>
                              <span className="text-sm font-medium">
                                {Math.min(bookings?.length || 0, promotion.minimumRentals || 0)} / {promotion.minimumRentals || 0} Bookings
                              </span>
                            </div>
                            <div className="w-full h-4 bg-gray-200 rounded-full border border-blue-700" style={{ backgroundColor: '#E5E7EB', borderRadius: '0.375rem' }}>
                              <div 
                                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${Math.min(((bookings?.length || 0) / (promotion.minimumRentals || 1)) * 100, 100)}%`,
                                  borderRadius: '0.375rem',
                                  border: '1px solid #2563EB',
                                  backgroundColor: '#3B82F6',
                                  transition: 'width 0.5s ease-in-out'
                                }}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                              {Math.max(0, (promotion.minimumRentals || 0) - (bookings?.length || 0))} more bookings to unlock
                            </p>
                          </div>
                        )}

                        {isPromotionActive(promotion._id) ? (
                          <Button
                            className="w-full bg-green-500 hover:bg-green-600"
                            disabled
                          >
                            Activated
                          </Button>
                        ) : (
                          <div className="flex justify-center">
                            <Button
                              className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl"
                              disabled={Boolean(
                                (promotion.minimumMoneySpent && promotion.minimumMoneySpent > 0 && totalMoneySpent < promotion.minimumMoneySpent) || 
                                (promotion.minimumRentals && promotion.minimumRentals > 0 && (bookings?.length || 0) < promotion.minimumRentals)
                              )}
                              onClick={() => handleClaimReward(promotion._id)}
                            >
                              {((!promotion.minimumMoneySpent || totalMoneySpent >= promotion.minimumMoneySpent) && 
                                (!promotion.minimumRentals || (bookings?.length || 0) >= promotion.minimumRentals))
                                ? 'Activate Benefit' 
                                : 'Complete Requirements'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Active Benefits Section */}
                {userRedeemedPromotions?.filter(promotion => promotion !== null).map((promotion) => (
                  <Card key={promotion!._id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{promotion!.promotionTitle}</h4>
                          <p className="text-sm text-muted-foreground">{promotion!.promotionDescription}</p>
                          <Badge className="mt-2">Active</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeactivate(promotion!._id)}
                        >
                          Deactivate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
} 