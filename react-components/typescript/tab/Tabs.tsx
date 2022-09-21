/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactElement, useState } from 'react';
import theme from '../../styles/theme';

type Props = {
  title?: string;
  activeTab?: number;
  children: ReactElement[];
};

export const Tabs: React.FC<Props> = ({ children, title, activeTab = 0 }) => {
  const [activeIndex, setActiveIndex] = useState<number>(activeTab);

  return (
    <div css={styles}>
      {title && <h3>{title}</h3>}
      <ul data-acitive="50px">
        {children.map((item, index) => (
          <div
            className="tab-header-item"
            key={index.toString()}
            data-active={activeIndex === index}
            onClick={() => {
              setActiveIndex(index);
            }}
          >
            <strong>{item.props.title}</strong>
          </div>
        ))}
        <div className="active-indicator" style={{ transform: `translateX(${80 * activeIndex}px)` }} />
      </ul>
      <div
        className="tab-content"
        style={{
          transform: `translateX(-${(100 / children.length) * activeIndex}%)`,
          width: `${children.length * 100}%`
        }}
      >
        {children.map((item, index) => (
          <div className="w-100" key={index.toString()}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = css`
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  --tab-width: 80px;

  ul {
    display: flex;
    flex-direction: row;
    padding: 0;
    width: 100%;
    border-bottom: ${theme.styles.border};
    position: relative;

    .active-indicator {
      position: absolute;
      width: var(--tab-width);
      height: 2px;
      background-color: ${theme.colors.primary};
      bottom: -1px;
      transition: transform 0.3s;
    }

    .tab-header-item {
      width: var(--tab-width);
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding-bottom: 8px;
      cursor: pointer;

      &:hover {
        background-color: #00000012;

        &[data-active='true'] {
          background-color: ${theme.colors.primary}12;
        }
      }
    }

    li {
      list-style: none;
    }
  }

  .tab-content {
    display: flex;
    transition: transform 0.45s;
  }
`;
