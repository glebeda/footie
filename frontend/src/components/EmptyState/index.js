import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import disappointedSoccerPlayer from '../../assets/images/empty_state.png';
import './EmptyState.css';

const EmptyState = () => {
    return (
        <Container maxWidth='sm' className="container">
          <Typography variant='h4' component='h1' gutterBottom>
            Oi, no match is on the cards just yet
          </Typography>
          <Box className="imageContainer">
            <img src={disappointedSoccerPlayer} alt="Empty State" className="image" />
          </Box>
        </Container>
      );
};

export default EmptyState;