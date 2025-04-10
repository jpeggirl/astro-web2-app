import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { getZodiacAnimationProps, getZodiacColor } from '../../utils/zodiacUtils';
import { COLORS } from '../../styles/theme';

// Define props interface
interface ZodiacIconProps {
  zodiacSign: string;
  size?: number;
  animated?: boolean;
}

// Combine IconContainer styling with motion.div
const AnimatedIconContainer = styled(motion.div)<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Style the SVG element directly
const StyledSVG = styled.svg<{ iconColor: string }>`
  width: 100%;
  height: 100%;
  color: ${props => props.iconColor}; // Set the color CSS property
`;

/**
 * Maps zodiac sign names to their SVG paths
 * For simplicity, we're using very basic SVG paths here
 * In a production app, you'd use more detailed and professional SVGs
 */
const zodiacPaths: Record<string, string> = {
  'Rat': 'M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm0 2c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm-3 5a1 1 0 110 2 1 1 0 010-2zm6 0a1 1 0 110 2 1 1 0 010-2zm-5.5 3h5a.5.5 0 010 1h-5a.5.5 0 010-1zm-.5 2a4 4 0 013 1.38A3.974 3.974 0 0115 15h.5a.5.5 0 010 1h-9a.5.5 0 010-1H7c1.126 0 2.11-.61 2.647-1.52A3.99 3.99 0 0112 14c.74 0 1.424-.216 2-.583A2.5 2.5 0 0011.5 14z',
  'Ox': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8zm-2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm5 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 12c-2.5 0-4 1.5-4 3h8c0-1.5-1.5-3-4-3z',
  'Tiger': 'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zm-2.5 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm5 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM7.5 14c.828 0 1.5.672 1.5 1.5V17h6v-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5V18a1 1 0 01-1 1H7a1 1 0 01-1-1v-2.5c0-.828.672-1.5 1.5-1.5z',
  'Rabbit': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.5-13A1.5 1.5 0 1010 8.5 1.5 1.5 0 0011.5 7zm3 0A1.5 1.5 0 1013 8.5 1.5 1.5 0 0014.5 7zm-3 8a4.5 4.5 0 01-4.24-3h1.02c.42 1.13 1.52 2 2.72 2h2c1.2 0 2.3-.87 2.72-2h1.02a4.5 4.5 0 01-4.24 3h-1z',
  'Dragon': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-5-8c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm8 0c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm-4 5c2.5 0 4.5-1.5 5-3h-10c.5 1.5 2.5 3 5 3z',
  'Snake': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-5-8a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2zm-9 4h8s-1 4-4 4-4-4-4-4z',
  'Horse': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-4-9a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2zm-4 4c2.21 0 4-1.79 4-4h-8c0 2.21 1.79 4 4 4z',
  'Goat': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-2-9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0 3c0 1.1-.9 2-2 2s-2-.9-2-2h4z',
  'Monkey': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-5-9c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm8 0c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm-4 6c2.5 0 4.5-1.5 5-4h-10c.5 2.5 2.5 4 5 4z',
  'Rooster': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-5-9a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2zm-9 3h8a4 4 0 01-8 0z',
  'Dog': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zM8.5 8a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 14c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5z',
  'Pig': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-4-9a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2zm-4 3a4 4 0 01-4-4h8a4 4 0 01-4 4z'
};

// Default icon path (e.g., a question mark or placeholder)
const defaultIconPath = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z";

/**
 * ZodiacIcon Component
 * Displays an animated icon for a given zodiac sign
 */
const ZodiacIcon: React.FC<ZodiacIconProps> = ({ 
  zodiacSign, 
  size = 64, // Default size
  animated = true 
}) => {
  const color = getZodiacColor(zodiacSign);
  const animationProps = getZodiacAnimationProps(zodiacSign);
  const path = zodiacPaths[zodiacSign] || defaultIconPath; // Use default if sign not found
  
  return (
    <AnimatedIconContainer
      size={size}
      initial={{ scale: 0, opacity: 0 }} // Start scaled down and transparent
      animate={animated ? "pulse" : "visible"}
      variants={{
        visible: { scale: 1, opacity: 1, transition: animationProps.entrance }, // Entrance animation
        pulse: { 
          scale: animationProps.pulse.scale,
          opacity: 1,
          transition: animationProps.pulse.transition
        }
      }}
      whileHover={{ scale: 1.1 }} // Slightly bigger on hover
      whileTap={{ scale: 0.9 }}   // Slightly smaller on tap
    >
      <StyledSVG
        iconColor={color} // Pass color to styled component
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`${zodiacSign} zodiac icon`}
      >
        {/* Apply fill="currentColor" to the path */}
        <path d={path} fill="currentColor" /> 
      </StyledSVG>
    </AnimatedIconContainer>
  );
};

export default ZodiacIcon; 