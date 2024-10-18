import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem, Button, Typography, CircularProgress, Alert } from '@mui/material';

const CheckInPage = () => {
  const { eventId } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/users`);
        console.log('API response:', response); // Debugging: print the entire response
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [eventId]);

  const handleCheckIn = async () => {
    try {
      await axios.post(`http://localhost:3001/api/v1/events/${eventId}/attendances`);
      alert('Checked in successfully!');
    } catch (error) {
      console.error('Error during check-in:', error);
      alert('Failed to check-in. Please try again later.');
    }
  };

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        Check In to Event
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <FormControl fullWidth>
          <InputLabel>User</InputLabel>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {users.length > 0 ? (
              users.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  (@{user.handle})
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No users available</MenuItem>
            )}
          </Select>
          <Button style={{ backgroundColor: '#F59A23', color: '#FFF', marginTop: '16px' }} onClick={handleCheckIn} >
            Check In
          </Button>
        </FormControl>
      )}
    </div>
  );
};

export default CheckInPage;
