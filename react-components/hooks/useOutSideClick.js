import { useEffect, useState } from 'react';

export function useOutSideClick(element, callback, always = true) {
  const [isOutSide, setIsOutSide] = useState(true);
  useEffect(() => {
    let elementOpened = 'false';
    function handleClick(event) {
      if (element.current) {
        if (elementOpened !== element.current.dataset.open && !always) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          let target = event.target;
          let outSideClicked = true;
          do {
            if (target === element.current) {
              outSideClicked = false;
              return;
            }
            target = target?.parentNode;
          } while (target);
          if (element.current.dataset.open === 'true') {
            setIsOutSide(outSideClicked);
            callback();
          }
        }
        if (element.current) {
          elementOpened = element.current.dataset.open;
        }
      }
    }

    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);
  }, [always, callback, element]);
  return isOutSide;
}
