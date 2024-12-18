// Define the Car interface based on the properties used in Carinfo
export interface Car {
  _id: string;
  model: string;
  maker: string;
  trim: string;
  pictures: string[];
  registrationNumber: string;
  lastMaintenanceDate: string;
  available: boolean;
  year: number;
  disabled: boolean;
  pricePerDay: number;
  averageRating: number;
  golden: boolean;
}

export interface Specifications {
  engineType: string;
  engineCylinders: string;
  engineHorsepower: string;
  fuelType: string;
  transmission: string;
  drive: string;
  doors: string;
}
