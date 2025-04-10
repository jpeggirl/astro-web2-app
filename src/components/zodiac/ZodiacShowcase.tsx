import React from 'react';
import styled from 'styled-components';
import ZodiacIcon from './ZodiacIcon';
import { motion } from 'framer-motion';
import { getZodiacTraits } from '../../utils/zodiacUtils';
import { COLORS } from '../../styles/theme';

// The list of all Chinese zodiac signs
const ZODIAC_SIGNS = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
];

const ShowcaseContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: ${COLORS.WHITE};
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  width: 100%;
`;

const ZodiacCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border-radius: 12px;
  background: rgba(30, 30, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
`;

const ZodiacName = styled.h3`
  font-size: 1.25rem;
  margin: 1rem 0 0.5rem;
  color: ${COLORS.WHITE};
`;

const ZodiacDescription = styled.p`
  font-size: 0.875rem;
  text-align: center;
  color: ${COLORS.WHITE};
  opacity: 0.8;
`;

interface ZodiacShowcaseProps {
  iconSize?: number;
}

export const ZodiacShowcase: React.FC<ZodiacShowcaseProps> = ({ iconSize = 80 }) => {
  return (
    <ShowcaseContainer>
      <Title>Chinese Zodiac Signs</Title>
      <Grid>
        {ZODIAC_SIGNS.map((sign, index) => (
          <ZodiacCard
            key={sign}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <ZodiacIcon zodiacSign={sign} size={iconSize} />
            <ZodiacName>{sign}</ZodiacName>
            <ZodiacDescription>{getZodiacTraits(sign)}</ZodiacDescription>
          </ZodiacCard>
        ))}
      </Grid>
    </ShowcaseContainer>
  );
};

export default ZodiacShowcase; 