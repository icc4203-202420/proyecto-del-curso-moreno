import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Grid, IconButton, CircularProgress, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const BarList = () => {
  const [bars, setBars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBars, setFilteredBars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBars = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/api/v1/bars');
        setBars(response.data.bars);
        setFilteredBars(response.data.bars);
      } catch (error) {
        console.error('Error fetching bars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBars();
  }, []);

  const handleSearch = () => {
    const filtered = bars.filter((bar) =>
      bar.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBars(filtered);
  };

  const handleViewDetails = (id) => {
    navigate(`/bar/${id}/events`);
  };

  const handleViewMap = (bar) => {
    // Redirect to the map page and pass bar's latitude and longitude as query parameters
    navigate(`/map?lat=${bar.latitude}&lng=${bar.longitude}`);
  };

  return (
    <div>
      <Grid container justifyContent="center">
        <h2>Bar List</h2>
      </Grid>

      <Grid container justifyContent="center" alignItems="center" style={{ marginBottom: '20px' }}>
        <TextField
          label="Search Bars"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <IconButton onClick={handleSearch}>
          <SearchIcon style={{ color: 'black' }} />
        </IconButton>
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {filteredBars.length > 0 ? (
            filteredBars.map((bar) => (
              <Grid item xs={12} sm={6} md={4} key={bar.id}>
                <Card style={{ backgroundColor: '#A36717' }}>
                  <CardContent>
                    <Typography variant="h6" style={{ color: '#FFF' }}>
                      {bar.name}
                    </Typography>
                    <Typography color="textSecondary" style={{ color: '#FFF' }}>
                      Location: {bar.location}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      style={{ backgroundColor: '#F59A23', color: '#FFF' }}
                      onClick={() => handleViewDetails(bar.id)}
                    >
                      View Events
                    </Button>
                    <Button
                      size="small"
                      style={{ backgroundColor: '#F59A23', color: '#FFF', marginLeft: '10px' }}
                      onClick={() => handleViewMap(bar)}
                    >
                      Visit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <p>No bars found.</p>
          )}
        </Grid>
      )}
    </div>
  );
};

export default BarList;
