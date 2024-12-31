import { useRouter } from 'next/router'; // Import useRouter to access URL parameters
import { useQuery } from "convex/react"; // Ensure useQuery is imported
import { api } from "@/convex/_generated/api"; // Import the API
import { Separator } from "@/components/ui/separator";
import PlayIcon from "@/svgs/Playicon";
import EyeIcon from "@/svgs/EyeIcon";
import VolumeIcon from "@/svgs/VolumeIcon";
import { Navi } from "../head/navi";
import { Footer } from '../head/footer';
import { Car } from "@/types/car"; // Import the Car type
import Specifications from './Specifications';
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { StarIcon, AccessibilityIcon, TagIcon, AlertCircle } from "lucide-react"; // Add AlertCircle
import { useUser } from "@clerk/nextjs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Add Alert imports


const useCurrency = () => {
  const [currency, setCurrency] = useState<string>('USD');

  useEffect(() => {
    // Only listen for currency changes, not language
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

export function Carinfo() {
  const currency = useCurrency();
  const { user } = useUser();
  const router = useRouter();
  // Ensure registrationNumber is a string before using it
  const registrationNumber = typeof router.query.id === 'string' ? router.query.id : '';

  // Fetch car details using the registration number
  const car = useQuery(api.car.getCar, { registrationNumber }) as Car; // Assert type to Car | undefined

  // Add this new query to fetch similar cars with enhanced recommendations
  const similarCars = useQuery(api.car.getSimilarCars, { 
    maker: car?.maker,
    model: car?.model,
    excludeId: registrationNumber,
    limit: 3,
    userId: user?.id ?? undefined,
    categories: car?.categories
  });

  // Add this query near your other queries
  const promotions = useQuery(api.promotions.getAllPromotions);

  // Add this new query
  const activeBookingsCount = useQuery(api.analytics.getActiveBookingsCount, { 
    customerId: user?.id ?? '' 
  });

  // Add this helper function
  const getActivePromotion = (car: Car) => {
    if (!promotions) return null;
    return promotions.find(promo => 
      promo.specificTarget.some(target => 
        target === car._id || 
        (car.categories && car.categories.includes(target))
      )
    );
  };

  if (!car) {
    return <div>Loading...</div>; // Show loading state while fetching
  }

  const handleBooking = () => {
    if (activeBookingsCount && activeBookingsCount >= 3) {
      return; // Don't proceed if booking limit reached
    }
    
    router.push({
      pathname: '/Newbooking',
      query: {
        model: car.model,
        maker: car.maker,
        pricePerDay: car.pricePerDay, 
        year: car.year,
        trim: car.trim,
        disabled: car.disabled,
        registrationNumber: car.registrationNumber,
      },
    });
  };

  const formatPrice = (amount: number) => {
    if (!amount) return '';
    const formattedAmount = amount.toFixed(2);
    const exchangeRate = 34; // Consider moving this to a configuration file
    
    switch (currency) {
      case 'TRY':
        return `₺${(amount * exchangeRate).toFixed(2)}`;
      case 'USD':
      default:
        return `$${formattedAmount}`;
    }
  };

  return (
    <>
      <Navi />
      <Separator />
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <main className="container max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          {activeBookingsCount && activeBookingsCount >= 3 && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Booking Limit Reached</AlertTitle>
              <AlertDescription>
                You have reached the maximum limit of 3 active bookings. Please wait for some of your current bookings to end before making a new booking.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-12 md:grid-cols-2 items-start">
            {/* Left side - Car details and booking */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-5xl font-bold tracking-tight">
                    {car.model || "Lorem ipsum"}
                  </h1>
                  {car.disabled && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <AccessibilityIcon className="h-4 w-4" />
                      <span>Accessible</span>
                    </Badge>
                  )}
                  {car.golden && (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-amber-200">
                      <StarIcon className="h-4 w-4 text-amber-600" />
                      <span className="text-amber-600">Premium</span>
                    </Badge>
                  )}
                  {getActivePromotion(car) && (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-white">
                      <TagIcon className="h-4 w-4 text-customyello" />
                      <span className="text-customyello">Promotion</span>
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-2xl mt-2">
                  {car.maker || "Lorem ipsum"}
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">Pricing</h2>
                <p className="mt-4 text-muted-foreground text-xl">
                  {getActivePromotion(car) ? (
                    <>
                      <span className="line-through text-gray-400">
                        {formatPrice(car.pricePerDay)}
                      </span>
                      <span className="ml-2 text-promotion font-semibold">
                        {formatPrice(car.pricePerDay * (1 - getActivePromotion(car)!.promotionValue / 100))}
                      </span>
                      <span className="ml-2 text-sm text-promotion">
                        ({getActivePromotion(car)!.promotionValue}% off)
                      </span>
                    </>
                  ) : (
                    <>
                      Starting at <span className="text-foreground font-semibold">
                        {formatPrice(car.pricePerDay)}
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="mt-8">
                <button 
                  onClick={handleBooking} 
                  className={`px-6 py-3 text-lg font-semibold text-white rounded-lg transition-colors shadow-2xl ${
                    activeBookingsCount !== undefined && activeBookingsCount >= 3
                      ? 'bg-muted cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 hover:bg-muted'
                  }`}
                  disabled={activeBookingsCount !== undefined && activeBookingsCount >= 3}
                >
                  Book Now
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Image
                src={car.pictures[0] || ""}
                alt={`Exterior view of the ${car.model || "Lorem ipsum"}`}
                width={1500}
                height={800}
                className="rounded-lg object-cover w-full"
                style={{ aspectRatio: "16/10", objectFit: "cover" }}
                priority
              />
            </div>
          </div>

          <div className="mt-12 rounded-lg p-8 bg-white shadow-2xl">
            <Specifications registrationNumber={car.registrationNumber} />
          </div>

          <section className="relative w-full h-auto overflow-hidden bg-gradient-to-b from-gray-200 to-white">
            <div className="max-w-full mx-auto h-full">
              <h2 className="text-2xl font-bold mb-6 mx-14 mt-6">Similar Cars</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mx-14 mb-20 relative z-0">
                {(similarCars ?? []).map((similarCar) => (
                  <Card
                    key={similarCar._id}
                    className="relative flex flex-col items-center justify-center p-0 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl bg-card hover:bg-gradient-to-r from-blue-500 to-green-500 border-none hover:z-50"
                    style={{ border: "none" }}
                  >
                    <Image
                      src={similarCar.pictures[0]}
                      alt={`${similarCar.maker} ${similarCar.model}`}
                      width={400}
                      height={200}
                      className="w-[300px] h-[220px] border-none"
                      style={{ border: "none" }}
                    />
                    <CardContent className="p-0 text-center border-none" style={{ border: "none" }}>
                      <h2 className="text-xl font-semibold mb-2">
                        {similarCar.maker} {similarCar.model}
                      </h2>
                      <p className="text-muted-foreground mb-4">Year: {similarCar.year}</p>
                      <Link href={`/carinfo?id=${similarCar.registrationNumber}`}>
                        <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg mt-0 mb-5 hover:bg-muted">
                          Book Now
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
                {(similarCars?.length ?? 0) === 0 && (
                  <p>No similar cars found.</p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
      <Separator />
      <Footer />
    </>
  );
}











{/* <div className="mt-12 space-y-8">
<div>
  <h2 className="text-2xl font-bold">Virtual Tour</h2>
  <p className="mt-2 text-muted-foreground">
    Take a virtual tour of the Acme Roadster to explore the
    exterior, interior, and features in more detail.
  </p>
  <div className="mt-4">
    <button className="inline-flex items-center px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors border hover:bg-muted">
      <PlayIcon className="mr-2" />Start Tour
    </button>
  </div>
</div>

<div>
  <h2 className="text-2xl font-bold">3D Model</h2>
  <p className="mt-2 text-muted-foreground">
    View the Acme Roadster in 3D to examine every angle and detail.
  </p>
  <div className="mt-4">
    <button className="inline-flex items-center px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors border hover:bg-muted">
      <EyeIcon className="mr-2" />
      View 3D Model
    </button>
  </div>
</div>

<div>
  <h2 className="text-2xl font-bold">Audio Description</h2>
  <p className="mt-2 text-muted-foreground">
    Listen to an audio description of the Acme Roadster, covering
    all key aspects of the car's design, features, and performance.
  </p>
  <div className="mt-4">
    <button className="inline-flex items-center px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors border hover:bg-muted">
      <VolumeIcon className="mr-2" />
      Play Audio
    </button>
  </div>
</div>
</div> */}