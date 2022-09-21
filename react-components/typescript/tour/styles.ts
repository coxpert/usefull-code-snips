import { css, keyframes } from '@emotion/react';
import theme from '../../styles/theme';

const touringAnimation = keyframes`
  0%{
    box-shadow: none;
  }
  25% {
    box-shadow: 0 4px 20px ${theme.colors.primary}78;
  }
  50% {
    box-shadow: 0 4px 20px ${theme.colors.primary}12;
  }
  75% {
    box-shadow: 0 4px 20px ${theme.colors.primary}78;
  }
  100% {
    box-shadow: 0 4px 20px ${theme.colors.primary}12;
  }
`;
export default css`
  .tour-highlight {
    animation: ${touringAnimation} 0.75s forwards ${theme.styles.transitionEasing};
  }
`;
