import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../styles/theme';
import { motion } from 'framer-motion';

// Define the props interface
interface ElementalBalanceChartProps {
  balance: Record<string, number>; // Expects { Wood: 20, Fire: 30, ... }
}

// Define colors for each element
const ELEMENT_COLORS: Record<string, string> = {
  Wood: '#4CAF50',
  Fire: '#FF5722',
  Earth: '#8D6E63',
  Metal: '#9E9E9E',
  Water: '#2196F3',
};

const ChartContainer = styled.div`
  width: 100%;
  margin-bottom: 1.5rem;
`;

const BarContainer = styled.div`
  display: flex;
  width: 100%;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
`;

interface SegmentProps {
  width: number;
  color: string;
  delay: number;
}

const BarSegment = styled(motion.div)<SegmentProps>`
  height: 100%;
  background-color: ${props => props.color};
`;

const LegendContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 0.75rem;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0.25rem 0.5rem;
`;

const LegendColorBox = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background-color: ${props => props.color};
  margin-right: 0.4rem;
  border-radius: 2px;
`;

const LegendText = styled.span`
  font-size: 0.75rem;
  color: ${COLORS.WHITE};
  opacity: 0.8;
`;

const ElementalBalanceChart: React.FC<ElementalBalanceChartProps> = ({ balance }) => {
  // Ensure balance object is valid, default to empty if not
  const validBalance = balance && typeof balance === 'object' ? balance : {};
  
  const elements = Object.keys(ELEMENT_COLORS);

  return (
    <ChartContainer>
      <BarContainer>
        {elements.map((element, index) => {
          const percentage = validBalance[element] || 0;
          return (
            <BarSegment
              key={element}
              color={ELEMENT_COLORS[element]}
              width={percentage} // Store percentage directly
              delay={index * 0.1}
              initial={{ width: '0%' }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              aria-label={`${element} ${percentage}%`}
            />
          );
        })}
      </BarContainer>
      <LegendContainer>
        {elements.map(element => (
          <LegendItem key={element}>
            <LegendColorBox color={ELEMENT_COLORS[element]} />
            <LegendText>{element} ({validBalance[element] || 0}%)</LegendText>
          </LegendItem>
        ))}
      </LegendContainer>
    </ChartContainer>
  );
};

export default ElementalBalanceChart; 