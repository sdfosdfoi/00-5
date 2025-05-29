import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 30 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      fill="currentColor"
    >
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10" fill="none"/>
      <text
        x="50"
        y="50"
        dominantBaseline="middle"
        textAnchor="middle"
        style={{
          fontSize: '35px',
          fontWeight: 'bold',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        SWR
      </text>
    </svg>
  );
};

export default Logo;