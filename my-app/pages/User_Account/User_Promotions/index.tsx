import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Navi } from "@/components/general/head/navi";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function UserPromotions() {
  const { user } = useUser();
  const [bookingsCount, setBookingsCount] = useState(0);
  
  // Fetch customer bookings and promotions
  const bookings = useQuery(api.bookings.getBookingsByCustomer, { 
    customerId: user?.id || "" 
  });
  const promotions = useQuery(api.promotions.getRegularMemberPromotions);
  const redeemPromo = useMutation(api.promotions.redeemPromo);

  // Calculate bookings count
  useEffect(() => {
    if (bookings) {
      setBookingsCount(bookings.length);
    }
  }, [bookings]);

  const bookingsRequired = 2;
  const progressPercentage = (bookingsCount / bookingsRequired) * 100;

  // Find the 5% discount promotion
  const discountPromotion = promotions?.find(
    promo => promo.promotionType === 'discount' && promo.promotionValue === 5
  );

  const handleClaimReward = async (promotionId: string) => {
    await redeemPromo({
      userId: user?.id || "",
      promotionId: promotionId
    });
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
                <CardTitle className="text-2xl font-bold">Rewards Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Progress Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Bookings Progress</span>
                    <span className="text-sm font-medium">{bookingsCount}/{bookingsRequired} Bookings</span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-customyello rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {bookingsCount >= bookingsRequired 
                      ? "You've unlocked special offers!"
                      : `Make ${bookingsRequired - bookingsCount} more booking${bookingsRequired - bookingsCount !== 1 ? 's' : ''} to unlock special offers!`
                    }
                  </p>
                </div>

                {/* Available Rewards Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Available Rewards</h3>
                  
                  {bookingsCount >= bookingsRequired ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {discountPromotion && (
                        <Card className="border-2 border-customyello">
                          <CardContent className="p-4">
                            <h4 className="font-bold mb-2">{discountPromotion.promotionTitle}</h4>
                            <p className="text-sm text-muted-foreground">
                              {discountPromotion.promotionDescription}
                            </p>
                            <Button 
                              className="w-full mt-4" 
                              variant="outline"
                              onClick={() => handleClaimReward(discountPromotion._id)}
                            >
                              Claim Reward
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-muted-foreground">
                        Complete more bookings to unlock exciting rewards!
                      </p>
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