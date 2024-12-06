'use client';

import React from "react";
import Link from "next/link";
import { useInView } from 'react-intersection-observer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Navi } from "../head/navi";
import { Footer } from '../head/footer';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export function Goldhome() {
  const [ref1, inView1] = useInView({ threshold: 0.6, triggerOnce: true });
  const [ref2, inView2] = useInView({ threshold: 0.6, triggerOnce: true });
  const [ref3, inView3] = useInView({ threshold: 0.6, triggerOnce: true });

  return (
    <div className="flex flex-col min-h-dvh font-roboto">
      <Navi />
      <Separator />
      <main className="flex-1">
        {/* Hero Section */}
        <section ref={ref1} className={`relative top-0 md:py-16 w-full h-[610px] px-4 md:px-6 lg:px-10 bg-cover bg-center bg-no-repeat ${
          inView1 ? 'animate-fadeInUp' : 'opacity-0'
        }`}
        style={{ 
          backgroundImage: `url(https://res.cloudinary.com/dbsxjsktb/image/upload/v1729108115/luxury-car-background.jpg)`,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="bg-white p-8 rounded-5 shadow-2xl backdrop-blur-md bg-opacity-90" style={{ zIndex: 50 }}>
              <div className="text-center w-full max-w-[600px]">
                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent drop-shadow-xl font-poppins">
                  Experience Luxury with Golden Membership
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                  Unlock exclusive benefits and premium services with our elite membership program
                </p>
                <Link href="/Golden/GoldenHome">
                  <Button className="mt-6 bg-customyello text-primary-foreground border-2 border-black p-4 shadow-md hover:bg-orange-500 transition">
                    Join Now
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>

        {/* Premium Cars Section */}
        <section ref={ref2} className={`w-full py-12 bg-gradient-to-b from-gray-200 to-white ${
          inView2 ? 'animate-fadeInUp' : 'opacity-0'
        }`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
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
                      src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1732829197/1654786523359_qobm40.avif"
                      alt="Luxury Sedan"
                      className="w-[600px] h-[500px] object-cover"
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
                      src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729522582/luxury-car-3.jpg"
                      alt="Sports Car"
                      className="w-[600px] h-[500px] object-cover"
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
                {/* Chauffeur Services */}
                <CarouselItem>
                  <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
                    <div className="space-y-4 md:space-y-6 lg:space-y-8">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Chauffeur Services and Travel kits</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img
                          src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729522582/chauffeur-service.jpg"
                          alt="Chauffeur Service"
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <p className="text-gray-600">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <Link href="/PremiumServices">
                          <Button className="bg-customyello text-primary-foreground border-2 border-black p-4 shadow-md hover:bg-orange-500 transition">
                            Discover Now
                          </Button>
                        </Link>
                      </CardContent>
                    </div>
                  </div>
                </CarouselItem>

                {/* Anniversary Rewards */}
                <CarouselItem>
                  <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
                    <div className="space-y-4 md:space-y-6 lg:space-y-8">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Premium Rewards</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img
                          src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729522582/anniversary-rewards.jpg"
                          alt="Anniversary Rewards"
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <p className="text-gray-600">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                        </p>
                        <Link href="/PremiumServices">
                          <Button className="bg-customyello text-primary-foreground border-2 border-black p-4 shadow-md hover:bg-orange-500 transition">
                            Discover Now
                          </Button>
                        </Link>
                      </CardContent>
                    </div>
                  </div>
                </CarouselItem>

                {/* Subscription Plans */}
                <CarouselItem>
                  <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
                    <div className="space-y-4 md:space-y-6 lg:space-y-8">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Subscription Plans</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img
                          src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729522582/subscription-plans.jpg"
                          alt="Subscription Plans"
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <p className="text-gray-600">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse.
                        </p>
                        <Link href="/PremiumServices">
                          <Button className="bg-customyello text-primary-foreground border-2 border-black p-4 shadow-md hover:bg-orange-500 transition">
                            Discover Now
                          </Button>
                        </Link>
                      </CardContent>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}