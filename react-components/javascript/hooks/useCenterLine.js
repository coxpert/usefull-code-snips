import { useRef } from 'react';

const useCenterLine = () => {
  const ref = useRef(null);

  const showVerticalCenterLine = (autoHide = true) => {
    const container = ref.current;
    const lineElement = document.getElementById('mp_design_editor_vertical_center_line');

    if (lineElement) {
      if (autoHide) {
        setTimeout(() => {
          hideVerticalCenterLine();
        }, 800);
      }
      return;
    }

    if (container) {
      container.style.position = 'relative';

      const _lineElement = document.createElement('div');
      _lineElement.setAttribute('id', 'mp_design_editor_vertical_center_line');
      _lineElement.style.position = 'absolute';
      _lineElement.style.height = '100%';
      _lineElement.style.backgroundColor = 'blue';
      _lineElement.style.top = 0;
      _lineElement.style.margin = 'auto';
      _lineElement.style.width = '1px';
      _lineElement.style.left = '50%';
      _lineElement.style.zIndex = '10';

      container.appendChild(_lineElement);

      if (autoHide) {
        setTimeout(() => {
          _lineElement.remove();
        }, 800);
      }
    }
  };

  const hideVerticalCenterLine = () => {
    const centerLine = document.getElementById('mp_design_editor_vertical_center_line');
    if (centerLine) {
      centerLine.remove();
    }
  };

  return {
    ref,
    hideVerticalCenterLine,
    showVerticalCenterLine,
  };
};

export default useCenterLine;
