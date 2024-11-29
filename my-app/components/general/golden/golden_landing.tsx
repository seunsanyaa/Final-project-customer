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
export function Golden_Landing() {
  const [ref1, inView1] = useInView({ threshold: 0.6, triggerOnce: true });
const [ref2, inView2] = useInView({ threshold: 0.6,triggerOnce: true  });
const [ref3, inView3] = useInView({ threshold: 0.6,triggerOnce: true });
const [ref4, inView4] = useInView({ threshold: 0.6,triggerOnce: true });
  return (
    (<div className="flex flex-col min-h-[100dvh]">
      <Navi/>
      <Separator/>
      <main className="flex-1 " >
        <section
           ref={ref1}
           className={`w-full py-12 md:py-24 lg:py-32 bg-background/10 ${
            inView1 ? 'animate-fadeInUp' : 'opacity-0'
           }`}>
          <div className="container px-4 md:px-6">
            <div
              className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1
                    className="text-3xl font-bold tracking-tighter text-primary sm:text-5xl xl:text-6xl/none">
                    Sign up today and experience luxury
                  </h1>
                  <p className="max-w-[600px] text-primary md:text-xl">
                    Unlock exclusive perks, premium vehicles, and personalized service with our Golden Membership.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href='/Golden/subscribe'>
                    <Button className="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                      Sign Up Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section  ref={ref2}
          className={`w-full py-12 md:py-24 lg:py-32 bg-background/10 ${
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
        <section  ref={ref3}
          className={`w-full py-12 md:py-24 lg:py-32 bg-background/10 ${
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
      </main>
      <Footer/>
    </div>)
  );
}






