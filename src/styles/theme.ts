export const COLORS = {
  BLACK: '#000000',
  NEON_GREEN: '#39FF14',
  NEON_PURPLE: '#B026FF',
  WHITE: '#FFFFFF',
  DARK_GRAY: '#2A2A2A',
  GRAY: '#808080',
  DARK_RED: '#8B0000',
  ELEMENT_WOOD: '#4CAF50',
  ELEMENT_FIRE: '#FF5722',
  ELEMENT_EARTH: '#795548',
  ELEMENT_METAL: '#9E9E9E',
  ELEMENT_WATER: '#2196F3',
};

export const TYPOGRAPHY = {
  HEADLINE: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  SUBHEADLINE: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  BODY: {
    fontSize: '16px',
    fontWeight: 'normal',
  },
  CAPTION: {
    fontSize: '12px',
    fontWeight: 'normal',
  },
  BUTTON: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export const SPACING = {
  TINY: 4,
  SMALL: 8,
  MEDIUM: 16,
  LARGE: 24,
  EXTRA_LARGE: 32,
};

export const SHADOWS = {
  NEON_GREEN: `
    box-shadow: 0px 0px 8px 0px ${COLORS.NEON_GREEN};
  `,
  NEON_PURPLE: `
    box-shadow: 0px 0px 8px 0px ${COLORS.NEON_PURPLE};
  `,
};

export const BREAKPOINTS = {
  MOBILE: '480px',
  TABLET: '768px',
  DESKTOP: '1024px',
};

export const MOBILE_CONTAINER = `
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
  
  @media (min-width: ${BREAKPOINTS.TABLET}) {
    max-width: 480px;
    border-left: 1px solid ${COLORS.GRAY};
    border-right: 1px solid ${COLORS.GRAY};
  }
`;

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  SHADOWS,
  BREAKPOINTS,
  MOBILE_CONTAINER,
}; 