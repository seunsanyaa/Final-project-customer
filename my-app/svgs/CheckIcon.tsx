import React from 'react';

// Define the props interface for better type safety
interface CheckIconProps extends React.SVGProps<SVGSVGElement> {
  // Add any additional props here if needed
}

/**
 * CheckIcon component
 * Renders a checkmark icon as an SVG
 * @param props - SVG properties and any additional props
 */
export default function CheckIcon({ ...props }: CheckIconProps) {
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
      {/* Path for the checkmark */}
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}