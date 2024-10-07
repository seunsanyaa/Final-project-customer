import { Carinfo } from "@/components/general/carinfo/carinfo";

// Define the Carinfopage component as the default export
export default function Carinfopage() {
  // Render the Carinfo component
  return (
    <div className="car-info-page">
      <h1>Car Information</h1>
      <Carinfo />
    </div>
  );
}