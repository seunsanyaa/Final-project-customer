'use client'
import React from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MapComponent from '@/components/ui/map';
import { Navi } from '../head/navi';

// Configure default Leaflet icon options
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Main Mappage component
export function Mappage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navi />
      <main className="flex-1 bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen h-[calc(100vh-200px)] mx-auto">
          <MapComponent />
        </div>
      </main>
    </div>
  );
}

export default Mappage;
