import React from 'react';

interface TaskroningLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const TaskroningLogo: React.FC<TaskroningLogoProps> = ({ 
  className = "w-8 h-8", 
  size,
  showText = false
}) => {
  const style = size ? { width: size, height: size } : undefined;
  
  return (
    <div className="inline-flex items-center gap-2.5">
      <svg 
        viewBox="0 0 500 500" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
      >
        <defs>
          <linearGradient id="taskroningLogoGradientV2" x1="10%" y1="90%" x2="90%" y2="10%">
            <stop offset="0%" stopColor="#4AE3B5" />
            <stop offset="30%" stopColor="#36C29D" />
            <stop offset="60%" stopColor="#257288" />
            <stop offset="85%" stopColor="#184564" />
            <stop offset="100%" stopColor="#122E48" />
          </linearGradient>
        </defs>
        {/* Top Square Dot */}
        <rect x="100" y="20" width="100" height="100" rx="3" fill="url(#taskroningLogoGradientV2)" />
        {/* Main Geometric Body with Inner Cavity */}
        <path 
          d="M 100 170 H 400 V 270 H 200 V 390 H 400 V 490 H 100 Z" 
          fill="url(#taskroningLogoGradientV2)" 
        />
      </svg>
      {showText && (
        <span className="font-extrabold tracking-wider text-white uppercase text-sm">
          Taskroning
        </span>
      )}
    </div>
  );
};

