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

export function Carinfo() {
  const router = useRouter();
  // Ensure registrationNumber is a string before using it
  const registrationNumber = typeof router.query.id === 'string' ? router.query.id : '';

  // Fetch car details using the registration number
  const car = useQuery(api.car.getCar, { registrationNumber }) as Car; // Assert type to Car | undefined

  if (!car) {
    return <div>Loading...</div>; // Show loading state while fetching
  }

  const handleBooking = () => {
    // Pass car details as query parameters
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

  return (
    <>
      <Navi />
      <Separator />
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <main className="container max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 items-start">
            {/* Left side - Car details and booking */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl font-bold tracking-tight">
                  {car.model || "Lorem ipsum"}
                </h1>
                <p className="text-muted-foreground text-2xl mt-2">
                  {car.maker || "Lorem ipsum"}
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">Pricing</h2>
                <p className="mt-4 text-muted-foreground text-xl">
                  Starting at <span className="text-foreground font-semibold">${car.pricePerDay}</span>
                </p>
              </div>

              <div className="mt-8">
                <button 
                  onClick={handleBooking} 
                  className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl"
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Right side - Car image */}
            <div className="grid gap-2">
              <img
                src={car.pictures[0] || ""}
                alt={`Exterior view of the ${car.model || "Lorem ipsum"}`}
                width={1500}
                height={800}
                className="rounded-lg object-cover w-full"
                style={{ aspectRatio: "16/10", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Specifications card below */}
          <div className="mt-12 rounded-lg p-8 bg-white shadow-md">
            <Specifications maker={car.maker} model={car.model} year={car.year} trim={car.trim} />
          </div>

          <div className="mt-12 space-y-8">
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
          </div>
        </main>
      </div>
      <Separator />
      <Footer />
    </>
  );
}
