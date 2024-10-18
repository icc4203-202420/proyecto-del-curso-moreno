import React, { useState } from 'react';
import { Container, TextField, Button, Paper, Typography, List, ListItem } from '@mui/material';
import axios from 'axios';

function SearchUser() {
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState([]);

  const handleInputChange = (event) => {
    setHandle(event.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/users?handle=${handle}`);
      setUserData(response.data);
      setHandle(''); // Limpiar el campo de entrada
    } catch (error) {
      setError('User not found.');
      console.error('Error searching for user:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFriend = async (friendId) => {
    const token = localStorage.getItem('token');
    
    console.log('Token:', token); // Verifica si el token está disponible
  
    try {
      const response = await axios.post(
        `http://localhost:3001/api/v1/users/${friendId}/add_friend`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message); // Notifica al usuario
    } catch (error) {
      console.error('Error adding friend:', error);
      alert('Friend added succesfully.');
    }
  };
  

  return (
    <Container>
      <TextField
        label="Search User Handle"
        variant="outlined"
        fullWidth
        value={handle}
        onChange={handleInputChange}
        sx={{ marginBottom: 4 }}
      />
      <Button variant="contained" color="primary" onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {userData.length > 0 && (
        <Paper elevation={3} sx={{ padding: '16px', marginTop: '20px' }}>
          <Typography variant="h6">Users Found:</Typography>
          <List>
            {userData.map((user) => (
              <ListItem key={user.id} sx={{ marginBottom: '10px' }}>
                <Paper
                  sx={{
                    backgroundColor: '#F59A23',
                    padding: '16px',
                    width: '100%',
                    borderRadius: '8px',
                  }}
                >
                  <Typography variant="body1" color="#fff">
                    {user.first_name} {user.last_name} - @{user.handle} (Age: {user.age})
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      backgroundColor: '#8B4513', // Brown color
                      color: '#fff', // White text
                      marginTop: '8px' 
                    }} 
                    onClick={() => addFriend(user.id)} 
                  >
                    Add Friend
                  </Button>
                </Paper>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
}

export default SearchUser;
