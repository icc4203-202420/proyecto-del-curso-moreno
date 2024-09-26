import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, CircularProgress, Alert, Button, List, ListItem } from '@mui/material';
import Gallery from './Gallery'; // Asegúrate de importar tu componente Gallery

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendees, setAttendees] = useState({});
  const [loadingAttendees, setLoadingAttendees] = useState({});
  const [eventPictures, setEventPictures] = useState({}); // Para almacenar imágenes de eventos
  const navigate = useNavigate();

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
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

  // Handle check-in
  const handleCheckIn = (eventId) => {
    navigate(`/check-in/${eventId}`);
  };

  // Fetch attendees for a specific event
  const fetchAttendees = async (eventId) => {
    setLoadingAttendees((prev) => ({ ...prev, [eventId]: true }));
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/events/${eventId}/attendees`);
      setAttendees((prev) => ({ ...prev, [eventId]: response.data }));
    } catch (error) {
      console.error('Error fetching attendees:', error);
      setError('Failed to load attendees. Please try again later.');
    } finally {
      setLoadingAttendees((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  // Fetch event pictures for a specific event
  const fetchEventPictures = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/events/${eventId}/pictures`); // Cambia la URL según tu API
      setEventPictures((prev) => ({ ...prev, [eventId]: response.data }));
    } catch (error) {
      console.error('Error fetching event pictures:', error);
      setError('Failed to load event pictures. Please try again later.');
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
                      Location: {event.location}
                    </Typography>
                    <Button
                      style={{ backgroundColor: '#F59A23', color: '#FFF', marginTop: '10px' }}
                      onClick={() => handleCheckIn(event.id)}
                    >
                      Check-in
                    </Button>
                    <Button
                      style={{ backgroundColor: '#F59A23', color: '#FFF', marginLeft: '10px', marginTop: '10px' }}
                      onClick={() => fetchAttendees(event.id)}
                      disabled={loadingAttendees[event.id]}
                    >
                      {loadingAttendees[event.id] ? 'Loading Attendees...' : 'Show Attendees'}
                    </Button>
                    <Button
                      style={{ backgroundColor: '#F59A23', color: '#FFF', marginLeft: '10px', marginTop: '10px' }}
                      onClick={() => fetchEventPictures(event.id)} // Botón para cargar fotos
                    >
                      Show Gallery
                    </Button>
                    {attendees[event.id] && (
                      <List>
                        {attendees[event.id].length > 0 ? (
                          attendees[event.id].map((user) => (
                            <ListItem key={user.id}>{user.name}</ListItem>
                          ))
                        ) : (
                          <ListItem>No attendees yet.</ListItem>
                        )}
                      </List>
                    )}
                    {/* Renderizar galería de fotos si existe */}
                    {eventPictures[event.id] && eventPictures[event.id].length > 0 && (
                      <Gallery eventId={event.id} pictures={eventPictures[event.id]} />
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

export default Events;
