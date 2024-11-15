import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface SpecificationsProps {
  registrationNumber: string;
}

const Specifications: React.FC<SpecificationsProps> = ({ registrationNumber }) => {
  const getCarSpecifications = useQuery(api.car.getCarSpecifications, { registrationNumber });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (getCarSpecifications === undefined) return <div>Loading specifications...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!getCarSpecifications) return <div>No specifications available</div>;

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
