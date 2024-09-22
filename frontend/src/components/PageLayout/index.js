import React from 'react';
import { Container } from '@mui/material';
import './PageLayout.css';

const PageLayout = ({ children }) => {
  return (
    <Container maxWidth='sm' className='page-container'>
      {children}
    </Container>
  );
};

export default PageLayout;
