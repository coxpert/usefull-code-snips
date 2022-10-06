/**
 * Main Toaster Component
 */
import React, { useEffect } from 'react';
import './style.scss';

const Toast = props => {
  const { destroy, content, icon, type, duration = 3000 } = props;

  useEffect(() => {
    if (!duration) return;

    const timer = setTimeout(() => {
      destroy();
    }, duration);

    return () => clearTimeout(timer);
  }, [destroy, duration]);

  return (
    <div>
      <div className={`toast-wrapper ${type}`}>
        <div className="toast-body">
          {icon}
          <span className="toast-msg text-sm">{content}</span>
        </div>
      </div>
    </div>
  );
};

const shouldRerender = (prevProps, nextProps) => {
  return prevProps.id === nextProps.id;
};

export default React.memo(Toast, shouldRerender);
