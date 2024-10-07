import React from 'react';

// Define props interface for better type safety
interface EyeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export default function EyeIcon({ size = 24, ...props }: EyeIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Eye shape: a curved path representing the outline of an eye */}
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      {/* Pupil: a circle in the center of the eye */}
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}