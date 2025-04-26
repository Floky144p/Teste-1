import { motion } from "framer-motion";

interface VikingAxeProps {
  width?: number;
  height?: number;
  isAnimating?: boolean;
  color?: string;
}

export default function VikingAxe({ 
  width = 24, 
  height = 24, 
  isAnimating = false,
  color = "#78716c" 
}: VikingAxeProps) {
  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      animate={isAnimating ? { 
        rotate: [-0, -20, 0],
        x: [0, -5, 0],
      } : {}}
      transition={{ 
        duration: 0.5, 
        ease: "easeInOut",
      }}
    >
      {/* Axe Handle */}
      <rect x="11" y="4" width="2" height="16" fill="#8B4513" />
      
      {/* Axe Head */}
      <path 
        d="M13 8C13 6 15 4 17 4C19 4 21 6 21 8C21 10 19 12 17 12C15 12 13 10 13 8Z" 
        fill={color} 
        stroke="#5D4037"
        strokeWidth="0.5"
      />
      
      {/* Axe Blade */}
      <path 
        d="M17 4L21 8L17 12" 
        fill="none" 
        stroke="#E0E0E0" 
        strokeWidth="1"
      />
      
      {/* Details */}
      <circle cx="16" cy="8" r="1" fill="#5D4037" />
      <line x1="14" y1="6" x2="14" y2="10" stroke="#5D4037" strokeWidth="0.5" />
    </motion.svg>
  );
}
