import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import disappointedSoccerPlayer from '../../assets/images/empty_state.png';
import PageLayout from '../../components/PageLayout';
import './EmptyState.css';

const EmptyState = ({ message = "Oi, no match is on the cards just yet" }) => {
    return (
      <PageLayout>
        <Container maxWidth='sm' className="container">
          <Typography variant='h4' component='h1' gutterBottom>
            {message}
          </Typography>
          <Box className="imageContainer">
            <img src={disappointedSoccerPlayer} alt="Empty State" className="image" />
          </Box>
        </Container>
      </PageLayout>
    );
};

export default EmptyState;