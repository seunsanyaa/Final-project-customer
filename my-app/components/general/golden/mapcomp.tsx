'use client'
import React from 'react';
import dynamic from 'next/dynamic';
import { Navi } from '../head/navi';

// Dynamically import MapComponent with SSR disabled
const MapComponent = dynamic(
  () => import('@/components/ui/map'),
  { ssr: false } // This ensures the component only loads on the client side
);

export function Mappage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navi/>
      <main className="flex-1 bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen max-h-[1vh] mx-auto grid grid-rows-2 sm:grid-rows-2 gap-6">
          <MapComponent/>
        </div>
      </main>
    </div>
  );
}

export default Mappage;
