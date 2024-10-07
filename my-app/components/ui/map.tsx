import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Set default Leaflet icon options
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon definitions for different amenities
const icons = {
  restaurant: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/685/685352.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  hospital: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  default: new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
};

// Define the structure for a Point of Interest
interface PointOfInterest {
  lat: number;
  lng: number;
  name: string;
  amenity: string;
}

const MapComponent: React.FC = () => {
  // State declarations
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Watch user's position and update state
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      (error) => {
        console.error('Error fetching location:', error);
        setErrorMessage('Failed to get your location. Please enable location services and try again.');
      }
    );

    // Cleanup function to stop watching position
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Fetch points of interest when position or search query changes
  const fetchPointsOfInterest = useCallback(async (lat: number, lng: number, radius: number = 1500) => {
    if (!lat || !lng) return;
    
    const query = `
      [out:json];
      node
        [amenity~"${searchQuery || '.*'}"]
        (around:${radius}, ${lat}, ${lng});
      out body;
    `;
    try {
      const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
        headers: { 'Content-Type': 'text/plain' },
      });
      const pois: PointOfInterest[] = response.data.elements.map((poi: any) => ({
        lat: poi.lat,
        lng: poi.lon,
        name: poi.tags.name || 'Unnamed POI',
        amenity: poi.tags.amenity,
      }));
      setPointsOfInterest(pois);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching points of interest:', error);
      setErrorMessage('Failed to fetch points of interest. Please try again.');
    }
  }, [searchQuery]);

  useEffect(() => {
    if (position) {
      fetchPointsOfInterest(position[0], position[1]);
    }
  }, [position, searchQuery, fetchPointsOfInterest]);

  // Handle search input changes
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Get the appropriate icon for an amenity
  const getIcon = (amenity: string): L.Icon => {
    return icons[amenity as keyof typeof icons] || icons.default;
  };

  // Show loading state if position is not yet available
  if (!position) {
    return <div>Loading map...</div>;
  }

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by category (e.g., hospital, restaurant)"
        style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
      />
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <MapContainer center={position} zoom={13} style={{ height: '80vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>You are here</Popup>
        </Marker>
        {pointsOfInterest.map((poi, index) => (
          <Marker key={index} position={[poi.lat, poi.lng]} icon={getIcon(poi.amenity)}>
            <Popup>
              {poi.name} - {poi.amenity}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
