"use client"
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Navi } from '../head/navi';
import { Footer } from '../head/footer';
import Image from "next/image";

export function PremiumServices() {
  const ref3 = React.useRef(null);
  const inView3 = true;

  return (
    <div className="flex flex-col min-h-screen">
      <Navi/>
      <main className="flex-1 bg-background text-foreground py-8 px-6">
        <div className="container mx-auto">
          
          {/* Chauffeur and Travel Kit Section */}
          <div className='bg-card rounded-lg shadow-lg p-6 relative overflow-hidden mb-8'>
            <section className="flex justify-between items-center mb-8 animate-fadeIn">
              <div className="text-left">
                <p className="text-4xl md:text-4xl lg:text-6xl font-bold">
                  Premium Travel Experience with Personal Chauffeur
                </p>
                <p className="text-muted-foreground mt-4">
                  Elevate your journey with our premium chauffeur service and exclusive travel kit. Our professional drivers ensure a luxurious and stress-free experience, while our curated travel kit provides all the essentials for your comfort. Each premium booking includes:
                </p>
                <ul className="list-disc list-inside mt-4 text-muted-foreground">
                  <li>Professional, uniformed chauffeur</li>
                  <li>Luxury travel kit with premium amenities</li>
                  <li>24/7 concierge service</li>
                  <li>Priority vehicle preparation and delivery</li>
                </ul>
              </div>
              <Image
                src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1730212805/chauffeur_service.jpg"
                alt="Chauffeur Service"
                width={500}
                height={400}
                className="w-[500px] h-[400px] object-cover rounded-lg"
                priority
              />
            </section>
          </div>

          {/* Premium Rewards Section */}
          <section ref={ref3} className={`relative w-full h-auto overflow-hidden bg-gradient-to-b from-gray-200 to-white mb-8 p-6 rounded-lg shadow-lg ${
            inView3 ? 'animate-fadeInUp' : "opacity-0"}`}>
            <div className="flex justify-between items-center">
              <Image
                src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1730212805/rewards_program.jpg"
                alt="Rewards Program"
                width={500}
                height={400}
                className="w-[500px] h-[400px] object-cover rounded-lg"
              />
              <div className="text-right ml-8">
                <h2 className="text-4xl md:text-4xl lg:text-6xl font-bold">Exclusive Premium Rewards</h2>
                <p className="text-muted-foreground mt-4">
                  Join our elite rewards program and enjoy exclusive benefits:
                </p>
                <ul className="list-disc list-inside mt-4 text-muted-foreground">
                  <li>Earn 2x points on every rental</li>
                  <li>Complimentary upgrades when available</li>
                  <li>Priority pick-up and drop-off</li>
                  <li>Exclusive access to luxury vehicle collection</li>
                  <li>Birthday rewards and special offers</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Premium Subscription Plans */}
          <section className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-4xl font-bold text-center mb-8">Premium Subscription Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Silver Plan */}
              <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
                <h3 className="text-3xl font-semibold text-black">Silver Elite</h3>
                <p className="text-2xl font-bold text-black">$199/month</p>
                <ul className="text-black text-center mb-4">
                  <li>2 Premium rentals per month</li>
                  <li>Basic chauffeur service</li>
                  <li>Standard travel kit</li>
                  <li>10% reward points bonus</li>
                </ul>
                <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg">Subscribe Now</Button>
              </div>

              {/* Gold Plan */}
              <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
                <h3 className="text-3xl font-semibold text-black">Gold Elite</h3>
                <p className="text-2xl font-bold text-black">$399/month</p>
                <ul className="text-black text-center mb-4">
                  <li>4 Premium rentals per month</li>
                  <li>Priority chauffeur service</li>
                  <li>Luxury travel kit</li>
                  <li>25% reward points bonus</li>
                </ul>
                <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg">Subscribe Now</Button>
              </div>

              {/* Platinum Plan */}
              <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
                <h3 className="text-3xl font-semibold text-black">Platinum Elite</h3>
                <p className="text-2xl font-bold text-black">$799/month</p>
                <ul className="text-black text-center mb-4">
                  <li>Unlimited Premium rentals</li>
                  <li>24/7 dedicated chauffeur</li>
                  <li>Premium travel kit + extras</li>
                  <li>50% reward points bonus</li>
                </ul>
                <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg">Subscribe Now</Button>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer/>
    </div>
  );
}
