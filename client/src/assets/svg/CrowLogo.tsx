import { motion } from "framer-motion";

interface CrowLogoProps {
  width?: number;
  height?: number;
  primaryColor?: string;
  secondaryColor?: string;
  eyeColor?: string;
  className?: string;
}

export default function CrowLogo({ 
  width = 24, 
  height = 24, 
  primaryColor = "#00A3FF", 
  secondaryColor = "#8A2BE2",
  eyeColor = "#00A3FF",
  className = ""
}: CrowLogoProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="crowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>
      <g id="Crow-Icon">
        <path d="M327,286c0,0,118-58,125-147c0,0-25-5-46,11c0,0-7-24-41-45c-34-21-79-2-79-2s-45-1-66,25c-21,27-34,65-3,82c0,0-14,4-33,27c-19,22-30,71-30,96c0,25-21,58-12,71c8,13,51,57,73,43c21-14,28-59,27-88c0-29,3-63,15-85c12-23,31-36,31-36c-2,18,25,21,39,48z" 
          fill="url(#crowGradient)" />
        <motion.circle 
          cx="250" 
          cy="190" 
          r="15" 
          fill={eyeColor}
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
      </g>
    </svg>
  );
}
