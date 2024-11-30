'use client'
import React, { useRef, useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Navi } from '../head/navi';
import { Footer } from '../head/footer';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { useUser } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { Redirection } from "@/components/ui/redirection";

// Add these types at the top of the file
type Promotion = {
  _id: Id<"promotions">;
  promotionType: 'discount' | 'offer' | 'upgrade' | 'permenant';
  promotionValue: number;
  promotionTitle: string;
  promotionDescription: string;
  specificTarget: string[];
  target: 'all' | 'specific' | 'none';
};

export function NewBooking3() {
  // 1. All hooks must be at the top level
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const bookingSummaryRef = useRef<HTMLDivElement>(null);
  
  // 2. All state hooks
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [extras, setExtras] = useState({
    insurance: false,
    gps: false,
    childSeat: false,
    chauffer: false,
    travelKit: false
  });
  const [pickupDateTime, setPickupDateTime] = useState('');
  const [dropoffDateTime, setDropoffDateTime] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [totalDays, setTotalDays] = useState(1);
  const [sentPrice, setSentPrice] = useState<number | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(null);

  // 3. Get query params
  const { registrationNumber, pricePerDay } = router.query as {
    registrationNumber?: string;
    pricePerDay?: string;
  };

  // 4. All query hooks
  const promotions = useQuery(api.promotions.getAllPromotions);
  const userPromotions = useQuery(api.promotions.getUserRedeemedPromotions, { 
    userId: user?.id ?? '' 
  });
  const carDetails = useQuery(api.car.getCar, { 
    registrationNumber: registrationNumber ?? '' 
  });
  const installmentDetails = useQuery(api.analytics.calculateInstallmentDetails, {
    basePrice: Number(pricePerDay ?? 0),
    totalDays,
    extras,
    promotionValue: selectedPromotion ? 
      promotions?.find(p => p._id === selectedPromotion)?.promotionValue : 
      undefined
  });
  const isGoldenMember = useQuery(api.customers.isGoldenMember, { 
    userId: user?.id ?? '' 
  });

  // 5. All useMemo hooks
  const applicablePromotions = useMemo(() => {
    if (!promotions || !carDetails || !userPromotions) return [];
    
    const regularPromotions = promotions.filter(promo => {
      if (promo.promotionType !== 'discount') return false;
      if (promo.target === 'all') return true;
      return promo.specificTarget.some(target => 
        target === carDetails._id || 
        (carDetails.categories && carDetails.categories.includes(target))
      );
    });

    const permanentPromotions = userPromotions
      .filter(promo => 
        !promo.isUsed && 
        promo.promotionType === 'permenant'
      );
    
    return [...regularPromotions, ...permanentPromotions];
  }, [promotions, carDetails, userPromotions]);

  // 6. All mutation hooks
  const createBooking = useMutation(api.bookings.createBooking);
  const createPaymentSession = useMutation(api.payment.createPaymentSession);
  const markPromotionAsUsed = useMutation(api.promotions.markPromotionAsUsed);

  // 7. Early return checks
  if (!isAuthenticated || !user) {
    return <Redirection />;
  }

  if (!registrationNumber || !pricePerDay) {
    return (
      <div className="p-4">
        <h1>Invalid booking parameters</h1>
        <Link href="/cars">Return to car listing</Link>
      </div>
    );
  }

  // 8. Event handlers and other functions
  const scrollToBookingSummary = () => {
    bookingSummaryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePaymentSelection = (method: string) => {
    setPaymentMethod(method);
    scrollToBookingSummary();
  };

  const handleExtraChange = (extra: keyof typeof extras) => {
    setExtras(prev => ({ ...prev, [extra]: !prev[extra] }));
  };

  const calculateTotal = () => {
    if (!pricePerDay || !totalDays) return { display: '0.00', amount: 0 };

    // Base price calculation
    let basePrice = parseFloat(pricePerDay) * totalDays;

    // Add extras
    const extrasCost = (
      (extras.insurance ? 10 : 0) +
      (extras.gps ? 5 : 0) +
      (extras.childSeat ? 8 : 0) +
      (extras.chauffer ? 100 : 0)
    ) * totalDays;

    let totalPrice = basePrice + extrasCost;

    // Apply promotion if selected
    if (selectedPromotion && promotions) {
      const promotion = promotions.find(p => p._id === selectedPromotion);
      if (promotion) {
        const discount = (totalPrice * promotion.promotionValue) / 100;
        totalPrice -= discount;
      }
    }

    // Calculate based on payment method
    if (paymentMethod === 'installment') {
      const weeklyRate = totalDays >= 7 ? 
        totalPrice / Math.ceil(totalDays / 7) :
        totalPrice / totalDays;

      return {
        display: totalDays >= 7 ?
          `${weeklyRate.toFixed(2)}/week for ${Math.ceil(totalDays / 7)} weeks` :
          `${weeklyRate.toFixed(2)}/day for ${totalDays} days`,
        amount: weeklyRate
      };
    }

    return {
      display: totalPrice.toFixed(2),
      amount: totalPrice
    };
  };

  const handleContinue = async () => {
    if (!carDetails || !pickupDateTime || !dropoffDateTime || !paymentMethod || !user) {
      console.error('Missing required booking details');
      return;
    }

    try {
      // Calculate the total amount based on payment method
      const totalAmount = calculateFullPrice(); // Get the full price
      const paidAmount = paymentMethod === 'installment' 
        ? calculateTotal().amount // Get the installment amount
        : parseFloat(totalAmount); // Get the full amount

      // Create the booking first
      const bookingId = await createBooking({
        customerId: user.id,
        carId: registrationNumber as string,
        startDate: pickupDateTime,
        endDate: dropoffDateTime,
        totalCost: parseFloat(totalAmount),
        paidAmount: 0, // Initially 0 as payment hasn't been processed
        status: 'pending',
        pickupLocation,
        dropoffLocation,
        customerInsurancetype: extras.insurance ? 'full' : 'basic',
        customerInsuranceNumber: 'INS123',
      });

      // Create payment session
      const paymentSession = await createPaymentSession({
        bookingId,
        userId: user.id,
        paymentType: paymentMethod,
        paidAmount: paidAmount,
        totalAmount: parseFloat(totalAmount),
      });

      // If promotion is selected, mark it as used
      if (selectedPromotion) {
        await markPromotionAsUsed({
          promotionId: selectedPromotion,
          userId: user.id,
        });
      }

      // Redirect to payment page with all necessary information
      router.push(`/Newbooking/payment/${paymentSession._id}?email=${encodeURIComponent(user.emailAddresses[0].emailAddress)}`);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handlePickupChange = (date: string) => {
    setPickupDateTime(date);
    updateTotalDays(date, dropoffDateTime);
  };

  const handleDropoffChange = (date: string) => {
    setDropoffDateTime(date);
    updateTotalDays(pickupDateTime, date);
  };

  const updateTotalDays = (pickup: string, dropoff: string) => {
    if (pickup && dropoff) {
      const pickupDate = new Date(pickup);
      const dropoffDate = new Date(dropoff);
      const differenceInTime = dropoffDate.getTime() - pickupDate.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      setTotalDays(differenceInDays > 0 ? differenceInDays : 1);
    }
  };

  const renderPromotions = () => {
    if (applicablePromotions.length === 0) return null;

    return (
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Available Discounts</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {applicablePromotions.map((promo) => {
            const isUserPromo = userPromotions?.some(up => up._id === promo._id);
            
            return (
              <Card 
                key={promo._id} 
                className={`cursor-pointer ${
                  selectedPromotion === promo._id ? 'border-2 border-blue-500' : ''
                }`}
                onClick={() => setSelectedPromotion(promo._id === selectedPromotion ? null : promo._id)}
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold">{promo.promotionTitle}</h3>
                  <p className="text-muted-foreground">{promo.promotionDescription}</p>
                  <p className="text-lg font-bold mt-2">{promo.promotionValue}% OFF</p>
                  {isUserPromo && (
                    <p className="text-sm text-blue-600 mt-1">Your Redeemed Promotion</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderBookingSummary = () => {
    const total = calculateTotal();
    const basePrice = parseFloat(pricePerDay ?? '0') * totalDays;

    return (
      <div className="space-y-1">
        <div className="flex flex-row space-x-60 gap-x-10">
          <div className="flex flex-col space-y-1">
            <p className="font-semibold">Pickup:</p>
            <p>{pickupDateTime ? new Date(pickupDateTime).toLocaleString() : 'Not set'}</p>
            <p>{pickupLocation || 'Location not set'}</p>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="font-semibold">Drop-off:</p>
            <p>{dropoffDateTime ? new Date(dropoffDateTime).toLocaleString() : 'Not set'}</p>
            <p>{dropoffLocation || 'Location not set'}</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <p>Car Rental (${pricePerDay}/day × {totalDays} days)</p>
          <p className="font-semibold">${basePrice.toFixed(2)}</p>
        </div>
        {extras.insurance && (
          <div className="flex items-center justify-between">
            <p>Insurance ($10/day × {totalDays} days)</p>
            <p className="font-semibold">${(10 * totalDays).toFixed(2)}</p>
          </div>
        )}
        {extras.gps && (
          <div className="flex items-center justify-between">
            <p>GPS ($5/day × {totalDays} days)</p>
            <p className="font-semibold">${(5 * totalDays).toFixed(2)}</p>
          </div>
        )}
        {extras.childSeat && (
          <div className="flex items-center justify-between">
            <p>Child Seat ($8/day × {totalDays} days)</p>
            <p className="font-semibold">${(8 * totalDays).toFixed(2)}</p>
          </div>
        )}
        {extras.chauffer && (
          <div className="flex items-center justify-between bg-customyello">
            <p>Chauffer Service ($100/day × {totalDays} days)</p>
            <p className="font-semibold">${(100 * totalDays).toFixed(2)}</p>
          </div>
        )}
        {extras.travelKit && (
          <div className="flex items-center justify-between text-green-600 bg-customyello">
            <p>Travel Kit (Complimentary)</p>
            <p className="font-semibold">Free</p>
          </div>
        )}
        {selectedPromotion && (
          <div className="flex items-center justify-between text-green-600">
            <p>Promotion Applied</p>
            <p className="font-semibold">
              -{promotions?.find(p => p._id === selectedPromotion)?.promotionValue}%
            </p>
          </div>
        )}
        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Total</p>
          <p className="text-lg font-semibold">
            ${total.display}
          </p>
        </div>
        {paymentMethod && (
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Payment Method</p>
            <p className="text-lg font-semibold">
              {paymentMethod === 'full' ? 'Full Payment' : 'Installment Plan'}
            </p>
          </div>
        )}
      </div>
    );
  };

  const calculateFullPrice = () => {
    if (!pricePerDay || !totalDays) return '0.00';

    // Base price calculation
    let basePrice = parseFloat(pricePerDay) * totalDays;

    // Add extras
    const extrasCost = (
      (extras.insurance ? 10 : 0) +
      (extras.gps ? 5 : 0) +
      (extras.childSeat ? 8 : 0) +
      (extras.chauffer ? 100 : 0)
    ) * totalDays;

    let totalPrice = basePrice + extrasCost;

    // Apply promotion if selected
    if (selectedPromotion && promotions) {
      const promotion = promotions.find(p => p._id === selectedPromotion);
      if (promotion) {
        const discount = (totalPrice * promotion.promotionValue) / 100;
        totalPrice -= discount;
      }
    }

    return totalPrice.toFixed(2);
  };

  const renderPaymentOptions = () => (
    <Card className="w-full mx-auto mt-12 rounded-lg p-8 bg-white shadow-2xl" style={{ border: "none" }}>
      <CardHeader>
        <CardTitle>Payment Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Installment Payment Options</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Break your payment into easy monthly installments</li>
              <li>No additional interest or hidden fees</li>
              <li>Choose from flexible plans that suit your budget</li>
            </ul>
            <Button 
              className="w-fit px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" 
              onClick={() => handlePaymentSelection('installment')}
            >
              Choose Installment Plan
            </Button>
          </div>
          <div className="my-8 border-t border-gray-200" />
          <div>
            <h3 className="text-xl font-semibold mb-4">Full Payment</h3>
            <p className="text-lg font-semibold mb-4">
              Pay ${calculateFullPrice()} upfront
            </p>
            <h4 className="font-semibold mb-2">Advantages of Full Payment:</h4>
            <ul className="list-disc pl-5 mb-4">
              <li>Save time with one single payment</li>
              <li>Get a 5% discount on any future bookings</li>
              <li>Priority support for future bookings and changes</li>
              <li>Exclusive offers and rewards for full payment customers</li>
            </ul>
            <Button 
              className="w-fit px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" 
              onClick={() => handlePaymentSelection('full')}
            >
              Pay Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Navi/>

      <Separator />

      <div className="w-full max-w-6xl mx-auto px-2 md:px-6 py-12 md:py-16">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Booking</h1>
          <p className="text-muted-foreground">Choose your extras, and complete your booking.</p>
        </div>
        <div className="grid md:grid-cols-[2fr_1fr] gap-8 md:gap-5 pl-0 pr-0">
          <div className="mt-2 mb-1 space-y-1">
          <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-lg" style={{ border: "none" }}>
              <CardContent>
                <div className="space-y-6">
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="pickup-date">Pickup Date & Time</Label>
                      <Input 
                        type="datetime-local" 
                        id="pickup-date" 
                        className="mt-1 w-full bg-card rounded-lg shadow-lg relative" 
                        value={pickupDateTime}
                        onChange={(e) => handlePickupChange(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dropoff-date">Drop-off Date & Time</Label>
                      <Input 
                        type="datetime-local" 
                        id="dropoff-date" 
                        className="mt-1 w-full bg-card rounded-lg shadow-lg relative" 
                        value={dropoffDateTime}
                        onChange={(e) => handleDropoffChange(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pickup">Pickup Location</Label>
                      <Input 
                        id="pickup" 
                        placeholder="Enter location" 
                        className="mt-1 w-full bg-card rounded-lg shadow-lg relative"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dropoff">Drop-off Location</Label>
                      <Input 
                        id="dropoff" 
                        placeholder="Enter location" 
                        className="mt-1 w-full bg-card rounded-lg shadow-lg relative"
                        value={dropoffLocation}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Choose Extras</h2>
              <div className="grid gap-4">
                <Card className={`w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-lg ${extras.insurance ? 'bg-muted' : ''}`} style={{ border: "none" }}>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Insurance</h3>
                        <p className="text-muted-foreground">Protect your rental with our comprehensive coverage.</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$10/day</p>
                        <Checkbox 
                          checked={extras.insurance}
                          onCheckedChange={() => handleExtraChange('insurance')}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className={`w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-lg ${extras.gps ? 'bg-muted' : ''}`} style={{ border: "none" }}>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">GPS</h3>
                        <p className="text-muted-foreground">Never get lost with our built-in navigation.</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$5/day</p>
                        <Checkbox 
                          checked={extras.gps}
                          onCheckedChange={() => handleExtraChange('gps')}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className={`w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-lg ${extras.childSeat ? 'bg-muted' : ''}`} style={{ border: "none" }}>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Child Seat</h3>
                        <p className="text-muted-foreground">Keep your little ones safe and secure.</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$8/day</p>
                        <Checkbox 
                          checked={extras.childSeat}
                          onCheckedChange={() => handleExtraChange('childSeat')}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {isGoldenMember && (
                  <>
                    <Card className={`w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-lg ${extras.chauffer ? 'bg-muted' : 'bg-customyello'}`} style={{ border: "none" }}>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">Chauffer Service</h3>
                            <p className="text-muted-foreground">Professional driver at your service.</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">$100/day</p>
                            <Checkbox 
                              checked={extras.chauffer}
                              onCheckedChange={() => handleExtraChange('chauffer')}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={`w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-lg ${extras.travelKit ? 'bg-muted' : 'bg-customyello'}`} style={{ border: "none" }}>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">Travel Kit</h3>
                            <p className="text-muted-foreground">Complimentary premium travel essentials.</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">Free</p>
                            <Checkbox 
                              checked={extras.travelKit}
                              onCheckedChange={() => handleExtraChange('travelKit')}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
            <div className="mt-2" ref={bookingSummaryRef}>
              <Card className="w-full mx-auto mt-2 rounded-lg p-8 bg-white shadow-2xl"style={{ border: "none" }}>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderBookingSummary()}
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2">
                    
                    <Button 
                      className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" 
                      disabled={!paymentMethod || !pickupDateTime || !dropoffDateTime || !pickupLocation || !dropoffLocation}
                      onClick={handleContinue}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
          <div className="space-y-6">
            {renderPaymentOptions()}
          </div>
        </div>
        {renderPromotions()}
      </div>
      <Separator />

<Footer/>
</>
);
}



