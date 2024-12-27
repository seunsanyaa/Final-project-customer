'use client'
import React, { useRef, useState, useMemo, useEffect } from "react";
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
// import { Redirection } from "@/components/ui/redirection";
import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react'; // Import the map icon
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { ChevronDown } from 'lucide-react'; // Import the chevron icon
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Dynamically import the MapComponent with ssr disabled
const MapComponent = dynamic(
  () => import('@/components/ui/map_for_bookings'),
  { 
    ssr: false,
    loading: () => <p>Loading map...</p>
  }
);

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

// Add this near your other type definitions
type OfficeLocation = {
  name: string;
  address: string;
  coordinates: { lat: number; lng: number; }
};

// Update the useCurrency hook to include client-side check
const useCurrency = () => {
  const [currency, setCurrency] = useState<string>('USD');

  useEffect(() => {
    // Only listen for currency changes, not language
    if (typeof window === 'undefined') return;

    const settings = localStorage.getItem('userSettings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      if (parsedSettings.currency) {
        setCurrency(parsedSettings.currency);
      }
    }

    const handleCurrencyChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setCurrency(customEvent.detail.currency);
    };

    window.addEventListener('currencyChange', handleCurrencyChange);
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange);
    };
  }, []);

  return currency;
};

export function NewBooking3() {
  // 1. All hooks must be at the top level
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const bookingSummaryRef = useRef<HTMLDivElement>(null);
  
  // 2. All state hooks
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [insuranceType, setInsuranceType] = useState<string>('basic');
  const [extras, setExtras] = useState({
    insurance: false,
    insuranceCost: 0, // Default cost
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
  const currency = useCurrency();
  const [showPickupMap, setShowPickupMap] = useState(false);
  const [showDropoffMap, setShowDropoffMap] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);
  const [dateError, setDateError] = useState<string>('');
  const [showOfficeOptions, setShowOfficeOptions] = useState(false);
  const [showDropoffOptions, setShowDropoffOptions] = useState(false);
  const [showCashOption, setShowCashOption] = useState(false);

  // 3. Get query params
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const registrationNumber = searchParams.get('registrationNumber') || '';
  const pricePerDay = searchParams.get('pricePerDay') || '';

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
  const currentBookingData = useQuery(api.analytics.getCurrentBooking, { 
    customerId: user?.id ?? '' 
  });

  // 5. All mutation hooks (moved up)
  const createBooking = useMutation(api.bookings.createBooking);
  const createPaymentSession = useMutation(api.payment.createPaymentSession);
  const markPromotionAsUsed = useMutation(api.promotions.markPromotionAsUsed);

  // 6. All memo hooks
  const officeLocations = useMemo(() => [
    { 
      name: "Nicosia Office", 
      address: "Ataturk Cd, Nicosia, CY",
      coordinates: { lat: 35.190103, lng: 33.362347 }
    },
    { 
      name: "Famagusta Office", 
      address: "Esrif bitlis Cd, Famagusta, CY",
      coordinates: { lat: 35.130542, lng: 33.928980 }
    },
    { 
      name: "Girne Office", 
      address: "Ecevit Cd, Girne, CY",
      coordinates: { lat: 35.3364, lng: 33.3199 }
    }
  ], []);

  const applicablePromotions = useMemo(() => {
    if (!promotions || !carDetails || !userPromotions) return [];
    
    const regularPromotions = promotions.filter(promo => {
      if (promo.promotionType !== 'discount') return false;
      if (promo.target === 'all') return true;
      if (typeof carDetails === 'string') return false;
      return promo.specificTarget.some(target => 
        target === carDetails._id || 
        (carDetails.categories && carDetails.categories.includes(target))
      );
    });

    const permanentPromotions = userPromotions
      .filter(promo => 
        promo && !promo.isUsed && 
        promo.promotionType === 'permenant'
      );
    
    return [...regularPromotions, ...permanentPromotions];
  }, [promotions, carDetails, userPromotions]);

  // 7. All useEffect hooks
  useEffect(() => {
    if (currentBookingData) {
      setCurrentBooking(currentBookingData);
    }
  }, [currentBookingData]);

  useEffect(() => {
    const checkOfficeLocations = () => {
      const isPickupOffice = officeLocations.some(office => office.address === pickupLocation);
      const isDropoffOffice = officeLocations.some(office => office.address === dropoffLocation);
      setShowCashOption(isPickupOffice && isDropoffOffice);
    };

    checkOfficeLocations();
  }, [pickupLocation, dropoffLocation, officeLocations]);

  // 8. Early return checks (after all hooks)
  if (!registrationNumber || !pricePerDay) {
    return (
      <div className="p-4">
        <h1>Invalid booking parameters</h1>
        <Link href="/cars">Return to car listing</Link>
      </div>
    );
  }

  // 9. Event handlers and other functions
  const scrollToBookingSummary = () => {
    bookingSummaryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePaymentSelection = (method: string) => {
    setPaymentMethod(method);
    scrollToBookingSummary();
  };

  const handleExtraChange = (extra: keyof typeof extras) => {
    if (extra === 'insurance') {
      setExtras(prev => ({
        ...prev,
        [extra]: !prev[extra],
        insuranceCost: !prev[extra] ? insuranceOptions[insuranceType as keyof typeof insuranceOptions].price : 0
      }));
    } else {
      setExtras(prev => ({ ...prev, [extra]: !prev[extra] }));
    }
  };

  const handleInsuranceTypeChange = (value: string) => {
    setInsuranceType(value);
    if (extras.insurance) {
      setExtras(prev => ({
        ...prev,
        insuranceCost: insuranceOptions[value as keyof typeof insuranceOptions].price
      }));
    }
  };

  const calculateTotal = () => {
    if (!pricePerDay || !totalDays) return { display: '0.00', amount: 0 };

    // Base price calculation
    let basePrice = parseFloat(pricePerDay) * totalDays;

    // Add extras
    const extrasCost = (
      (extras.insurance ? extras.insuranceCost : 0) +
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
      const totalAmount = calculateFullPrice();
      const paidAmount = paymentMethod === 'installment' 
        ? calculateTotal().amount 
        : parseFloat(totalAmount);

      // Create the booking first
      const bookingId = await createBooking({
        customerId: user.id,
        carId: registrationNumber as string,
        startDate: pickupDateTime,
        endDate: dropoffDateTime,
        totalCost: parseFloat(totalAmount),
        paidAmount: 0,
        status: 'pending',
        pickupLocation,
        dropoffLocation,
        paymentType: paymentMethod,
        installmentPlan: paymentMethod === 'installment' ? {
          frequency: 'weekly',
          totalInstallments: totalDays < 7 ? totalDays : Math.floor(totalDays / 7),
          amountPerInstallment: calculateTotal().amount,
          remainingInstallments: totalDays < 7 ? totalDays : Math.floor(totalDays / 7),
          nextInstallmentDate: new Date().toISOString(),
        } : undefined,
        extras: {
          insurance: extras.insurance,
          insuranceCost: extras.insuranceCost,
          gps: extras.gps,
          childSeat: extras.childSeat,
          chauffer: extras.chauffer,
          travelKit: extras.travelKit
        }
      });
      if (selectedPromotion) {
        await markPromotionAsUsed({
          promotionId: selectedPromotion as Id<"promotions">,
          userId: user.id,
        });
      }
      if (paymentMethod === 'full'||paymentMethod === 'installment') {
      const { sessionId } = await createPaymentSession({
        bookingId,
        totalAmount: parseFloat(totalAmount),
        paidAmount: paidAmount,
        userId: user.id,
        status: 'pending',
        isSubscription: false,
        subscriptionPlan: undefined // optional field from schema
      });
      router.push(`/Newbooking/payment/${sessionId}?email=${encodeURIComponent(user.emailAddresses[0].emailAddress)}`);
    }
    else if (paymentMethod === 'cash') {
      router.push(`/bookings`);
    }
      
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handlePickupChange = (date: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);
    if (selectedDate < tomorrow) {
      setDateError("Pickup date must be at least tomorrow");
      setPickupDateTime('');
      return;
    }

    if (currentBooking) {
      const bookingStart = new Date(currentBooking.startDate);
      const bookingEnd = new Date(currentBooking.endDate);
      
      if (selectedDate >= bookingStart && selectedDate <= bookingEnd) {
        setDateError("You have an existing booking during this period");
        setPickupDateTime('');
        return;
      }
    }

    setDateError('');
    setPickupDateTime(date);
    updateTotalDays(date, dropoffDateTime);
  };

  const handleDropoffChange = (date: string) => {
    const dropoffDate = new Date(date);
    const pickupDate = new Date(pickupDateTime);

    if (dropoffDate <= pickupDate) {
      setDateError('Drop-off date must be after pickup date');
      setDropoffDateTime('');
      return;
    }

    // Check if there's a current booking that overlaps
    if (currentBooking) {
      const bookingStart = new Date(currentBooking.startDate);
      const bookingEnd = new Date(currentBooking.endDate);
      
      if (dropoffDate >= bookingStart && dropoffDate <= bookingEnd) {
        setDateError('You have an existing booking during this period');
        setDropoffDateTime('');
        return;
      }
    }

    setDateError('');
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
            const isUserPromo = userPromotions?.some(up => up && promo && up._id === promo._id);
            
            return (
              <Card 
                key={promo?._id} 
                className={`w-full mx-auto mt-1 rounded-lg p-1 shadow-xl cursor-pointer ${
                  selectedPromotion === promo?._id ? 'bg-muted border-2 border-blue-500' : 'bg-white hover:bg-muted'
                }`}
                style={{ border: "none" }}
                onClick={() => setSelectedPromotion(
                  promo?._id ? 
                  (promo._id === selectedPromotion ? null : promo._id.toString()) 
                  : null
                )}
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold">{promo?.promotionTitle}</h3>
                  <p className="text-muted-foreground">{promo?.promotionDescription}</p>
                  <p className="text-lg font-bold mt-2">{promo?.promotionValue}% OFF</p>
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
          <p>Car Rental ({formatPrice(parseFloat(pricePerDay ?? '0'))}/day × {totalDays} days)</p>
          <p className="font-semibold">{formatPrice(basePrice)}</p>
        </div>
        {extras.insurance && (
          <div className="flex items-center justify-between">
            <p>Insurance ({formatPrice(extras.insuranceCost)}/day × {totalDays} days)</p>
            <p className="font-semibold">{formatPrice(extras.insuranceCost * totalDays)}</p>
          </div>
        )}
        {extras.gps && (
          <div className="flex items-center justify-between">
            <p>GPS ({formatPrice(5)}/day × {totalDays} days)</p>
            <p className="font-semibold">{formatPrice(5 * totalDays)}</p>
          </div>
        )}
        {extras.childSeat && (
          <div className="flex items-center justify-between">
            <p>Child Seat ({formatPrice(8)}/day × {totalDays} days)</p>
            <p className="font-semibold">{formatPrice(8 * totalDays)}</p>
          </div>
        )}
        {extras.chauffer && (
          <div className="flex items-center justify-between bg-customyello">
            <p>Chauffer Service ({formatPrice(100)}/day × {totalDays} days)</p>
            <p className="font-semibold">{formatPrice(100 * totalDays)}</p>
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
          <div className="text-right">
            <p className="text-lg font-semibold">
              {formatPrice(parseFloat(total.amount.toString()))}
            </p>
            {paymentMethod === 'installment' && (
              <p className="text-sm text-muted-foreground">
                {totalDays >= 7 
                  ? `Divided into ${Math.floor(totalDays / 7)} weekly payments`
                  : `Divided into ${totalDays} daily payments`}
              </p>
            )}
          </div>
        </div>
        {paymentMethod && (
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Payment Method</p>
            <p className="text-lg font-semibold">
              {paymentMethod === 'full' ? 'Full Payment' : paymentMethod === 'installment' ? 'Installment Plan' : 'Cash Payment'}
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
      (extras.insurance ? extras.insuranceCost : 0) +
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
              Pay {formatPrice(parseFloat(calculateFullPrice()))} upfront
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
          <div className="my-8 border-t border-gray-200" />
          <div>
            <h3 className="text-xl font-semibold mb-4">Pay in Cash</h3>
            <p className="text-lg mb-4">
              Available for office pickup and drop-off only
            </p>
            <h4 className="font-semibold mb-2">Cash Payment Details:</h4>
            <ul className="list-disc pl-5 mb-4">
              <li>Pay the full amount at the pickup office</li>
              <li>No online payment required</li>
              <li>Must arrive 30 minutes before pickup time</li>
              <li>Valid ID required for verification</li>
            </ul>
            <Button 
              className={`w-fit px-6 py-3 text-lg font-semibold text-white rounded-lg transition-colors shadow-2xl ${
                showCashOption 
                  ? 'bg-green-600 hover:bg-green-500' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={() => handlePaymentSelection('cash')}
              disabled={!showCashOption}
              title={!showCashOption ? "Both pickup and drop-off must be at office locations" : undefined}
            >
              Select Cash Payment
            </Button>
            {!showCashOption && (
              <p className="text-sm text-muted-foreground mt-2">
                * Both pickup and drop-off must be at office locations to enable cash payment
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Update the formatPrice function
  const formatPrice = (amount: number) => {
    if (!amount) return '';
    if (currency === 'TRY') {
      return `₺${(amount * 34).toFixed(2)}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  // Add these new handlers
  const handlePickupLocationSelect = (lat: number, lng: number) => {
    // Convert coordinates to address using reverse geocoding
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(response => response.json())
      .then(data => {
        const address = data.display_name;
        setPickupLocation(address);
        setShowPickupMap(false);
      })
      .catch(error => console.error('Error:', error));
  };

  const handleDropoffLocationSelect = (lat: number, lng: number) => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(response => response.json())
      .then(data => {
        const address = data.display_name;
        setDropoffLocation(address);
        setShowDropoffMap(false);
      })
      .catch(error => console.error('Error:', error));
  };

  // Add insurance type options
  const insuranceOptions = {
    basic: { price: 10, coverage: 'Basic coverage for accidents and theft' },
    premium: { price: 20, coverage: 'Premium coverage including natural disasters and third-party damage' },
    comprehensive: { price: 30, coverage: 'Full coverage with zero deductible and roadside assistance' }
  };

  // Add this function to your handlers
  const handleOfficeSelect = (office: OfficeLocation) => {
    setPickupLocation(office.address);
    setShowOfficeOptions(false);
  };

  const handleDropoffOfficeSelect = (office: OfficeLocation) => {
    setDropoffLocation(office.address);
    setShowDropoffOptions(false);
  };

  return (
    <>
      <Navi/>

      <Separator />

      <div className="w-full max-w-6xl mx-auto px-2 md:px-6 py-12 md:py-16">
        {currentBooking && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Current Booking Alert</AlertTitle>
            <AlertDescription>
              You have an existing booking from {currentBooking.startDate} to {currentBooking.endDate}.
              Please select dates that don&apos;t overlap with this booking.
            </AlertDescription>
          </Alert>
        )}
        {dateError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Date Selection Error</AlertTitle>
            <AlertDescription>{dateError}</AlertDescription>
          </Alert>
        )}
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
                      <div className="relative">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input 
                              id="pickup" 
                              placeholder="Enter location or select office" 
                              className="mt-1 w-full bg-card rounded-lg shadow-lg relative pr-10"
                              value={pickupLocation}
                              onChange={(e) => setPickupLocation(e.target.value)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-1/2 -translate-y-1/2"
                              onClick={() => setShowOfficeOptions(!showOfficeOptions)}
                            >
                              <ChevronDown className={`h-4 w-4 transition-transform ${showOfficeOptions ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="mt-1"
                            onClick={() => setShowPickupMap(!showPickupMap)}
                          >
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>

                        {showOfficeOptions && (
                          <Card className="absolute z-10 w-full mt-1 shadow-lg bg-background">
                            <CardContent className="p-2">
                              {officeLocations.map((office) => (
                                <Button
                                  key={office.name}
                                  variant="ghost"
                                  className="w-full justify-start text-left hover:bg-slate-100 p-2 rounded-md"
                                  onClick={() => handleOfficeSelect(office)}
                                >
                                  <div>
                                    <p className="font-semibold">{office.name}</p>
                                    <p className="text-sm text-muted-foreground">{office.address}</p>
                                  </div>
                                </Button>
                              ))}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                      {showPickupMap && (
                        <div className="mt-2">
                          <MapComponent onLocationSelect={handlePickupLocationSelect} />
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="dropoff">Drop-off Location</Label>
                      <div className="relative">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input 
                              id="dropoff" 
                              placeholder="Enter location or select office" 
                              className="mt-1 w-full bg-card rounded-lg shadow-lg relative pr-10 "
                              value={dropoffLocation}
                              onChange={(e) => setDropoffLocation(e.target.value)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-1/2 -translate-y-1/2"
                              onClick={() => setShowDropoffOptions(!showDropoffOptions)}
                            >
                              <ChevronDown className={`h-4 w-4 transition-transform ${showDropoffOptions ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="mt-1"
                            onClick={() => setShowDropoffMap(!showDropoffMap)}
                          >
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>

                        {showDropoffOptions && (
                          <Card className="absolute z-10 w-full mt-1 shadow-lg bg-background">
                            <CardContent className="p-2">
                              {officeLocations.map((office) => (
                                <Button
                                  key={office.name}
                                  variant="ghost"
                                  className="w-full justify-start text-left hover:bg-slate-100 p-2 rounded-md"
                                  onClick={() => handleDropoffOfficeSelect(office)}
                                >
                                  <div>
                                    <p className="font-semibold">{office.name}</p>
                                    <p className="text-sm text-muted-foreground">{office.address}</p>
                                  </div>
                                </Button>
                              ))}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                      {showDropoffMap && (
                        <div className="mt-2">
                          <MapComponent onLocationSelect={handleDropoffLocationSelect} />
                        </div>
                      )}
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
                    <Accordion type="single" collapsible>
                      <AccordionItem value="insurance" className="border-none">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">Insurance</h3>
                                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </div>
                              <p className="text-muted-foreground">Protect your rental with our comprehensive coverage.</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">${extras.insuranceCost}/day</p>
                              <div onClick={(e) => e.stopPropagation()}>
                                <Checkbox 
                                  checked={extras.insurance}
                                  onCheckedChange={() => handleExtraChange('insurance')}
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-4">
                            <Select
                              value={insuranceType}
                              onValueChange={handleInsuranceTypeChange}
                              disabled={!extras.insurance}
                            >
                              <SelectTrigger className="w-full bg-background">
                                <SelectValue placeholder="Select insurance type" />
                              </SelectTrigger>
                              <SelectContent className="bg-background">
                                <SelectItem value="basic">Basic Insurance (${insuranceOptions.basic.price}/day)</SelectItem>
                                <SelectItem value="premium">Premium Insurance (${insuranceOptions.premium.price}/day)</SelectItem>
                                <SelectItem value="comprehensive">Comprehensive Insurance (${insuranceOptions.comprehensive.price}/day)</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="mt-2 text-sm text-muted-foreground">
                              {insuranceOptions[insuranceType as keyof typeof insuranceOptions].coverage}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
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



