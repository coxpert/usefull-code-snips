import React from 'react';
import { Box } from '@mui/material';
import { ReactElement, useState, useRef, useEffect } from 'react';
import { TabTitleItem } from './TabTitleItem';

export const Tabs = ({ children }) => {
  const tabsRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        overflow: 'hidden',
        '*': {
          zIndex: 2,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          p: '4px',
          borderRadius: 100,
          backgroundColor: 'background.tab',
          display: 'flex',
          width: 'fit-content',
        }}
      >
        {children.map((tab, index) => (
          <TabTitleItem
            onClick={() => setActiveTab(index)}
            title={tab.props.title}
            key={index}
            isActive={index === activeTab}
            position={index}
          />
        ))}
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            height: 'calc(100% - 8px)',
            width: `calc((100% - 8px) / ${children.length})`,
            backgroundColor: 'background.tabActive',
            zIndex: 1,
            borderRadius: 100,
            transition: '0.25s ease-out',
          }}
          className="glider"
        />
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            transition: 'transform 0.25s',
            transform: `translateX(-${(100 / children.length) * activeTab}%)`,
            width: `${children.length * 100}%`,
          }}
        >
          {children.map((item, index) => (
            <Box sx={{ display: 'flex', width: '100%', py: 4 }} key={index.toString()}>
              {item}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
