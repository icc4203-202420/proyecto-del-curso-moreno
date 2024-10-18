import React, { useState } from 'react';
import axios from 'axios';

const UploadEventPicture = ({ eventId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('event_picture[image]', selectedFile);

    try {
      await axios.post(`http://localhost:3001/api/v1/events/${eventId}/event_pictures`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadStatus('Failed to upload image');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Picture</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default UploadEventPicture;
