'use client';

import React from "react";
import Link from "next/link";
import { useInView } from 'react-intersection-observer';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Goldimage from '@/components/ui/GOLD_desk.png';
import { Navi } from "../head/navi";
import CheckIcon from '@/svgs/CheckIcon';
import { Footer } from '../head/footer';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<<<<<<< Updated upstream
export function Golden_Landing() {
=======
export function GoldenLanding() {
>>>>>>> Stashed changes
  const [ref1, inView1] = useInView({ threshold: 0.0, triggerOnce: true });
  const [ref2, inView2] = useInView({ threshold: 0.0, triggerOnce: true });
  const [ref3, inView3] = useInView({ threshold: 0.0, triggerOnce: true });
  const [ref4, inView4] = useInView({ threshold: 0.0, triggerOnce: true });
<<<<<<< Updated upstream
  const [refPremium, inViewPremium] = useInView({ threshold: 0.0, triggerOnce: true });
=======
  const [refPremium, inViewPremium] = useInView({ threshold: 0.6, triggerOnce: true });
>>>>>>> Stashed changes

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navi/>
      <Separator/>
      <main className="flex-1">
        {/* Hero Section */}
        <section
          ref={ref1}
          className={`w-full py-12 md:py-24 lg:py-32 bg-background/10 ${
            inView1 ? 'animate-fadeInUp' : 'opacity-0'
          }`}>
          <div className="container px-4 md:px-6 mx-auto max-w-8xl">
            <div className='bg-card rounded-lg shadow-2xl p-6'>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <div className="text-center max-w-[1000px]">
                  <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold">
                    Subscribe today and experience luxury
                  </h1>
                  <p className="text-muted-foreground mt-4">
                    Unlock exclusive perks, premium vehicles, and personalized service with our Golden Membership.
                  </p>
                  <div className="mt-6">
                    <Link href='/Golden/subscribe'>
                      <Button className="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors hover:bg-customyello hover:text-black">
                        Subscribe Now
                      </Button>
                    </Link>
                  </div>
                </div>
                <img
                  src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1732882737/mansory-rolls-royce-ghost-2021-white-background-2021-5k-8k-4480x2520-6204_tqdabr.jpg"
                  alt="Luxury Car"
                  className="w-full md:w-[700px] h-[500px] md:h-[400px] object-cover rounded-lg"
                />
              </div>
              
              {/* Image Gallery */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-2">
                <img
                  src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1732911061/desktop-wallpaper-2021-rolls-rolls-royce-2021-removebg_hbwbio.png"
                  alt="Rolls Royce"
                  width={1500}
                  height={500}
                  className="w-full md:w-[80%] h-auto max-h-[500px] object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>
        <section ref={refPremium} className={`w-full py-12 bg-gradient-to-b from-gray-200 to-white ${
  inViewPremium ? 'animate-fadeInUp' : 'opacity-0'
}`}>

  <div className="container mx-auto px-4">
    <div className="text-center mb-12 p-4">
        <h2 className="text-4xl font-bold mb-4">Premium Fleet</h2>
        <p className="text-xl text-gray-600">Experience luxury with our exclusive collection</p>
    </div>
    <Carousel>
      <CarouselContent>
        <CarouselItem>
          <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
            <div className="space-y-4 md:space-y-6 lg:space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Luxury Sedan Collection</h1>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-600">
                Experience unmatched comfort with our premium sedan fleet. Exclusive access for Gold members.
              </p>
              <Link href="/PremiumCars">
                <Button className="bg-customyello text-primary-foreground border-2 border-black p-4 shadow-md hover:bg-orange-500 transition">
                  Learn More
                </Button>
              </Link>
            </div>
            <img
              src="https://res.cloudinary.com/dbsxjsktb/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1732832958/hero-2019-porsche-boxster-1920x565-removebg_hlhjvr.png"
              alt="Luxury Sedan"
              className="w-[800px] h-[400px] object-cover"
            />
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
            <div className="space-y-4 md:space-y-6 lg:space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Premium SUV Range</h1>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-600">
                Discover our collection of high-end SUVs perfect for any occasion.
              </p>
              <Link href="/PremiumCars">
                <Button className="bg-customyello text-primary-foreground border-2 border-black p-4 shadow-md hover:bg-orange-500 transition">
                  Learn More
                </Button>
              </Link>
            </div>
            <img
              src="https://res.cloudinary.com/dbsxjsktb/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1732830903/2020-range-rover-sport-1920x565__1_-removebg_f6qehx.png"
              alt="Luxury SUV"
              className="w-[800px] h-[400px] object-cover"
            />
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
            <div className="space-y-4 md:space-y-6 lg:space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Sports Car Excellence</h1>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-600">
                Feel the thrill with our exclusive sports car collection.
              </p>
              <Link href="/PremiumCars">
                <Button className="bg-customyello text-primary-foreground border-2 border-black p-4 shadow-md hover:bg-orange-500 transition">
                  Learn More
                </Button>
              </Link>
            </div>
            <img
              src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1732833992/BMW_4_Series_LE_upscale_balanced_x4-removebg-preview_pl3neq.png"
              alt="Sports Car"
              className="w-[800px] h-[400px] object-cover"
            />
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  </div>
</section>

{/* Services Section */}
<section ref={ref3} className={`w-full py-12 bg-white ${
  inView3 ? 'animate-fadeInUp' : 'opacity-0'
}`}>
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold mb-4">Our Services</h2>
      <p className="text-xl text-gray-600">Explore the exclusive services we offer</p>
    </div>
    <Carousel>
      <CarouselContent>
        Chauffeur Services
        <CarouselItem>
          <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
            <div className="space-y-4 md:space-y-6 lg:space-y-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Chauffeur Services and Travel kits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
                  <div className="space-y-4 md:space-y-6 lg:space-y-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Premium SUV Range</h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-600">
                      Experience our chauffeur services and travel kits designed for your utmost convenience.
                    </p>
                    <Link href="/PremiumServices">
                      <Button className="bg-customyello text-primary-foreground border-2 border-black p-4 shadow-md hover:bg-orange-500 transition">
                        Discover Now
                      </Button>
                    </Link>
                  </div>
                  <img
                    src="https://res.cloudinary.com/di8yfpruz/image/upload/v1732981665/CAR-DRIVERS-IN-BANGALORE-1-removebg_xbmvr4.png"
                    alt="Chauffeur Service"
                    className="w-[600px] h-[400px] object-cover"
                  />
                </div>
              </CardContent>
            </div>
          </div>
        </CarouselItem>

        {/* Anniversary Rewards */}
        <CarouselItem>
          <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
            <div className="space-y-4 md:space-y-6 lg:space-y-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Chauffeur Services and Travel kits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
                  <div className="space-y-4 md:space-y-6 lg:space-y-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Premium SUV Range</h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-600">
                      Experience our chauffeur services and travel kits designed for your utmost convenience.
                    </p>
                    <Link href="/PremiumServices">
                      <Button className="bg-customyello text-primary-foreground border-2 border-black p-4 shadow-md hover:bg-orange-500 transition">
                        Discover Now
                      </Button>
                    </Link>
                  </div>
                  <img
                    src="https://res.cloudinary.com/di8yfpruz/image/upload/v1732981665/CAR-DRIVERS-IN-BANGALORE-1-removebg_xbmvr4.png"
                    alt="Chauffeur Service"
                    className="w-[600px] h-[400px] object-cover"
                  />
                </div>
              </CardContent>
            </div>
          </div>
        </CarouselItem>

        {/* Subscription Plans */}
        <CarouselItem>
          <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
            <div className="space-y-4 md:space-y-6 lg:space-y-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Chauffeur Services and Travel kits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
                  <div className="space-y-4 md:space-y-6 lg:space-y-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Premium SUV Range</h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-600">
                      Experience our chauffeur services and travel kits designed for your utmost convenience.
                    </p>
                    <Link href="/PremiumServices">
                      <Button className="bg-customyello text-primary-foreground border-2 border-black p-4 shadow-md hover:bg-orange-500 transition">
                        Discover Now
                      </Button>
                    </Link>
                  </div>
                  <img
                    src="https://res.cloudinary.com/di8yfpruz/image/upload/v1732981665/CAR-DRIVERS-IN-BANGALORE-1-removebg_xbmvr4.png"
                    alt="Chauffeur Service"
                    className="w-[600px] h-[400px] object-cover"
                  />
                </div>
              </CardContent>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  </div>
</section> 
      </main>
      <Footer/>
    </div>
  );
}





































