import React from 'react';
import { Box } from '@mui/material';
import FadeIn from './FadeIn';

interface StaggeredListProps {
  children: React.ReactNode | React.ReactNode[];
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  delay = 100,
  direction = 'up',
}) => {
  // 確保 children 是陣列
  const childrenArray = Array.isArray(children) ? children : [children];
  
  // 如果只有一個子元素且它是 React 元素，直接渲染
  if (childrenArray.length === 1 && React.isValidElement(childrenArray[0])) {
    return (
      <FadeIn
        delay={0}
        direction={direction}
        duration={600}
      >
        {childrenArray[0]}
      </FadeIn>
    );
  }
  
  return (
    <Box>
      {childrenArray.map((child, index) => (
        <FadeIn
          key={index}
          delay={index * delay}
          direction={direction}
          duration={600}
        >
          {child}
        </FadeIn>
      ))}
    </Box>
  );
};

export default StaggeredList;

