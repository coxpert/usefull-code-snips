/** @jsx jsx */
import { jsx, SerializedStyles, css } from '@emotion/react';
import theme from '../../styles/theme';

interface Props {
  color?: string;
  extraCss?: SerializedStyles | SerializedStyles[];
}

export default function LoadingIcon({ color = theme.colors.primary, extraCss }: Props) {
  return (
    <svg css={[styles.icon].concat(extraCss!)} viewBox="0 0 8 10">
      <rect x="0" y="3" width="2" height="4" fill={color}>
        <animate attributeName="height" attributeType="XML" values="4; 10; 4" begin="0s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML" values="3; 0; 3" begin="0s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="3" y="2.25" width="2" height="5.5" fill={color}>
        <animate attributeName="height" attributeType="XML" values="4; 10; 4" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML" values="3; 0; 3" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="6" y="1.5" width="2" height="7" fill={color}>
        <animate attributeName="height" attributeType="XML" values="4; 10; 4" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML" values="3; 0; 3" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}

const styles = {
  icon: css`
    width: 20px;
    height: 24px;
    pointer-events: none;
  `
};
