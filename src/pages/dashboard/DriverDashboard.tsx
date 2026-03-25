import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import useApi from '../../hooks/useApi'; // Import useApi
import Button from '../../components/shared/button';

// Define interfaces for our data structures
interface Bus {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'driver';
  bus: Bus;
}

interface LocationData {
  busId: string;
  lat: number;
  lng: number;
  timestamp: string;
}

const DriverDashboard = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const { data: driver, loading: isLoadingDriver } = useApi<User>('/auth/me');

  useEffect(() => {
    if (!isSharing || !driver) {
      return;
    }

    const socket = io('http://localhost:5000');
    let watchId: number | undefined;

    socket.on('connect', () => {
      console.log('Driver connected to socket server');
    });

    const startSharing = () => {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (pos: GeolocationPosition) => {
            const newLoc: LocationData = {
              busId: driver.bus._id, // Use the bus ID from the logged-in driver
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              timestamp: new Date().toISOString(),
            };
            setLocation(newLoc);
            socket.emit('sendLocation', newLoc);
          },
          (err: GeolocationPositionError) => console.error('Location error:', err),
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }
    };

    startSharing();

    return () => {
      console.log('Stopping location sharing and disconnecting socket.');
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
      socket.disconnect();
    };
  }, [isSharing, driver]);

  if (isLoadingDriver) {
    return <div className="text-center p-10">Loading driver details...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Driver Dashboard</h1>
      {driver && (
        <p className="text-center text-xl text-gray-600 mb-6">
          Welcome, {driver.name}. You are assigned to <span className="font-bold text-primary">{driver.bus.name}</span>.
        </p>
      )}

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto text-center border border-gray-300">
        <h2 className="text-2xl mb-6">
          {isSharing ? 'Sharing Live Location' : 'Start Location Sharing'}
        </h2>

        <Button
          onClick={() => setIsSharing(!isSharing)}
          disabled={!driver}
          loading={isSharing}
        >
          {isSharing ? 'STOP SHARING' : 'START SHARING'}
        </Button>

        {location && (
          <div className="mt-8 text-left bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="font-semibold text-lg mb-2">Current Position:</p>
            <p><span className="font-medium">Lat:</span> {location.lat.toFixed(6)}</p>
            <p><span className="font-medium">Lng:</span> {location.lng.toFixed(6)}</p>
            <p><span className="font-medium">Time:</span> {new Date(location.timestamp).toLocaleTimeString()}</p>
          </div>
        )}
      </div>

      <p className="text-center mt-8 text-gray-600 max-w-md mx-auto">
        Your location is broadcast to students tracking <span className="font-semibold">{driver?.bus?.name}</span>.
      </p>
    </div>
  );
};

export default DriverDashboard;