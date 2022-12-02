/** @jsx jsx */
import { jsx, SerializedStyles, css } from '@emotion/react';
import theme from '../../styles/theme';

interface Props {
  color?: string;
  extraCss?: SerializedStyles | SerializedStyles[];
}

export default function StackoverflowIcon({ color = theme.colors.primary, extraCss }: Props) {
  return (
    <svg css={[styles.icon].concat(extraCss!)} viewBox="0 0 512 512">
      <path fill="#ffffff" stroke="#ffffff" d="M293 89l90 120zm-53 50l115 97zm-41 65l136 64zm-23 69l148 31zm-6 68h150zm-45-44v105h241V297" />
    </svg>
  );
}

const styles = {
  icon: css`
    width: 24px;
    height: 24px;
    pointer-events: none;
  `
};
