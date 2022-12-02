/** @jsx jsx */
import { jsx, SerializedStyles, css } from '@emotion/react';
import theme from '../../styles/theme';

interface Props {
  color?: string;
  extraCss?: SerializedStyles | SerializedStyles[];
}

export default function StarIcon({ color = theme.colors.primary, extraCss }: Props) {
  return (
    <svg css={[styles.icon].concat(extraCss!)} viewBox="0 0 24 24">
      <path fill={color} d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

const styles = {
  icon: css`
    width: 18px;
    height: 18px;
    pointer-events: none;
  `
};
