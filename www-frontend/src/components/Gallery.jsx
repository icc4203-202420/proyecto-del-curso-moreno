import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, CircularProgress, Alert, Button, TextField } from '@mui/material';

const Gallery = () => {
  const { id } = useParams();
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchEventPictures = async () => {

      try {
        const response = await axios.get(`http://localhost:3001/api/v1/events/${id}/event_pictures`, {});
        setPictures(response.data);
      } catch (error) {
        console.error('Error fetching event pictures:', error);
        setError('Failed to load gallery. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventPictures();
  }, [id]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;

    const userID = localStorage.getItem("user_id");

    const formData = new FormData();
    formData.append('event_picture[image]', selectedFile);
    formData.append('event_picture[description]', description);
    formData.append('user_id', userID); // Agregar el userID al cuerpo del formulario

    try {
      await axios.post(`http://localhost:3001/api/v1/events/${id}/event_pictures`, formData, {});

      // Refresca las fotos después de subir
      const eventsResponse = await axios.get(`http://localhost:3001/api/v1/events/${id}/event_pictures`);
      setPictures(eventsResponse.data);

      // Limpia los campos
      setSelectedFile(null);
      setDescription('');
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  return (
    <div>
      <Grid container justifyContent="center" style={{ marginBottom: '20px' }}>
        <Typography variant="h4">Gallery</Typography>
      </Grid>

      {loading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : error ? (
        <Grid container justifyContent="center">
          <Alert severity="error">{error}</Alert>
        </Grid>
      ) : (
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <Grid container spacing={2}>
              {pictures.length > 0 ? (
                pictures.map((picture) => (
                  <Grid item xs={12} sm={6} md={4} key={picture.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{picture.description}</Typography>
                        <img src={picture.image_url} alt={picture.description} style={{ width: '100%' }} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" align="center">
                    No pictures found.
                  </Typography>
                </Grid>
              )}
            </Grid>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
            />
            <input type="file" onChange={handleFileChange} />
            <Button
              variant="contained"
              color="primary"
              onClick={handlePhotoUpload}
              disabled={!selectedFile || !description}
            >
              Upload Picture
            </Button>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Gallery;
