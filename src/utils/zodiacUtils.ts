/**
 * Utility functions for zodiac sign calculations and mapping
 */

// Updated zodiac utils

// List of zodiac animals (Chinese zodiac)
export const ZODIAC_ANIMALS = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
];

// Traits for each zodiac sign
export const ZODIAC_TRAITS: Record<string, string> = {
  'Rat': 'clever and ambitious',
  'Ox': 'stubborn tank',
  'Tiger': 'brave and confident',
  'Rabbit': 'gentle and elegant',
  'Dragon': 'chaotic visionary',
  'Snake': 'sneaky legend',
  'Horse': 'energetic and free-spirited',
  'Goat': 'creative and empathetic',
  'Monkey': 'mischievous genius',
  'Rooster': 'observant and hardworking',
  'Dog': 'loyal and honest',
  'Pig': 'generous and easy-going'
};

// Color definitions for each element
export const ELEMENT_COLORS = {
  WOOD: '#4CAF50',
  FIRE: '#FF5722',
  EARTH: '#8D6E63',
  METAL: '#9E9E9E',
  WATER: '#2196F3'
};

/**
 * Get the zodiac sign based on birth year
 * @param birthYear - Year of birth
 * @returns The zodiac sign (animal)
 */
export const getZodiacSign = (birthYear: number): string => {
  const index = (birthYear - 1900) % 12;
  const positiveIndex = index < 0 ? index + 12 : index;
  return ZODIAC_ANIMALS[positiveIndex];
};

/**
 * Get the traits for a given zodiac sign
 * @param zodiacSign - The zodiac sign to get traits for
 * @returns The traits associated with the zodiac sign
 */
export const getZodiacTraits = (zodiacSign: string): string => {
  return ZODIAC_TRAITS[zodiacSign] || 'mysterious';
};

/**
 * Get animation properties for a zodiac sign
 * @param zodiacSign - The zodiac sign to get animation properties for
 * @returns Object containing animation properties
 */
export const getZodiacAnimationProps = (zodiacSign: string) => {
  // Default animation
  const defaultAnimation = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "mirror" as "mirror"
      }
    },
    entrance: {
      type: "spring" as const,
      duration: 0.5
    }
  };

  // Custom animations for specific zodiac signs could be added here
  switch (zodiacSign) {
    case 'Dragon':
      return {
        pulse: {
          scale: [1, 1.1, 1],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "mirror" as "mirror"
          }
        },
        entrance: {
          type: "spring" as const,
          duration: 0.7
        }
      };
    case 'Tiger':
      return {
        pulse: {
          scale: [1, 1.08, 1],
          transition: {
            duration: 1.2,
            repeat: Infinity,
            repeatType: "mirror" as "mirror"
          }
        },
        entrance: {
          type: "spring" as const,
          duration: 0.6
        }
      };
    // Add more custom animations as needed
    default:
      return defaultAnimation;
  }
};

/**
 * Get a color for a zodiac sign
 * @param zodiacSign - The zodiac sign to get a color for
 * @returns A hex color code
 */
export const getZodiacColor = (zodiacSign: string): string => {
  switch (zodiacSign) {
    case 'Rat':
    case 'Ox':
      return ELEMENT_COLORS.WATER;
    case 'Tiger':
    case 'Rabbit':
      return ELEMENT_COLORS.WOOD;
    case 'Dragon':
    case 'Snake':
      return ELEMENT_COLORS.FIRE;
    case 'Horse':
    case 'Goat':
      return ELEMENT_COLORS.EARTH;
    case 'Monkey':
    case 'Rooster':
      return ELEMENT_COLORS.METAL;
    case 'Dog':
    case 'Pig':
      return ELEMENT_COLORS.EARTH;
    default:
      return '#9C27B0'; // Default purple for unknown signs
  }
}; 