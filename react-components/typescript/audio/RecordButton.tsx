/** @jsx jsx */
import { jsx } from '@emotion/react';
import { HTMLAttributes } from 'react';
import { css, keyframes } from '@emotion/react';
import theme from '../../styles/theme';
import { RefreshIcon } from '../Icons';

interface RecordButtonProps extends HTMLAttributes<HTMLElement> {
  size?: number;
  recording?: boolean;
  reset?: boolean;
}

export function RecordButton({ size = 40, recording = false, reset = false, ...rest }: RecordButtonProps) {
  const containerStyle = {
    width: size,
    height: size
  };

  return (
    <div css={styles} style={containerStyle} {...rest} data-redording={recording}>
      {reset && !recording ? <RefreshIcon /> : <div />}
    </div>
  );
}

const recordingAnimation = keyframes`
  from {
    transform: scale(0.5);
  }
  to {
    transform: scale(1);
  }
`;

const styles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  border: ${theme};
  cursor: pointer;

  div {
    width: 50%;
    height: 50%;
    background-color: #f74800;
    border-radius: 100%;
  }

  .icon {
    width: 24px;
    height: 24px;
    fill: ${theme.colors.primary};
  }

  &:hover {
    .icon {
      fill: white;
    }
  }

  &:hover {
    background-color: #f74800;

    div {
      background-color: white;
    }
  }

  &[data-redording='true'] {
    animation: ${recordingAnimation} 0.45s infinite alternate ${theme.styles.transitionEasing};
    div {
      border-radius: 2px;
      background-color: transparent;
      border: solid 2px white;
    }
  }

  @keyframes recording {
    from {
      background-color: #ff7030;
    }
    to {
      background-color: #c63a00;
    }
  }
`;
