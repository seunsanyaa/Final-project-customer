import { useRouter } from 'next/router'; // Import useRouter to access URL parameters
import { useQuery } from "convex/react"; // Ensure useQuery is imported
import { api } from "@/convex/_generated/api"; // Import the API
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import PlayIcon from "@/svgs/Playicon";
import EyeIcon from "@/svgs/EyeIcon";
import VolumeIcon from "@/svgs/VolumeIcon";
import { Navi } from "../head/navi";
import { Footer } from '../head/footer';
import { Car } from "@/types/car"; // Import the Car type

export function Carinfo() {
  const router = useRouter();
  // Ensure registrationNumber is a string before using it
  const registrationNumber = typeof router.query.id === 'string' ? router.query.id : '';

  // Fetch car details using the registration number
  const car = useQuery(api.car.getCar, { registrationNumber }) as Car; // Assert type to Car | undefined

  if (!car) {
    return <div>Loading...</div>; // Show loading state while fetching
  }

  return (
    <>
      <Navi />
      <Separator />
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <main className="container max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 items-start border-2 rounded-md p-4"> {/* Added padding for margin effect */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-center">
                {car.model || "Lorem ipsum"} {/* Display model or placeholder */}
              </h1>
              <p className="text-muted-foreground text-lg text-center">
                {car.maker || "Lorem ipsum"} {/* Display maker or placeholder */}
              </p>
              <div className="grid gap-4 mt-8">
                <img
                  src={car.pictures[0] || ""} // Use first picture or placeholder
                  alt={`Exterior view of the ${car.model || "Lorem ipsum"}`}
                  width={800}
                  height={450}
                  className="rounded-lg object-cover"
                  style={{ aspectRatio: "800/450", objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Specifications</h2>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li>
                    <span className="font-medium">Engine:</span> { "Lorem ipsum"}
                  </li>
                  <li>
                    <span className="font-medium">Transmission:</span> {"Lorem ipsum"}
                  </li>
                  <li>
                    <span className="font-medium">Horsepower:</span> { "Lorem ipsum"}
                  </li>
                  <li>
                    <span className="font-medium">Torque:</span> { "Lorem ipsum"}
                  </li>
                  <li>
                    <span className="font-medium">0-60 mph:</span> { "Lorem ipsum"}
                  </li>
                  <li>
                    <span className="font-medium">Top Speed:</span> { "Lorem ipsum"}
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold">Features</h2>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li>Leather seats with heating and cooling</li>
                  <li>Premium audio system with 12 speakers</li>
                  <li>Adaptive cruise control</li>
                  <li>Lane-keeping assist</li>
                  <li>Panoramic sunroof</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold">Pricing</h2>
                <p className="mt-4 text-muted-foreground text-lg">
                  Starting at <span className="text-foreground">$70,000</span>
                </p>
              </div>

              <div className="mt-8">
                <Link href="/Newbooking">
              <button className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors border hover:bg-muted">
                Book Now
              </button></Link>
              </div>
            </div>
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
