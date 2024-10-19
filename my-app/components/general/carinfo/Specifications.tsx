import React from 'react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Specifications as SpecificationsType } from '@/types/car';

interface SpecificationsProps {
  maker: string;
  model: string;
  year: number;
}

const Specifications: React.FC<SpecificationsProps> = ({ maker, model, year }) => {
  const getCarSpecifications = useAction(api.car.getCarSpecifications);
  const [specifications, setSpecifications] = React.useState<SpecificationsType | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSpecifications = async () => {
      try {
        const specs = await getCarSpecifications({ maker, model, year: year.toString() });
        setSpecifications(specs);
      } catch (err) {
        setError('Failed to fetch specifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecifications();
  }, [maker, model, year, getCarSpecifications]);

  if (loading) return <div>Loading specifications...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!specifications) return <div>No specifications available</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold">Specifications</h2>
      <ul className="mt-4 space-y-2 text-muted-foreground">
        <li>
          <span className="font-medium">Engine Type:</span> {specifications.engineType}
        </li>
        <li>
          <span className="font-medium">Engine Cylinders:</span> {specifications.engineCylinders}
        </li>
        <li>
          <span className="font-medium">Engine Max Horsepower:</span> {specifications.engineHorsepower}
        </li>
        <li>
          <span className="font-medium">Fuel Type:</span> {specifications.fuelType}
        </li>
        <li>
          <span className="font-medium">Transmission Type:</span> {specifications.transmission}
        </li>
        <li>
          <span className="font-medium">Drive:</span> {specifications.drive}
        </li>
        <li>
          <span className="font-medium">Seats:</span> {specifications.seats}
        </li>
      </ul>
    </div>
  );
};

export default Specifications;
