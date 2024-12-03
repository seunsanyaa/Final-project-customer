"use client"
import React from 'react';
import Link from 'next/link'; 
import Image from 'next/image'; // Import the Image component

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {  Checkbox } from "@/components/ui/checkbox"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Navi } from '../head/navi';
import { Footer } from '../head/footer';
import { Separator } from "@/components/ui/separator";


export function Access1() {
  // Define ref3 and inView3 if they are not defined elsewhere
  const ref3 = React.useRef(null); // Example definition
  const inView3 = true; 

  return (
    <div className="flex flex-col min-h-screen">
      <Navi/>
      <main className="flex-1 bg-background text-foreground py-8 px-6">
        <div className="container mx-auto">
          
          <div className='bg-card rounded-lg shadow-lg p-6 relative overflow-hidden'>
            {/* Hero Section with gradient background and fade-in animation */}
            <section className="flex justify-between items-center mb-8 animate-fadeIn">
              <div className="text-left">
                <p className="text-4xl md:text-4xl lg:text-6xl font-bold">
                  Driving with Confidence, Accessible Rentals for All
                  </p>
                <p className="text-muted-foreground mt-4">
                  Discover Renta&apos;s accessible fleet, designed for comfort and ease. With spacious interiors and advanced features, our wheelchair-accessible vehicles make travel simple and enjoyable for everyone. Let us provide you with a seamless, comfortable journey wherever your destination awaits.
                </p>
              </div>
              <Image
                src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1730212805/Honda_Odyssey4_odbyjm.jpg"
                alt="Honda Odyssey"
                width={700}
                height={500}
                className="object-cover"
              />
            </section>
            <section className="flex justify-between items-center mb-8">
              <Image
                src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1730213376/Honda_Odyssey6_v5nbyg.webp"
                alt="Honda Odyssey"
                width={500}
                height={400}
                className="object-cover"
              />
              <Image
                src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1730213363/Honda_Odyssey5_dnwhd3.jpg"
                alt="Honda Odyssey"
                width={500}
                height={400}
                className="object-cover"
              />
            </section>
          </div>
          
          {/* <hr className="my-8 w-full" /> */}
          <section ref={ref3} className={`relative w-full h-auto overflow-hidden bg-gradient-to-b from-gray-200 to-white ${ 
            inView3 ? 'animate-fadeInUp' : "opacity-0"}`} > 
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight text-center mt-10">Experience Seamless Accessibility with Every Journey</h2> 
            <div className="max-w-full mx-auto h-full"> 
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mt-20 pl-4 pr-4 mb-20"> 
                <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
                  <Image src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1730143352/Chrysler_Pacifica_Touring_L_keo0y6.avif" alt="Sedan" width={300} height={220} className="rounded-lg" />
                  <div className="text-center">
                    <h3 className="text-4xl font-semibold text-black mt-0">Chrysler Pacifica Touring L</h3>
                    <p className="text-black font-semibold">Accessible, Spacious, Family-Friendly</p>
                    <p className="text-black">Starting from $120/day</p>
                  </div>
                  <Link href="/carinfo?id=disi1">
                    <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted">Rent Now</Button>
                  </Link>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
                  <Image src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1730143352/2024_Toyota_Sienna_XLE_Hybrid_hgyrst.avif" alt="SUV" width={300} height={220} className="rounded-lg" />
                  <div className="text-center">
                    <h3 className="text-4xl font-semibold text-black">Toyota Sienna XLE Hybrid</h3>
                    <p className="text-black font-semibold">Hybrid, Comfortable, Efficient</p>
                    <p className="text-black">Starting from $110/day</p>
                  </div>
                  <Link href="/carinfo?id=disi2">
                    <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted">Rent Now</Button>
                  </Link>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
                  <Image src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1730143352/2024_Ford_Explorer_Limited_uwimkr.avif" alt="Luxury" width={300} height={220} className="rounded-lg" />
                  <div className="text-center">
                    <h3 className="text-4xl font-semibold text-black mt-1">Ford Explorer Limited</h3>
                    <p className="text-black font-semibold">Rugged, Spacious, Tech-Savvy</p>
                    <p className="text-black">Starting from $100/day</p>
                  </div>
                  <Link href="/carinfo?id=disi3">
                    <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted">Rent Now</Button>
                  </Link>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
                  <Image src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1730143352/2024_Chevrolet_Traverse_Premier_xnqy7b.avif" alt="Van" width={300} height={220} className="rounded-lg" />
                  <div className="text-center mb-0 mt-0">
                    <h3 className="text-4xl font-semibold text-black">Chevrolet Traverse Premier</h3>
                    <p className="text-black font-semibold mb-0">Roomy, Family-Oriented, Versatile</p>
                    <p className="text-black">Starting from $100/day</p>
                  </div>
                  <Link href="/carinfo?id=disi4">
                    <Button className="hover:bg-blue-500 hover:shadow-lg  hover:bg-muted transition-all duration-300 rounded-lg mt-0">Rent Now</Button>
                  </Link>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
                  <Image src="https://res.cloudinary.com/dihvudxbt/image/upload/v1729200173/JKAR_22_Compact_Cargo_Van_AngularFront_US_ENG_280x210_wsqbrx.avif" alt="Van" width={300} height={220} className="rounded-lg" />
                  <div className="text-center mb-0 mt-0">
                    <h3 className="text-4xl font-semibold text-black">Ford Compact Cargo Van</h3>
                    <p className="text-black font-semibold mb-0">Practical, Efficient, Functional</p>
                    <p className="text-black">Starting from $70/day</p>
                  </div>
                  <Link href="/carinfo?id=disi5">
                    <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg mt-0 hover:bg-muted">Rent Now</Button>
                  </Link>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500">
                  <Image src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1730144513/2024_GMC_Yukon_XL_SLT_ydl8yb.jpg" alt="Van" width={300} height={220} className="rounded-lg" />
                  <div className="text-center mb-0 mt-0">
                    <h3 className="text-4xl font-semibold text-black">GMC Yukon XL SLT</h3>
                    <p className="text-black font-semibold mb-0">Luxurious, Spacious, Strong</p>
                    <p className="text-black">Starting from $150/day</p>
                  </div>
                  <Link href="/carinfo?id=disi6">
                    <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg mt-0 hover:bg-muted">Rent Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Accessibility Information</h2>
            <div className="bg-card rounded-lg shadow-md p-6">
              <p className="text-muted-foreground mb-4">
                At Accessible Rentals, we are committed to providing a seamless and inclusive experience for all our
                customers. Our fleet of vehicles is equipped with a variety of accessibility features, catering to the
                diverse needs of individuals with disabilities.
              </p>
              <p className="text-muted-foreground mb-4">
                Whether you require a wheelchair-accessible van, a car with hand controls, or a vehicle with specialized
                features for the visually or hearing impaired, we have you covered. Our knowledgeable staff is dedicated
                to assisting you in finding the perfect vehicle to meet your needs and ensuring a comfortable and
                stress-free rental experience.
              </p>
              <p className="text-muted-foreground">
                If you have any questions or need additional support, please don&apos;t hesitate to contact our accessibility
                team. We are here to help you every step of the way.
              </p>
            </div>
          </section>

        </div>
      </main>
      <Footer/>
    </div>
  );
}