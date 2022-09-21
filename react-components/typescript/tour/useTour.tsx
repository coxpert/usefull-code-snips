import React, { useEffect, useRef, useState } from 'react';
import { useScreen } from '../../utils/hooks';
import theme from '../../styles/theme';
import ReactDOM from 'react-dom';
import { TOUR_HEIGHT, TOUR_WIDTH, TourCard } from './TourCard';

export interface TourItem {
  title: string;
  description: string;
  highlight?: string;
  position?: 'top left' | 'top right' | 'bottom left' | 'bottom right' | 'top center' | 'bottom center';
}

interface TourType {
  start: () => void;
}

export function useTour(tours: TourItem[]): TourType {
  const toursContainerRef = useRef<HTMLDivElement>();
  const { width, height } = useScreen();
  const [step, setStep] = useState<number>(-1);

  useEffect(() => {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'tour-container-main';
    toastContainer.style.cssText = `
        z-index: 10002; 
        position: fixed; 
        width: 100%;
        top: 0;
        left: 0;
        transform: translateX(${width / 2 - TOUR_WIDTH / 2}px) translateY(${height / 2 - TOUR_HEIGHT}px);
        transition: transform .2s ${theme.styles.transitionEasing};
      `;
    toursContainerRef.current = toastContainer;
    document.body.appendChild(toastContainer);
    return () => {
      toursContainerRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (toursContainerRef.current) {
      // remove class from the previously highlighted element
      document.querySelectorAll('.tour-highlight').forEach((item) => {
        item.classList.remove('tour-highlight');
      });
      let top = height / 2 - TOUR_HEIGHT + 'px';
      let left = width / 2 - TOUR_WIDTH / 2 + 'px';
      // add effect to the highlight element
      if (tours[step]?.highlight) {
        const highlight = document.querySelectorAll(tours[step].highlight!);
        highlight.forEach((el) => {
          const item = el as HTMLElement;
          item.classList.add('tour-highlight');
        });

        // Scroll to the element
        const firstElement = highlight[0];
        firstElement.scrollIntoView({ block: 'center' });

        // adjust position
        const position = tours[step].position || 'bottom left';
        const x = position.split(' ')[0];
        const y = position.split(' ')[1];

        const rect = firstElement.getBoundingClientRect();

        if (x === 'top') {
          top = `calc(${rect.top - 5}px - 100%)`;
        } else {
          top = rect.bottom + 5 + 'px';
        }

        if (y === 'left') {
          const adjustment = Math.min(width - (rect.left + TOUR_WIDTH), 0);
          left = rect.left + adjustment + 'px';
        } else if (y === 'right') {
          const adjustment = Math.min(rect.right - TOUR_WIDTH, 0);
          left = rect.right - TOUR_WIDTH + adjustment + 'px';
        } else {
          left = rect.left - TOUR_WIDTH / 2 + rect.width / 2 + 'px';
        }
        toursContainerRef.current.style.transform = `translateX(${left}) translateY(${top})`;
      }

      if (step > -1 && step < tours.length) {
        ReactDOM.render(<TourCard info={tours[step]} onNext={handleNext} end={step === tours.length - 1} />, toursContainerRef.current);
      } else {
        ReactDOM.render([], toursContainerRef.current);
      }
    }
  }, [step]);

  const handleNext = (v: number) => {
    switch (v) {
      case 1: {
        setStep(-1);
        return;
      }
      case 2: {
        setStep(step + 1);
        return;
      }
      case 3: {
        setStep(-1);
        return;
      }
    }
  };

  const start = () => {
    setStep(0);
  };

  return {
    start
  };
}
