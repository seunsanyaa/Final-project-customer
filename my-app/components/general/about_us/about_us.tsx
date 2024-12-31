'use client'
import { useInView } from 'react-intersection-observer';
import { Navi } from "../head/navi";
import { Footer } from "../head/footer";
import { Card } from "@/components/ui/card";
import { CheckIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';
import Image from "next/image";
import { motion } from 'framer-motion';
const MapComponent = dynamic(
  () => import('@/components/ui/map'),
  { ssr: false }
);

const OfficeLocations: React.FC = () => {
  const officeLocations = [
    { name: "Nicosia Office", lat: 35.190103, lng:33.362347 },
    { name: "Famagusta Office", lat: 35.130542, lng:33.928980 },
    { name: "Girne Office", lat: 35.3364, lng: 33.3199 }
  ];

  return (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg shadow-lg mb-12">
      <MapComponent initialLocations={officeLocations} />
    </div>
  );
};

export function AboutUs() {
  const [ref1, inView1] = useInView({ threshold: 0.0, triggerOnce: true });
  const [ref2, inView2] = useInView({ threshold: 0.0, triggerOnce: true });
  const [ref3, inView3] = useInView({ threshold: 0.0, triggerOnce: true });
  const [ref4, inView4] = useInView({ threshold: 0.0, triggerOnce: true });

  return (
    <div className="flex flex-col min-h-dvh font-inter">
      <Navi className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg"/>
      <main className="flex-1">
        {/* Introduction Section */}
        <section ref={ref1} className={`relative py-20 w-full px-6 lg:px-12 bg-gradient-to-b from-slate-100 to-white ${
          inView1 ? 'animate-fadeInUp' : 'opacity-0'
        }`}>
          <div className="max-w-6xl mx-auto">
            <Card className="w-full mx-auto mt-12 rounded-lg p-8 bg-white shadow-2xl" style={{ border: "none" }}>
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                About Our Journey
              </h1>
              <div className="space-y-6 text-lg text-gray-700">
                <p>
                  Welcome to our innovative car rental platform, where convenience meets reliability. Our journey began with a simple yet powerful vision: to revolutionize the car rental experience by making it more accessible, transparent, and user-friendly than ever before.
                </p>
                <p>
                  Our system is thoughtfully designed to streamline the entire rental process, ensuring seamless interactions and transactions for our valued customers. We&apos;ve created an intuitive platform that not only simplifies the booking process but also provides comprehensive management tools for our team.
                </p>
                <p>
                  What sets us apart is our dedication to both customer satisfaction and operational excellence. Our platform features detailed analytical reporting and management tools, enabling data-driven decisions that continuously improve our service quality.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Accessibility Section */}
        <section ref={ref3} className={`relative py-20 w-full px-6 lg:px-12 bg-gradient-to-b from-white to-slate-100 ${
          inView3 ? 'animate-fadeInUp' : 'opacity-0'
        }`}>
          <div className="max-w-6xl mx-auto">
            <Card className="w-full mx-auto mt-12 rounded-lg p-8 bg-white shadow-2xl" style={{ border: "none" }}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                Accessibility for All
              </h2>
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="space-y-6 text-lg text-slate-700 flex-1">
                  <p>
                    At Renta, we believe that mobility should be accessible to everyone. Our commitment to inclusive service has driven us to develop one of the most comprehensive accessible vehicle fleets in the industry.
                  </p>
                  <p>
                    Our accessible vehicles are thoughtfully equipped with features designed to accommodate various needs, from wheelchair accessibility to specialized controls. We understand that each customer&apos;s requirements are unique, which is why we offer a diverse range of vehicles and customization options.
                  </p>
                  <Link href="/accessibility">
                    <Button className="bg-amber-500 text-white border-amber-600 mt-6 transform transition-all duration-300 hover:scale-105 hover:bg-amber-600 shadow-2xl hover:bg-muted">
                      Explore Accessible Options
                    </Button>
                  </Link>
                </div>
                <div className="flex-1">
                  <Image
                    src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1730212805/Honda_Odyssey4_odbyjm.jpg"
                    alt="Accessible Vehicle"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-xl w-full"
                  />
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Golden Membership Section */}
        <section ref={ref4} className={`relative py-20 w-full px-6 lg:px-12 bg-gradient-to-b from-slate-100 to-white ${
          inView4 ? 'animate-fadeInUp' : 'opacity-0'
        }`}>
          <div className="max-w-6xl mx-auto">
            <Card className="w-full mx-auto mt-12 rounded-lg p-8 bg-white shadow-2xl" style={{ border: "none" }}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                Golden Membership Experience
              </h2>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <Image
                    src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1732902424/44f58625f1b602210bb9915901a4374f_ct4lju-removebg-preview_eevibl.png
                    "
                    alt="Luxury Vehicle"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-xl w-full"
                  />
                </div>
                <div className="space-y-6 text-lg text-gray-700 flex-1">
                  <p>
                    Our Golden Membership program represents the pinnacle of luxury car rental services. We created this exclusive tier to provide discerning customers with an unparalleled rental experience, combining premium vehicles with personalized service.
                  </p>
                  <p>
                    Members enjoy priority access to our luxury fleet, dedicated concierge service, and exclusive events. From seamless bookings to customized experiences, every aspect is designed to exceed expectations.
                  </p>
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg shadow-sm">
                      <CheckIcon className="h-5 w-5 text-blue-600" />
                      <span className="text-slate-700">Priority Selection</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg shadow-sm">
                      <CheckIcon className="h-5 w-5 text-blue-600" />
                      <span className="text-slate-700">Concierge Service</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg shadow-sm">
                      <CheckIcon className="h-5 w-5 text-blue-600" />
                      <span className="text-slate-700">Exclusive Events</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg shadow-sm">
                      <CheckIcon className="h-5 w-5 text-blue-600" />
                      <span className="text-slate-700">Premium Fleet</span>
                    </div>
                  </div>
                  <Link href="/Golden/GoldenHome">
                    <Button className="bg-amber-500 text-white border-amber-600 mt-6 transform transition-all duration-300 hover:scale-105 hover:bg-amber-600 shadow-2xl hover:bg-muted">
                      Discover Gold Benefits
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Office Locations Section */}
        <section ref={ref2} className={`relative py-20 w-full px-6 lg:px-12 bg-white ${
          inView2 ? 'animate-fadeInUp' : 'opacity-0'
        }`}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Our Locations
            </h2>
            <p className="text-center text-slate-600 mb-12 text-lg">
              Find us at any of our convenient locations across the country
            </p>
            
            <div className="w-full h-[500px] rounded-xl shadow-xl overflow-hidden mb-12">
              <OfficeLocations />
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {['Nicosia', 'Famagusta', 'Girne'].map((city) => (
                <Card key={city} className="w-full mx-auto mt-12 rounded-lg p-8 bg-white shadow-xl" style={{ border: "none" }}>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">{city} Office</h3>
                  <p className="text-slate-600">
                    {city === 'Nicosia' && 'Ataturk Cd'}
                    {city === 'Famagusta' && 'Esrif bitlis Cd'}
                    {city === 'Girne' && 'Ecevit Cd'}
                    <br/>{city}, CY
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
}
