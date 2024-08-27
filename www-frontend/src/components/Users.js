import React, { useState } from 'react';
import { Container, TextField, Button } from '@mui/material';

function SearchUser() {
  const [handle, setHandle] = useState('');

  const handleInputChange = (event) => {
    setHandle(event.target.value);
  };

  const handleSearch = () => {
    console.log(`Searching for user with handle: ${handle}`);
  };

  return (
    <Container>
      <TextField
        label="User Search by @"
        variant="outlined"
        fullWidth
        value={handle}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
      >
        Search
      </Button>
    </Container>
  );
}

export default SearchUser;