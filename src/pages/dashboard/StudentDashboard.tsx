import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import useApi from '../../hooks/useApi';
import LiveTrackingMap from '../../components/LiveTrackingMap';

// Interfaces to match our new data structure
interface Bus {
  _id: string;
  name: string;
}

interface Route {
  _id: string;
  name: string;
  bus: Bus;
}

interface LocationData {
  busId: string;
  lat: number;
  lng: number;
}

const StudentDashboard = () => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [error, setError] = useState<string | null>(null);

  // Fetch all routes to find a bus to track
  const { data: routes, loading: isLoadingRoutes } = useApi<Route[]>('/routes');

  // The bus we are currently tracking (defaults to the bus from the first route)
  const trackedBus = routes?.[0]?.bus;

  useEffect(() => {
    // Don't connect until we have a bus to track
    if (!trackedBus) {
      if (!isLoadingRoutes) setConnectionStatus('disconnected');
      return;
    }

    setConnectionStatus('connecting');
    setLocationData(null);
    setError(null);

    const socket: Socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log(`Connected to WebSocket and tracking bus: ${trackedBus.name} (${trackedBus._id})`);
      setConnectionStatus('connected');
      // Join the room for the specific bus ID from the database
      socket.emit('join-bus-room', trackedBus._id);
    });

    socket.on('locationUpdate', (data: LocationData) => {
      // Ensure the update is for the bus we are tracking
      if (data.busId === trackedBus._id) {
        console.log(data);
        
        setLocationData(data);
        if (connectionStatus !== 'connected') setConnectionStatus('connected');
        setError(null);
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Connection Error:', err);
      setError('Failed to connect to the tracking service.');
      setConnectionStatus('error');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setConnectionStatus('disconnected');
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [trackedBus]); // Re-run effect if the tracked bus changes

  const getStatusMessage = () => {
    if (isLoadingRoutes) return 'Loading available routes...';
    if (!trackedBus) return 'No buses available to track.';
    switch (connectionStatus) {
      case 'connecting':
        return 'Connecting to tracking service...';
      case 'connected':
        return locationData ? null : `Waiting for location data from ${trackedBus.name}...`;
      case 'disconnected':
        return 'Connection lost. The driver may have stopped sharing.';
      case 'error':
        return error || 'An unknown connection error occurred.';
      default:
        return 'Initializing...';
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:p-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200 min-h-100 lg:min-h-[calc(100vh-130px)]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {trackedBus ? `Live Tracking for ${trackedBus.name}` : 'Live Bus Tracking'}
        </h2>
        <div className="h-75 lg:h-[calc(100%-40px)] w-full">
          {statusMessage ? (
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
              <p className="text-gray-500 text-center px-4">{statusMessage}</p>
            </div>
          ) : locationData && trackedBus ? (
            <LiveTrackingMap 
              location={locationData} 
              busInfo={{ id: trackedBus._id, name: trackedBus.name as any }}
            />
          ) : null}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Book</h2>
          <p>Next buses to Library, Hostel, Auditorium...</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <ul className="space-y-2">
            <li>Bus A arriving in 4 min</li>
            <li>Your booking confirmed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;