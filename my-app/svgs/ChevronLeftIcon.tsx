import React from 'react';

// Define the props interface for better type safety
interface ChevronLeftIconProps extends React.SVGProps<SVGSVGElement> {
  // Add any additional props here if needed
}

/**
 * ChevronLeftIcon component
 * 
 * This component renders a chevron left icon as an SVG.
 * It accepts all standard SVG props and spreads them onto the svg element.
 * 
 * @param props - SVG props
 * @returns React component
 */
export default function ChevronLeftIcon({ ...props }: ChevronLeftIconProps) {
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
      {/* Path for the chevron left shape */}
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
