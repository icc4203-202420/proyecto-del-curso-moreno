import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to BeerApp!
      </Typography>

    </Container>
  );
}

export default Home;
