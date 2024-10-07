import React from 'react';

// Define a more specific props type
interface CaravanIconProps extends React.SVGProps<SVGSVGElement> {
  // Add any additional props here if needed
}

export default function CaravanIcon({ 
  width = "800px", 
  height = "800px", 
  fill = "#000000", 
  ...props 
}: CaravanIconProps) {
  return (
    <svg
      {...props}
      width={width}
      height={height}
      fill={fill}
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 450 450"
      xmlSpace="preserve"
    >
      {/* Main group containing all paths */}
      <g id="XMLID_15_">
        {/* Path for the caravan body and wheels */}
        <path
          id="XMLID_898_"
          d="M383.757,214.898l-44.177-47.332l80.217,0.047V167.5H420v-55c0-30.327-24.673-55-55-55H55
            c-30.327,0-55,24.673-55,55v180c0,29.278,22.997,53.279,51.875,54.905C58.521,373.303,82.06,392.5,110,392.5
            c27.906,0,51.424-19.15,58.102-45h113.797c6.678,25.85,30.195,45,58.102,45c27.906,0,51.424-19.15,58.102-45H445h5v-105
            L383.757,214.898z M340.481,212.5H300v-43.372L340.481,212.5z M140,332.5c0,16.542-13.458,30-30,30s-30-13.458-30-30
            s13.458-30,30-30S140,315.958,140,332.5z M370,332.5c0,16.542-13.458,30-30,30s-30-13.458-30-30s13.458-30,30-30
            S370,315.958,370,332.5z M398.102,317.5c-6.678-25.85-30.195-45-58.102-45c-27.906,0-51.424,19.15-58.102,45H168.102
            c-6.678-25.85-30.195-45-58.102-45c-27.836,0-51.302,19.057-58.047,44.808C39.601,315.799,30,305.254,30,292.5v-180
            c0-13.785,11.215-25,25-25h310c13.785,0,25,11.215,25,25v25h-0.203H225v30h45v75h102l48,20v55H398.102z"
        />
        {/* Path for the caravan window */}
        <path
          id="XMLID_904_"
          d="M84.917,242.5h90v-100h-90V242.5z M114.917,172.5h30v40h-30V172.5z"
        />
      </g>
    </svg>
  );
}