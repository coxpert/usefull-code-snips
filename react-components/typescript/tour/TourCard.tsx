/** @jsx jsx */
import { css, jsx, Global } from '@emotion/react';
import theme from '../../styles/theme';
import Button from '../Button';
import style from './styles';

export const TOUR_WIDTH = 280;
export const TOUR_HEIGHT = 176;

export interface TourProp {
  info: {
    title: string;
    description: string;
  };
  end?: boolean;
  onNext: (v: number) => void;
}

export function TourCard({ info, onNext, end }: TourProp) {
  return (
    <div className="flex-column" css={styles}>
      <Global styles={style} />
      <h4>🎉 {info.title}</h4>
      <p>{info.description}</p>
      {!end ? (
        <div className="flex-row flex-stretch-center button">
          <Button
            large
            className="btn-skip"
            onClick={() => {
              onNext(1);
            }}
          >
            Skip
          </Button>
          <Button
            large
            secondary
            className="btn-next"
            onClick={() => {
              onNext(2);
            }}
          >
            Next
          </Button>
        </div>
      ) : (
        <Button
          className="btn-next"
          full
          secondary
          onClick={() => {
            onNext(3);
          }}
        >
          Done
        </Button>
      )}
    </div>
  );
}

const styles = css`
  width: 100%;
  max-width: ${TOUR_WIDTH}px;
  min-height: ${TOUR_HEIGHT}px;
  bottom: calc(53px + 64px);
  background-color: ${theme.colors.primary};
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  &,
  h4 {
    color: white;
  }

  h4 {
    margin-bottom: 12px;
  }

  p {
    margin-bottom: 16px;
  }

  .button {
    width: 100%;
    gap: 8px;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .btn-next {
    font-weight: 700;
    &:hover {
      border: solid 1px white !important;
    }
  }

  .btn-skip {
    border: 1px solid white;
  }
`;
