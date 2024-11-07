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
  const bookingSummaryRef = useRef<HTMLDivElement>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [extras, setExtras] = useState({
    insurance: false,
    gps: false,
    childSeat: false
  });
  const {user} = useUser();
  const [pickupDateTime, setPickupDateTime] = useState('');
  const [dropoffDateTime, setDropoffDateTime] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const router = useRouter();
  const { model, maker, pricePerDay, registrationNumber } = router.query;
  const [totalDays, setTotalDays] = useState(1); // Assume a default of 1 day for simplicity
  let sentprice=0;
  const [sentPrice, setSentPrice] = useState<number | null>(null); // Define sentPrice as a state variable
  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(null);
  const { isAuthenticated } = useConvexAuth();
  
  // Fetch all active promotions
  const promotions = useQuery(api.promotions.getAllPromotions) || [];
  
  // Get car details - store the _id when received
  const carDetails = useQuery(api.car.getCar, { 
    registrationNumber: registrationNumber as string 
  });

  // Add new query for user promotions
  const userPromotions = useQuery(api.promotions.getUserRedeemedPromotions, { 
    userId: user?.id ?? '' 
  });

  // Update the applicablePromotions memo to include user promotions
  const applicablePromotions = useMemo(() => {
    if (!promotions || !carDetails || !userPromotions) return [];
    
    // Handle regular promotions (discount type)
    const regularPromotions = promotions.filter(promo => {
      if (promo.promotionType !== 'discount') return false;
      
      // If target is 'all', promotion applies to all cars
      if (promo.target === 'all') return true;
      
      // Otherwise, check specific targets
      return promo.specificTarget.some(target => 
        target === carDetails._id || 
        (carDetails.categories && carDetails.categories.includes(target))
      );
    });

    // Handle permanent promotions (only from user's redeemed promotions)
    const permanentPromotions = userPromotions
      .filter(promo => 
        !promo.isUsed && 
        promo.promotionType === 'permenant'
      );
    
    // Combine both types of promotions
    return [...regularPromotions, ...permanentPromotions];
  }, [promotions, carDetails, userPromotions]);

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
  let totalcalc="";
  let totalprice=0;
  const calculateTotal = () => {
    const basePrice = Number(pricePerDay);
    
    // Get installment details from analytics
    const installmentDetails = useQuery(api.analytics.calculateInstallmentDetails, {
      basePrice,
      totalDays,
      extras,
      promotionValue: selectedPromotion && applicablePromotions.length > 0
        ? applicablePromotions.find(p => p._id === selectedPromotion)?.promotionValue
        : undefined
    });

    if (!installmentDetails) return '';

    totalcalc = `${installmentDetails.totalPrice.toFixed(2)} One time payment`;
    totalprice = installmentDetails.totalPrice;
    
    if (paymentMethod === "full") {
      sentprice = installmentDetails.totalPrice;
      return totalcalc;
    } else if (paymentMethod === 'installment') {
      sentprice = installmentDetails.installmentAmount;
      return totalDays < 7 
        ? `${installmentDetails.installmentAmount.toFixed(2)}/day for ${totalDays} days` 
        : `${installmentDetails.installmentAmount.toFixed(2)}/week for ${Math.floor(totalDays / 7)} weeks`;
    }

    return '';
  };

  const createBooking = useMutation(api.bookings.createBooking);
  const createPaymentSession = useMutation(api.payment.createPaymentSession);

  const handleContinue = async () => {
    if (!isAuthenticated) {
      console.error('User not authenticated');
      return;
    }

    try {
      // Create booking first
      const bookingId = await createBooking({
        customerId: user?.id as string,
        carId: registrationNumber as string,
        startDate: pickupDateTime,
        endDate: dropoffDateTime,
        totalCost: totalprice,
        paidAmount: 0,
        status: 'pending',
        pickupLocation,
        dropoffLocation,
        customerInsurancetype: extras.insurance ? 'full' : 'basic',
        customerInsuranceNumber: 'INS123',
      });

      // Create payment session with different parameters based on payment method
      const paymentSession = await createPaymentSession({
        bookingId,
        userId: user?.id as string,
        paymentType: paymentMethod || 'full',
        paidAmount: paymentMethod === 'installment' ? sentprice : totalprice,
        ...(paymentMethod === 'installment' && {
          totalAmount: totalprice,
        }),
      });

      // Redirect to payment page with session ID
      router.push(`/Newbooking/payment/${paymentSession._id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const total = calculateTotal(); // Add this line to calculate total

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
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24)); // Convert milliseconds to days
      setTotalDays(differenceInDays > 0 ? differenceInDays : 1); // Ensure at least 1 day
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

  const markPromotionAsUsed = useMutation(api.promotions.markPromotionAsUsed);

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
              </div>
            </div>
            <div className="mt-2" ref={bookingSummaryRef}>
              <Card className="w-full mx-auto mt-2 rounded-lg p-8 bg-white shadow-2xl"style={{ border: "none" }}>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>

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
                      <p>Car Rental</p>
                      <p className="font-semibold">${pricePerDay}/day</p>
                    </div>
                    {extras.insurance && (
                      <div className="flex items-center justify-between">
                        <p>Insurance</p>
                        <p className="font-semibold">$10/day</p>
                      </div>
                    )}
                    {extras.gps && (
                      <div className="flex items-center justify-between">
                        <p>GPS</p>
                        <p className="font-semibold">$5/day</p>
                      </div>
                    )}
                    {extras.childSeat && (
                      <div className="flex items-center justify-between">
                        <p>Child Seat</p>
                        <p className="font-semibold">$8/day</p>
                      </div>
                    )}
                    <Separator />
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">Total</p>
                      {paymentMethod && (
                        <p className="text-lg font-semibold">
                          ${total}
                        </p>
                      )}
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
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2">
                    
                    <Button 
                      className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" 
                      disabled={!paymentMethod}
                      onClick={handleContinue}
                    >
                      Continue
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
          <div className="space-y-6">
            <Card className="w-full mx-auto mt-12 rounded-lg p-8 bg-white shadow-2xl"style={{ border: "none" }}>
              <CardHeader>
                <CardTitle>Payment Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Installment Payment Options</h3>
                    <ul className="list-disc pl-5 mb-4">
                      <li>Break your payment into easy monthly installments.</li>
                      <li>No additional interest or hidden fees.</li>
                      <li>Choose from flexible plans that suit your budget.</li>
                    </ul>
                    <Button 
                      className="w-fit px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" 
                      onClick={() => handlePaymentSelection('installment')}
                    >
                      Choose Installment Plan
                    </Button>
                  </div>
                  <div className="my-8 border-t border-gray-200" /> {/* Custom separator */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Full Payment</h3>
                    <p className="text-lg font-semibold mb-4">Pay ${totalcalc} upfront.</p>
                    <h4 className="font-semibold mb-2">Advantages of Full Payment:</h4>
                    <ul className="list-disc pl-5 mb-4">
                      <li>Save time with one single payment.</li>
                      <li>Get a 5% discount on any future bookings.</li>
                      <li>Priority support for future bookings and changes.</li>
                      <li>Exclusive offers and rewards for full payment customers.</li>
                    </ul>
                  </div>
                </div>
                <div className="grid gap-4 mt-6">
                  <Button 
                    className="w-fit px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" 
                    onClick={() => handlePaymentSelection('full')}
                  >
                    Pay Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {renderPromotions()}
      </div>
      <Separator />

<Footer/>
</>
);
}



