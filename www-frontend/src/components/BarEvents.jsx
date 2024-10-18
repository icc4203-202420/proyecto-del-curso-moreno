import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, CircularProgress, Button, List, ListItem } from '@mui/material';

const BarEvents = () => {
  const { id } = useParams(); // Obtener el id del bar desde la URL
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendees, setAttendees] = useState({}); // Para almacenar asistentes por evento

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/bars/${id}/events`); // Ajustar la URL según tu API
        setEvents(response.data.events || response.data); // Asegúrate de que `response.data.events` es correcto
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [id]);

  const fetchAttendees = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/events/${eventId}/attendees`);
      setAttendees((prevState) => ({
        ...prevState,
        [eventId]: response.data,
      }));
    } catch (error) {
      console.error('Error fetching attendees:', error);
      alert('Failed to load attendees. Please try again later.');
    }
  };  

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        Events for Bar {id}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="body1" color="error">{error}</Typography>
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
                    <Button
                      style={{ backgroundColor: '#F59A23', color: '#FFF' }}
                      onClick={() => fetchAttendees(event.id)}
                    >
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
            <Typography variant="body1" align="center">
              No events found.
            </Typography>
          )}
        </Grid>
      )}
    </div>
  );
};

export default BarEvents;
