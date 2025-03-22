import React, { useState } from 'react';
import './spaceCard.css'; // Import CSS for spinner and layout
import BanList from './banList'; // Import the new BanList component

function SpaceCard() {
  const [spaceImage, setSpaceImage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [banList, setBanList] = useState([]);
  const apiKey = import.meta.env.VITE_NASA_API_KEY; // Updated API key import

  const fetchSpaceImage = async () => {
    try {
      if (!apiKey) {
        throw new Error('API Key is missing. Please check your .env file.');
      }

      setLoading(true);
      const sol = Math.floor(Math.random() * 2000); // Random sol number, adjust as needed
      const rover = 'curiosity'; // You can change the rover if needed
      const camera = 'FHAZ'; // Change camera as needed, or make it random
      const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&camera=${camera}&api_key=${apiKey}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.photos || data.photos.length === 0) {
        setError('No photos found for this sol or camera.');
      } else {
        // Filter out photos that match any metadata in the ban list
        const filteredPhotos = data.photos.filter(photo => {
          return !banList.some(banned => {
            return (
              (banned.sol && banned.sol === photo.sol) ||
              (banned.camera && banned.camera === photo.camera.name) ||
              (banned.rover && banned.rover === data.rover.name) ||
              (banned.earth_date && banned.earth_date === photo.earth_date)
            );
          });
        });

        if (filteredPhotos.length === 0) {
          setError('No valid photos found that do not match banned metadata.');
        } else {
          const randomPhoto = filteredPhotos[Math.floor(Math.random() * filteredPhotos.length)];

          setSpaceImage(randomPhoto.img_src);

          setMetadata({
            sol: randomPhoto.sol,
            camera: randomPhoto.camera.name,
            rover: data.rover ? data.rover.name : 'Unknown Rover',
            earth_date: randomPhoto.earth_date
          });

          setError(null);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching space image:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToBanList = (metadataKey, value) => {
    setBanList((prevBanList) => [
      ...prevBanList,
      { [metadataKey]: value }
    ]);
  };

  const removeFromBanList = (metadataKey, value) => {
    setBanList((prevBanList) =>
      prevBanList.filter(item => item[metadataKey] !== value)
    );
  };

  return (
    <div className="container">
      <div className="main-content">
        <button onClick={fetchSpaceImage}>Surprise Me!</button>

        {loading && (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {spaceImage && !loading && (
          <div>
            <img src={spaceImage} alt="Mars Rover" style={{ maxWidth: '50%', marginTop: '10px' }} />
            <div style={{ marginTop: '10px', backgroundColor:'white', display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', padding:'10px', borderRadius:'10px'
            }}>
              <h2>Image Metadata</h2>
              <p>Click on the metadata to add it to the ban list</p>
                <button margin='5px'
                  style={{ cursor: 'pointer', color: 'white' }}
                  onClick={() => addToBanList('sol', metadata?.sol)}
                ><strong>Sol (Martian day):</strong> {metadata?.sol}
                </button>
                <button padding='5px'
                  style={{ cursor: 'pointer', color: 'white' }}
                  onClick={() => addToBanList('camera', metadata?.camera)}
                ><strong>Camera:</strong> {metadata?.camera}
                </button> 
                <button margin='5px'
                  style={{ cursor: 'pointer', color: 'white' }}
                  onClick={() => addToBanList('rover', metadata?.rover)}
                ><strong>Rover:</strong> {metadata?.rover}
                </button> 
                <button margin='5px'
                  style={{ cursor: 'pointer', color: 'white' }}
                  onClick={() => addToBanList('earth_date', metadata?.earth_date)}
                ><strong>Earth Date:</strong> {metadata?.earth_date}
                </button>
            </div>
          </div>
        )}
      </div>

      <BanList banList={banList} removeFromBanList={removeFromBanList} />
    </div>
  );
}

export default SpaceCard;
