/** @jsx jsx */
import { jsx } from '@emotion/react';
import { CSSProperties, HTMLAttributes, useEffect, useState } from 'react';
import theme from '../../styles/theme';
import { css } from '@emotion/react';
interface Props extends HTMLAttributes<HTMLElement> {
  color?: string;
  height?: number | string;
  gradient?: boolean;
  width?: number | string;
  duration: number;
  gradientEndColor?: string;
  background?: string;
  playing?: any;
  clearOnEnd?: boolean;
  start?: boolean;
  paused?: boolean;
}
let timer: number | null = null;
export function Process({
  height = 2,
  width = '100%',
  color = theme.colors.primary,
  duration = 5,
  gradient = true,
  gradientEndColor = '#A36DF6',
  background = 'transparent',
  clearOnEnd = true,
  playing = false,
  paused = false
}: Props) {
  const [contentCss, setContentCss] = useState(
    css`
      width: 0;
    `
  );
  const [currentTime] = useState<{ value: number }>({ value: 0 });
  useEffect(() => {
    if (playing) {
      timer = window.setInterval(() => {
        if (currentTime.value < duration) {
          currentTime.value = currentTime.value + 50;
        }
      }, 50);
    } else {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      if (!paused) {
        currentTime.value = 0;
      }
    }
    handlePlay();
    return () => {
      if (timer) {
        clearInterval(timer!);
        timer = null;
      }
    };
  }, [playing]);
  const handlePlay = () => {
    if (playing) {
      if (currentTime.value > 0) {
        continueProcess();
      } else {
        startProcess();
      }
    } else {
      if (paused) {
        pauseProcess();
      } else {
        stopProcess();
      }
    }
  };
  const clear = () => {
    setContentCss(
      css`
        width: 0;
      `
    );
  };
  const stopProcess = () => {
    if (clearOnEnd) {
      clear();
    }
    currentTime.value = 0;
  };
  // continue process from the stopped time
  const continueProcess = () => {
    setContentCss(css`
      width: 100%;
      transition: width ${duration - currentTime.value}ms linear;
    `);
  };
  // Pause process
  const pauseProcess = () => {
    setContentCss(css`
      width: ${(currentTime.value / duration) * 100}%;
    `);
  };
  const startProcess = () => {
    currentTime.value = 0;
    clear();
    continueProcess();
  };
  const ContainerStyle: CSSProperties = {
    height,
    width,
    backgroundColor: background
  };
  const contentStyle: CSSProperties = {
    height: '100%',
    backgroundColor: color
  };
  if (gradient) {
    contentStyle.backgroundImage = `linear-gradient(to right, ${color}, ${gradientEndColor})`;
  }
  return (
    <div style={ContainerStyle}>
      <div css={contentCss} style={contentStyle} />
    </div>
  );
}
