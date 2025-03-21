import React, { useState } from 'react';

function SpaceCard() {
  const [spaceImage, setSpaceImage] = useState('');
  const [error, setError] = useState(null);
  const apiKey = process.env.REACT_APP_NASA_API_KEY;

  const fetchSpaceImage = async () => {
    try {
      if (!apiKey) {
        throw new Error('API Key is missing. Please check your .env file.');
      }

      const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setSpaceImage(data.url);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching space image:', err);
    }
  };

  return (
    <div>
      <button onClick={fetchSpaceImage}>Fetch Space Image</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {spaceImage && <img src={spaceImage} alt="space" />}
    </div>
  );
}

export default SpaceCard;
