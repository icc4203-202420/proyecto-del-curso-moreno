import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, CircularProgress, Alert, Button, List, ListItem } from '@mui/material';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendees, setAttendees] = useState({}); // Object to store attendees for each event

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:3001/api/v1/events'); // Ajusta la URL si es necesario
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCheckIn = async (eventId) => {
    try {
      await axios.post(`http://localhost:3001/api/v1/events/${eventId}/checkin`);
      alert('You have checked in successfully!');
      // Podrías actualizar el estado del evento para reflejar que el usuario ha hecho check-in.
      setEvents(events.map(event => 
        event.id === eventId ? { ...event, checkedIn: true } : event
      ));
    } catch (error) {
      console.error('Error during check-in:', error);
      alert('Failed to check-in. Please try again later.');
    }
  };
  

  const fetchAttendees = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/events/${eventId}/attendees`);
      setAttendees((prevState) => ({
        ...prevState,
        [eventId]: response.data
      }));
    } catch (error) {
      console.error('Error fetching attendees:', error);
      alert('Failed to load attendees. Please try again later.');
    }
  };

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        All Events
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={2}>
          {events.length > 0 ? (
            events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card style={{ backgroundColor: '#A36717' }}>
                  <CardContent>
                    <Typography variant="h6" style={{ color: '#FFF' }}>
                      {event.name}
                    </Typography>
                    <Typography color="textSecondary" style={{ color: '#FFF' }}>
                      Date: {event.date}
                    </Typography>
                    <Typography color="textSecondary" style={{ color: '#FFF' }}>
                      Bar: {event.bar.name}
                    </Typography>
                    <Typography color="textSecondary" style={{ color: '#FFF' }}>
                      Location: {event.location} {/* Suponiendo que 'location' esté en la respuesta del evento */}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => handleCheckIn(event.id)}>
                      Check-in
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => fetchAttendees(event.id)}>
                      Show Attendees
                    </Button>
                    {attendees[event.id] && (
                      <List>
                        {attendees[event.id].map((user) => (
                          <ListItem key={user.id}>{user.name}</ListItem>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" align="center">No events found.</Typography>
          )}
        </Grid>
      )}
    </div>
  );
};

export default Events;
