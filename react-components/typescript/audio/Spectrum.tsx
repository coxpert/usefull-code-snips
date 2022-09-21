import React, { HTMLAttributes, useEffect, useState } from 'react';
import AudioPlayer from './AudioPlayer';
import Visualizer from './Visualizer';
import { Recorder } from './Recorder';

export interface SpectrumProps extends HTMLAttributes<HTMLDivElement> {
  audioElem?: HTMLAudioElement;
  backgroundColor?: string;
  strokeColor?: string;
  audioBitsPerSecond?: number;
  mimeType?: string;
  width?: number;
  height?: number;
  record?: boolean;
  variant?: 'default' | 'sine-wave' | 'bar' | 'circle';
  echoCancellation?: boolean;
  autoGainControl?: boolean;
  noiseSuppression?: boolean;
  channelCount?: number;
  onStart?: () => void;
  onStop?: () => void;
  onData?: () => void;
  onSave?: () => void;
  source?: string;
}

export function Spectrum({ record = false, height: canvasHeight, variant, audioElem, source = 'microphone', ...rest }: SpectrumProps) {
  const visualizerCanvasRef = React.createRef<HTMLCanvasElement>();
  const containerRef = React.createRef<HTMLDivElement>();

  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D>();
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    setWidth(containerRef.current?.clientWidth || 0);
    setHeight(containerRef.current?.clientHeight || 0);
    return () => {
      stop();
    };
  }, []);

  useEffect(() => {
    if (visualizerCanvasRef.current && !canvasContext) {
      const canvas = visualizerCanvasRef.current!;
      const canvasCtx = canvas?.getContext('2d');
      setCanvasContext(canvasCtx!);
      visualize(canvas);
    }
  }, [visualizerCanvasRef]);

  useEffect(() => {
    if (record) {
      start();
    } else {
      stop();
    }
  }, [record, source]);

  const start = () => {
    if (source === 'microphone') {
      Recorder.start();
    } else {
      if (audioElem) {
        AudioPlayer.create(audioElem);
      }
    }
  };

  const stop = () => {
    Recorder.stop();
    clear();
    AudioPlayer.disconnect();
  };

  const visualize = (canvas: HTMLCanvasElement) => {
    if (canvas) {
      const visualizeOptions = {
        canvas,
        variant
      };
      const visualizer = new Visualizer(visualizeOptions);
      visualizer.start();
    }
  };

  const clear = () => {
    if (canvasContext) {
      canvasContext.clearRect(0, 0, width, height);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: canvasHeight
      }}
      {...rest}
    >
      {width > 0 && height > 0 && <canvas ref={visualizerCanvasRef} width={width} height={height} />}
    </div>
  );
}
