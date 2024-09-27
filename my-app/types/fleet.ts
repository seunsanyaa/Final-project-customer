export type Fleet = {

  name: string; 
  model: string;
  carCount: number; // Number of cars in the fleet
  averageMileage: number; // Average mileage of the cars
  fuelType: 'petrol' | 'diesel' | 'electric'; // Type of fuel used (e.g., petrol, diesel, electric)
};
