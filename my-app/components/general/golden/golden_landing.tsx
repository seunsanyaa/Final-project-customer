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

export function Golden_Landing() {
  const [ref1, inView1] = useInView({ threshold: 0.6, triggerOnce: true });
  const [ref2, inView2] = useInView({ threshold: 0.6, triggerOnce: true });
  const [ref3, inView3] = useInView({ threshold: 0.6, triggerOnce: true });
  const [ref4, inView4] = useInView({ threshold: 0.6, triggerOnce: true });
  const [refPremium, inViewPremium] = useInView({ threshold: 0.6, triggerOnce: true });

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
                      <Button className="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors hover:bg-primary/90">
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
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
                <img
                  src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1732911061/desktop-wallpaper-2021-rolls-rolls-royce-2021-removebg_hbwbio.png"
                  alt="Rolls Royce"
                  width={900}
                  height={500}
                  className="w-full md:w-[60%] h-auto max-h-[500px] object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer/>
    </div>
  );
}






















































{/* <section ref={ref2} className={`w-full py-12 md:py-24 lg:py-32 bg-background/10 ${
  inView2 ? 'animate-fadeInUp' : 'opacity-0'
}`}>
  <div className="container px-4 md:px-6">
    <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
      <div className="space-y-4">
        <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Exclusive Perks</div>
        <h2
          className="lg:leading-tighter text-3xl font-bold text-primary tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
          Elevate Your Rental Experience
        </h2>
        <ul className="space-y-2 text-primary">
          <li className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-primary" />
            Priority vehicle selection
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-primary" />
            Complimentary upgrades
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-primary" />
            Dedicated concierge service
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-primary" />
            Exclusive member events
          </li>
        </ul>
      </div>
      <div className="flex flex-col items-start space-y-4">
        <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Premium Vehicles</div>
        <p
          className="mx-auto max-w-[700px] text-primary md:text-xl/relaxed">
          Experience the ultimate in luxury and performance with our exclusive fleet of premium vehicles,
          including the latest models from top brands.
        </p>
        <Link
          href="#"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          prefetch={false}>
          View Our Fleet
        </Link>
      </div>
    </div>
  </div>
</section>
<section ref={ref3} className={`w-full py-12 md:py-24 lg:py-32 bg-background/10 ${
  inView3 ? 'animate-fadeInUp' : 'opacity-0'
}`}>
  <div className="container px-4 md:px-6">
    <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
      <div className="space-y-4">
        <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Personalized Service</div>
        <h2
          className="lg:leading-tighter text-3xl font-bold tracking-tighter text-primary sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
          Your Rental, Your Way
        </h2>
        <ul className="space-y-2 text-primary">
          <li className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-primary" />
            Dedicated account manager
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-primary" />
            Customized rental packages
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-primary" />
            Flexible booking and return
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-primary" />
            Seamless 24/7 support
          </li>
        </ul>
      </div>
      <div className="flex flex-col items-start space-y-4">
        <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Luxury Lifestyle</div>
        <p
          className="mx-auto max-w-[700px] text-primary md:text-xl/relaxed">
          Indulge in the finer things in life with our Golden Membership. From exclusive events to personalized
          concierge services, we cater to your every need.
        </p>
        <Link
          href="#"
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          prefetch={false}>
          Learn More
        </Link>
      </div>
    </div>
  </div>
</section>
<section
   ref={ref4}
   className={`w-full py-12 md:py-24 lg:py-32 bg-background/10 ${
     inView4 ? 'animate-fadeInUp' : 'opacity-0'
   }`}>
  <div className="container px-4 md:px-6">
    <div
      className="grid items-center justify-center gap-4 px-4 text-center md:px-6">
      <div className="space-y-3">
        <h2
          className="text-3xl font-bold tracking-tighter text-primary md:text-4xl/tight">
          Elevate Your Rental Experience
        </h2>
        <p
          className="mx-auto max-w-[600px] text-primary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Join our Golden Membership and unlock a world of exclusive perks, premium vehicles, and personalized
          service.
        </p>
      </div>
      <div className="mx-auto w-full max-w-sm space-y-2">
        <Link href='/Golden/subscribe'>
          <Button className="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            Sign Up Now
          </Button>
        </Link>
        <p className="text-xs text-primary">
          Membership is subject to approval.{" "}
          <Link href="#" className="underline underline-offset-2" prefetch={false}>
            Terms &amp; Conditions
          </Link>
        </p>
      </div>
    </div>
  </div>
</section>
<section ref={refPremium} className={`w-full py-12 bg-gradient-to-b from-gray-200 to-white ${
  inViewPremium ? 'animate-fadeInUp' : 'opacity-0'
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
{/* <section ref={ref3} className={`w-full py-12 bg-white ${
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
        // <CarouselItem>
        //   <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
        //     <div className="space-y-4 md:space-y-6 lg:space-y-8">
        //       <CardHeader>
        //         <CardTitle className="text-2xl font-bold text-center">Chauffeur Services and Travel kits</CardTitle>
        //       </CardHeader>
        //       <CardContent>
        //         <img
        //           src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729522582/chauffeur-service.jpg"
        //           alt="Chauffeur Service"
        //           className="w-full h-48 object-cover rounded-lg mb-4"
        //         />
        //         <p className="text-gray-600">
        //           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        //         </p>
        //         <Link href="/PremiumServices">
        //           <Button className="bg-customyello text-primary-foreground border-2 border-black p-4 shadow-md hover:bg-orange-500 transition">
        //             Discover Now
        //           </Button>
        //         </Link>
        //       </CardContent>
        //     </div>
        //   </div>
        // </CarouselItem>

        {/* Anniversary Rewards */}
        // <CarouselItem>
        //   <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
        //     <div className="space-y-4 md:space-y-6 lg:space-y-8">
        //       <CardHeader>
        //         <CardTitle className="text-2xl font-bold text-center">Premium Rewards</CardTitle>
        //       </CardHeader>
        //       <CardContent>
        //         <img
        //           src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729522582/anniversary-rewards.jpg"
        //           alt="Anniversary Rewards"
        //           className="w-full h-48 object-cover rounded-lg mb-4"
        //         />
        //         <p className="text-gray-600">
        //           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
        //         </p>
        //         <Link href="/PremiumServices">
        //           <Button className="bg-customyello text-primary-foreground border-2 border-black p-4 shadow-md hover:bg-orange-500 transition">
        //             Discover Now
        //           </Button>
        //         </Link>
        //       </CardContent>
        //     </div>
        //   </div>
        // </CarouselItem>

        {/* Subscription Plans */}
  //       <CarouselItem>
  //         <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
  //           <div className="space-y-4 md:space-y-6 lg:space-y-8">
  //             <CardHeader>
  //               <CardTitle className="text-2xl font-bold text-center">Subscription Plans</CardTitle>
  //             </CardHeader>
  //             <CardContent>
  //               <img
  //                 src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729522582/subscription-plans.jpg"
  //                 alt="Subscription Plans"
  //                 className="w-full h-48 object-cover rounded-lg mb-4"
  //               />
  //               <p className="text-gray-600">
  //                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse.
  //               </p>
  //               <Link href="/PremiumServices">
  //                 <Button className="bg-customyello text-primary-foreground border-2 border-black p-4 shadow-md hover:bg-orange-500 transition">
  //                   Discover Now
  //                 </Button>
  //               </Link>
  //             </CardContent>
  //           </div>
  //         </div>
  //       </CarouselItem>
  //     </CarouselContent>
  //   </Carousel>
  // </div>
// </section> 
