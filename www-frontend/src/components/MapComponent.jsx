import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const MapComponent = () => {
  const mapRef = useRef(null);
  const markerCluster = useRef(null);
  const [bars, setBars] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const inputNodeRef = useRef(null); // Reference for the search input field
  const mapInstance = useRef(null); // Reference for the map instance

  // Fetch bars data from backend
  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/bars`);
        const data = await response.json();

        if (data && Array.isArray(data.bars)) {
          setBars(data.bars);
        } else {
          console.error('Data is not in the expected format:', data);
        }
      } catch (error) {
        console.error('Error fetching bars data:', error);
      }
    };

    fetchBars();
  }, []);

  // Get user location
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getUserLocation();
  }, []);

  // Initialize and update the map
  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
      version: 'weekly',
    });

    loader.importLibrary('maps').then((lib) => {
      const { Map } = lib;
      const map = new Map(mapRef.current, {
        mapId: 'DEMO_MAP_ID',
        zoom: 8,
      });

      mapInstance.current = map; // Save the map instance to the ref

      if (markerCluster.current) {
        markerCluster.current.clearMarkers();
      }

      loader.importLibrary('marker').then((lib) => {
        const { AdvancedMarkerElement, PinElement } = lib;

        const markers = bars.map((bar) => {
          const pin = new PinElement();
          pin.glyph = bar.name;
          pin.background = "#ffaa00";

          const position = { lat: bar.latitude, lng: bar.longitude };
          const marker = new AdvancedMarkerElement({
            position,
            content: pin.element,
          });

          marker.addListener('click', () => {
            window.location.href = `/bars/${bar.id}/events`;
          });

          return marker;
        });

        markerCluster.current = new MarkerClusterer({ map, markers });
      });

      if (userLocation) {
        map.panTo(userLocation);
        map.setZoom(12);
      } else {
        map.panTo({ lat: -34.397, lng: 150.644 });
      }
    });
  }, [bars, userLocation]);

  // Search function
  const handleSearch = (e) => {
    if (e.key !== 'Enter') {
      return;
    }
    const search = inputNodeRef.current.value.toLowerCase();
    const foundBar = bars.find((bar) => bar.name.toLowerCase() === search);
    if (foundBar && mapInstance.current) {
      mapInstance.current.panTo({ lat: foundBar.latitude, lng: foundBar.longitude });
      mapInstance.current.setZoom(14); // Optional: zoom in on the searched location
    } else {
      console.error('Bar not found or map instance not initialized');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
        <TextField
          inputRef={inputNodeRef}
          variant="outlined"
          size="small"
          placeholder="Search for a bar"
          onKeyDown={handleSearch}
          style={{ marginRight: 8 }}
        />
        <IconButton onClick={() => handleSearch({ key: 'Enter' })}>
          <SearchIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default MapComponent;
