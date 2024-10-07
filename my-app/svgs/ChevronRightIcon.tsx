import React from 'react';

interface ChevronRightIconProps extends React.SVGProps<SVGSVGElement> {
  // You can add custom props here if needed
}

/**
 * ChevronRightIcon component
 * 
 * This component renders a chevron right icon as an SVG.
 * It accepts all standard SVG props and spreads them onto the svg element.
 */
export default function ChevronRightIcon({ 
  width = 24, 
  height = 24, 
  ...props 
}: ChevronRightIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
