import React from 'react';
import { Box } from '@mui/material';
import { TabTitleItem } from './TabTitleItem';

export const TabRadio = ({ options, value, onChange }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        boxShadow: '0 0 4px 2px #00000012',
        borderRadius: 100,
        overflow: 'hidden',
        '*': {
          zIndex: 2,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          p: '2px',
          backgroundColor: 'white',
          display: 'flex',
          width: 'fit-content',
        }}
      >
        {options.map((item, index) => (
          <TabTitleItem
            onClick={() => {
              onChange(item.value);
            }}
            title={item.label}
            key={index}
            isActive={item.value === value}
            position={index}
          />
        ))}
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            height: 'calc(100% - 4px)',
            width: `calc((100% - 4px) / ${options.length})`,
            backgroundColor: 'black',
            zIndex: 1,
            borderRadius: 100,
            transition: '0.25s ease-out',
          }}
          className="glider"
        />
      </Box>
    </Box>
  );
};
