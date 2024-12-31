import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { AlertCircle } from 'lucide-react';

interface SpecificationsProps {
  registrationNumber: string;
}

const Specifications: React.FC<SpecificationsProps> = ({ registrationNumber }) => {
  const getCarSpecifications = useQuery(api.car.getCarSpecifications, { registrationNumber });

  if (getCarSpecifications === undefined) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!getCarSpecifications) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-4">Specifications</h2>
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="h-5 w-5" />
          <p>No specifications available for this vehicle.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Specifications</h2>
      <ul className="mt-4 space-y-2 text-muted-foreground">
        <li>
          <span className="font-medium">Engine Type:</span> {getCarSpecifications.engineType}
        </li>
        <li>
          <span className="font-medium">Engine Cylinders:</span> {getCarSpecifications.engineCylinders}
        </li>
        <li>
          <span className="font-medium">Engine Max Horsepower:</span> {getCarSpecifications.engineHorsepower}
        </li>
        <li>
          <span className="font-medium">Fuel Type:</span> {getCarSpecifications.fuelType}
        </li>
        <li>
          <span className="font-medium">Transmission Type:</span> {getCarSpecifications.transmission}
        </li>
        <li>
          <span className="font-medium">Drive:</span> {getCarSpecifications.drive}
        </li>
        <li>
          <span className="font-medium">Doors:</span> {getCarSpecifications.doors}
        </li>
        <li>
          <span className="font-medium">Body Type:</span> {getCarSpecifications.bodyType}
        </li>
      </ul>
    </div>
  );
};

export default Specifications;
