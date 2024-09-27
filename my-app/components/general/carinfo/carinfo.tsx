
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import PlayIcon from "@/svgs/Playicon";
import EyeIcon from "@/svgs/EyeIcon";
import VolumeIcon from "@/svgs/VolumeIcon";
import { Navi } from "../head/navi";
import { Footer } from '../head/footer';
export function Carinfo() {
  return (
    <>
    <Navi/>
    <Separator/>
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <main className="container max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                2023 Acme Roadster
              </h1>
              <p className="text-muted-foreground text-lg">
                A thrilling sports car with exceptional performance.
              </p>
              <div className="grid gap-4 mt-8">
                <img
                  src="/placeholder.svg"
                  alt="Exterior view of the Acme Roadster showing the sleek, aerodynamic design and bold red paint color."
                  width={800}
                  height={450}
                  className="rounded-lg object-cover"
                  style={{ aspectRatio: "800/450", objectFit: "cover" }}
                />
                <img
                  src="/placeholder.svg"
                  alt="Interior view of the Acme Roadster showing the luxurious leather seats, digital instrument cluster, and premium audio system."
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
                    <span className="font-medium">Engine:</span> 3.0L Turbo V6
                  </li>
                  <li>
                    <span className="font-medium">Transmission:</span> 7-speed
                    automatic
                  </li>
                  <li>
                  <span className="font-medium">Transmission:</span> 7-speed
                    automatic
                  </li>
                  <li>
                    <span className="font-medium">Horsepower:</span> 400 hp
                  </li>
                  <li>
                    <span className="font-medium">Torque:</span> 350 lb-ft
                  </li>
                  <li>
                    <span className="font-medium">0-60 mph:</span> 3.9 seconds
                  </li>
                  <li>
                    <span className="font-medium">Top Speed:</span> 180 mph
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
              <button className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors border">
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
                <button className="inline-flex items-center px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors border">
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
                <button className="inline-flex items-center px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors border">
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
                <button className="inline-flex items-center px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors border">
                  <VolumeIcon className="mr-2" />
                  Play Audio
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Separator />
      <Footer/>
      
    </>
  );}


