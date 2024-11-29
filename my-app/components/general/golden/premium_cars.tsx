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
              <img src="https://res.cloudinary.com/dbsxjsktb/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1732830903/2020-range-rover-sport-1920x565__1_-removebg_f6qehx.png" alt="Range Rover Sport" className="w-[500px] h-[220px] rounded-lg" />
              <div className="text-center mb-0 mt-0">
                <h3 className="text-4xl font-semibold text-black">Range Rover Sport</h3>
                <p className="text-black font-semibold">Luxury redefined.</p>
                <p className="text-black">$200/day</p>
              </div>
              <Link href="/Search">
                <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted">Rent Now</Button>
              </Link>
            </div>

            {/* Premium Car 2 */}
            <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
              <img src="https://res.cloudinary.com/dbsxjsktb/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1732832958/hero-2018-maserati-granturismo-1920x565-removebg-preview_z2nmmg.png" alt="Maserati GranTurismo" className="w-[500px] h-[220px] rounded-lg" />
              <div className="text-center mb-0 mt-0">
                <h3 className="text-4xl font-semibold text-black">Maserati</h3>
                <p className="text-black font-semibold">Pure performance.</p>
                <p className="text-black">$300/day</p>
              </div>
              <Link href="/Search">
                <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted">Rent Now</Button>
              </Link>
            </div>

            {/* Premium Car 3 */}
            <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500" >
              <img src="https://res.cloudinary.com/dbsxjsktb/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1732832958/hero-2019-porsche-boxster-1920x565-removebg_hlhjvr.png" className="w-[500px] h-[220px] rounded-lg" />
              <div className="text-center mb-0 mt-0">
                <h3 className="text-4xl font-semibold text-black">Porsche Boxster</h3>
                <p className="text-black font-semibold">Power meets luxury.</p>
                <p className="text-black">$250/day</p>
              </div>
              <Link href="/Search">
                <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted">Rent Now</Button>
              </Link>
            </div>

            {/* Premium Car 4 */}
            <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
              <img src="https://res.cloudinary.com/dbsxjsktb/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1732831937/MERCEDES-BENZ_S-CLASS_LE_upscale_balanced_x4-removebg-preview_sxsbaa.png" alt="MERCEDES BENZ S_CLASS_LE" className="w-[500px] h-[220px] rounded-lg" />
              <div className="text-center mb-0 mt-0">
                <h3 className="text-4xl font-semibold text-black">MERCEDES BENZ S_CLASS_LE</h3>
                <p className="text-black font-semibold">Ultimate SUV experience.</p>
                <p className="text-black">$280/day</p>
              </div>
              <Link href="/Search">
                <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted">Rent Now</Button>
              </Link>
            </div>

            {/* Premium Car 5 */}
            <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
              <img src="https://res.cloudinary.com/dbsxjsktb/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1732833992/BMW_4_Series_LE_upscale_balanced_x4-removebg-preview_pl3neq.png" alt="BMW 4 Series" className="w-[500px] h-[220px] rounded-lg" />
              <div className="text-center mb-0 mt-0">
                <h3 className="text-4xl font-semibold text-black">BMW 4 Series</h3>
                <p className="text-black font-semibold">Elegant reliability.</p>
                <p className="text-black">$180/day</p>
              </div>
              <Link href="/Search">
                <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted">Rent Now</Button>
              </Link>
            </div>

            {/* Premium Car 6 */}
            <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
              <img src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1732882737/mansory-rolls-royce-3840x2160-16576_aexumc.jpg" alt="Mansory Rolls Royce" className="w-[600px] h-[250px] rounded-lg" />
              <div className="text-center mb-0 mt-0">
                <h3 className="text-4xl font-semibold text-black">Mansory Rolls Royce</h3>
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
