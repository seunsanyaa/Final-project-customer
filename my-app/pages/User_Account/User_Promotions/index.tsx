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

  // Calculate total money spent from bookings with proper rounding
  const totalMoneySpent = useMemo(() => {
    const total = bookings?.reduce((total, booking) => total + booking.totalCost, 0) || 0;
    return Math.ceil(total * 100) / 100; // Round up to 2 decimal places
  }, [bookings]);

  const handleClaimReward = async (promotionId: string) => {
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
        promotionId,
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
  const isPromotionActive = (promotionId: string) => {
    return userRedeemedPromotions?.some(promo => promo._id === promotionId) ?? false;
  };

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
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>Your Permanent Benefits Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Permanent Promotions */}
                {processedPermanentPromotions.map((promotion) => (
                  <Card key={promotion._id} className="mb-4 p-4 border-green-500">
                    <CardHeader>
                      <CardTitle>{promotion.promotionTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{promotion.promotionDescription}</p>
                      <div className="space-y-4">
                        {promotion.minimumMoneySpent && promotion.minimumMoneySpent > 0 && (
                          <div>
                            <div className="flex justify-between mb-2">
                              <span>Spending Progress</span>
                              <span>${totalMoneySpent.toFixed(2)} / ${promotion.minimumMoneySpent.toFixed(2)}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full transition-all duration-300" 
                                style={{ 
                                  width: `${Math.min((totalMoneySpent / (promotion.minimumMoneySpent || 1)) * 100, 100)}%`,
                                  minWidth: '0%'
                                }} 
                              />
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                              ${Math.ceil((promotion.minimumMoneySpent - totalMoneySpent) * 100) / 100} more to unlock
                            </p>
                          </div>
                        )}

                        {promotion.minimumRentals && promotion.minimumRentals > 0 && (
                          <div>
                            <div className="flex justify-between mt-4 mb-2">
                              <span>Rental Progress</span>
                              <span>{bookings?.length || 0} / {promotion.minimumRentals}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full transition-all duration-300" 
                                style={{ 
                                  width: `${Math.min(((bookings?.length || 0) / (promotion.minimumRentals || 1)) * 100, 100)}%`,
                                  minWidth: '0%'
                                }} 
                              />
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                              {Math.max(0, promotion.minimumRentals - (bookings?.length || 0))} more rentals to unlock
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
                          <Button
                            className="w-full"
                            disabled={
                              (promotion.minimumMoneySpent && promotion.minimumMoneySpent > 0 && totalMoneySpent < promotion.minimumMoneySpent) || 
                              (promotion.minimumRentals && promotion.minimumRentals > 0 && (bookings?.length || 0) < promotion.minimumRentals)
                            }
                            onClick={() => handleClaimReward(promotion._id)}
                          >
                            {((!promotion.minimumMoneySpent || totalMoneySpent >= promotion.minimumMoneySpent) && 
                              (!promotion.minimumRentals || (bookings?.length || 0) >= promotion.minimumRentals))
                              ? 'Activate Benefit' 
                              : 'Complete Requirements'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Active Benefits Section */}
                {userRedeemedPromotions && userRedeemedPromotions.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Your Active Benefits</h3>
                    <div className="grid gap-4">
                      {userRedeemedPromotions.map((promotion) => (
                        <Card key={promotion._id} className="bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{promotion.promotionTitle}</h4>
                                <p className="text-sm text-muted-foreground">{promotion.promotionDescription}</p>
                                <Badge className="mt-2">Active</Badge>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeactivate(promotion._id)}
                              >
                                Deactivate
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
} 