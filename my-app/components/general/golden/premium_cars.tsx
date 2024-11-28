'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useInView } from 'react-intersection-observer';
import { Navi } from "../head/navi"
import { Footer } from "../head/footer"

export function PremiumCars() {
  const [ref1, inView1] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <div className="flex flex-col min-h-dvh font-roboto">
      <Navi className="bg-gradient-to-r from-gray-800 to-gray-600"/>
      <main className="flex-1">
        {/* Header Section */}
        <div className="text-center w-full mx-auto pt-20 pb-10">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent drop-shadow-xl font-poppins">
            Premium Collection
          </h1>
          <p className="text-gray-600 text-xl mt-4">
            Experience luxury and performance with our exclusive premium vehicle selection
          </p>
        </div>

        {/* Premium Cars Grid - Using the same design as homepage */}
        <section ref={ref1} className={`relative w-full h-auto overflow-hidden bg-gradient-to-b from-gray-200 to-white ${
          inView1 ? 'animate-fadeInUp' : "opacity-0"}`}>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mt-10 pl-14 pr-14 ml-14 mr-14 mb-20">
            {/* Premium Car 1 */}
            <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
              <img src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729527582/2022-genesis-g80-4wd-sedan-white_featured_e84fej.avif" alt="Genesis G80" className="w-[300px] h-[220px] rounded-lg" />
              <div className="text-center mb-0 mt-0">
                <h3 className="text-4xl font-semibold text-black">Genesis G80</h3>
                <p className="text-black font-semibold">Luxury redefined.</p>
                <p className="text-black">$200/day</p>
              </div>
              <Link href="/Search">
                <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted">Rent Now</Button>
              </Link>
            </div>

            {/* Premium Car 2 */}
            <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
              <img src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729522582/2020-ford-mustang-ecoboost-premium-convertible-white_featured_c4qsq5.avif" alt="Mustang" className="w-[300px] h-[220px] rounded-lg" />
              <div className="text-center mb-0 mt-0">
                <h3 className="text-4xl font-semibold text-black">Mustang</h3>
                <p className="text-black font-semibold">Pure performance.</p>
                <p className="text-black">$300/day</p>
              </div>
              <Link href="/Search">
                <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted">Rent Now</Button>
              </Link>
            </div>

            {/* Premium Car 3 */}
            <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
              <img src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729527063/2022-ram-1500-limited-swb-crew-pick-up-silver_featured_x2xwqj.avif" alt="RAM 1500" className="w-[300px] h-[220px] rounded-lg" />
              <div className="text-center mb-0 mt-0">
                <h3 className="text-4xl font-semibold text-black">RAM 1500</h3>
                <p className="text-black font-semibold">Power meets luxury.</p>
                <p className="text-black">$250/day</p>
              </div>
              <Link href="/Search">
                <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted">Rent Now</Button>
              </Link>
            </div>

            {/* Premium Car 4 */}
            <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
              <img src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729522583/2022-chevrolet-tahoe-lt-4wd-suv-beige_featured_bsxp0g.avif" alt="Chevrolet Tahoe" className="w-[300px] h-[220px] rounded-lg" />
              <div className="text-center mb-0 mt-0">
                <h3 className="text-4xl font-semibold text-black">Tahoe</h3>
                <p className="text-black font-semibold">Ultimate SUV experience.</p>
                <p className="text-black">$280/day</p>
              </div>
              <Link href="/Search">
                <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted">Rent Now</Button>
              </Link>
            </div>

            {/* Premium Car 5 */}
            <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
              <img src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729522582/2021-toyota-camry-se-sedan-white_featured_yakvxp.avif" alt="Toyota Camry" className="w-[300px] h-[220px] rounded-lg" />
              <div className="text-center mb-0 mt-0">
                <h3 className="text-4xl font-semibold text-black">Camry</h3>
                <p className="text-black font-semibold">Elegant reliability.</p>
                <p className="text-black">$180/day</p>
              </div>
              <Link href="/Search">
                <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted">Rent Now</Button>
              </Link>
            </div>

            {/* Premium Car 6 */}
            <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
              <img src="https://res.cloudinary.com/dihvudxbt/image/upload/v1729200173/JKAR_22_Compact_Cargo_Van_AngularFront_US_ENG_280x210_wsqbrx.avif" alt="Luxury Van" className="w-[300px] h-[220px] rounded-lg" />
              <div className="text-center mb-0 mt-0">
                <h3 className="text-4xl font-semibold text-black">Luxury Van</h3>
                <p className="text-black font-semibold">Group travel in style.</p>
                <p className="text-black">$220/day</p>
              </div>
              <Link href="/Search">
                <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted">Rent Now</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
