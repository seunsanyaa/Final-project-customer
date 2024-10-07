import React from 'react';

// Define the props type for the component
interface ChevronDownIconProps extends React.SVGProps<SVGSVGElement> {
  // Add any additional props here if needed
}

/**
 * ChevronDownIcon component
 * 
 * This component renders a chevron-down icon as an SVG.
 * It accepts all standard SVG props and spreads them onto the svg element.
 */
export default function ChevronDownIcon({ ...props }: ChevronDownIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Path for the chevron-down shape */}
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}