/**
 * Represents a fleet of vehicles with common characteristics.
 */
export type Fleet = {
  /** Unique identifier or name of the fleet */
  name: string;

  /** The vehicle model common to this fleet */
  model: string;

  /** Total number of vehicles in the fleet */
  carCount: number;

  /** Average mileage across all vehicles in the fleet (in miles or kilometers) */
  averageMileage: number;

  /** Primary fuel type used by vehicles in this fleet */
  fuelType: FuelType;
};

/**
 * Possible fuel types for vehicles in a fleet.
 */
type FuelType = 'petrol' | 'diesel' | 'electric';
