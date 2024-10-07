import React from 'react';

// Define a type for the props
interface CalendarDaysIconProps extends React.SVGProps<SVGSVGElement> {
  // Add any additional props here if needed
}

export default function CalendarDaysIcon({ ...props }: CalendarDaysIconProps) {
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
      {/* Vertical lines representing the 1st and 15th of the month */}
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      
      {/* Rectangle representing the calendar body */}
      <rect x="3" y="8" width="18" height="14" rx="2" ry="2" />
      
      {/* Lines representing dates on the calendar */}
      <path d="M16 14h-4v4" />
      <path d="M10 10h4v4" />
    </svg>
  );
}