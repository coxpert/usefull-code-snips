import React from 'react';

type Props = {
  title: string;
};

export const Tab: React.FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};
