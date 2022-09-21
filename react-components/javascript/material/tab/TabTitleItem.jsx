import React from 'react';
import { Box, Typography } from '@mui/material';

export const TabTitleItem = ({ title, isActive = false, onClick, position }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        boxSizing: 'border-box',
        borderRadius: 100,
        px: 1,
        py: 0,
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        textAlign: 'center',
        color: isActive ? 'white' : 'black',
        flex: 1,
        '& ~ .glider': {
          transform: isActive ? `translateX(${position * 100}%)` : '',
        },
      }}
    >
      <Typography>{title}</Typography>
    </Box>
  );
};
