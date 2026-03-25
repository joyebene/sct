import { useState, useEffect } from 'react';
import Button from '../../components/shared/button';
import useApi from '../../hooks/useApi';

// Define interfaces for our data
interface Bus {
  _id: string;
  name: string;
  licensePlate: string;
}

interface Route {
  _id: string;
  name: string;
  schedule: string[];
  bus: Bus;
}

const BookRide = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { data: fetchedRoutes, loading, error: apiError } = useApi<Route[]>('/routes');
  const { post: createBooking, loading: isBooking, error: bookingError } = useApi('/bookings');

  useEffect(() => {
    if (fetchedRoutes) {
      setRoutes(fetchedRoutes);
    }
    if (apiError) {
      setError('Failed to load routes. Please try again later.');
    }
  }, [fetchedRoutes, apiError]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!selectedRouteId || !selectedTime) {
      setError('Please select both a route and a time.');
      return;
    }

    const bookingData = {
      routeId: selectedRouteId,
      bookingTime: selectedTime,
      bookingDate: new Date().toISOString(), // Book for today
    };

    const result = await createBooking(bookingData);

    if (result) {
      setMessage(`Booking confirmed! Route: ${routes.find(r => r._id === selectedRouteId)?.name}, Time: ${selectedTime}`);
      setSelectedRouteId('');
      setSelectedTime('');
    }
  };

  const selectedRoute = routes.find(r => r._id === selectedRouteId);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Book a Ride</h1>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <form onSubmit={handleBooking} className="space-y-6">
          <div>
            <label htmlFor='route' className="block text-gray-700 font-medium mb-2">
              Select Route
            </label>
            <select
              id='route'
              value={selectedRouteId}
              onChange={(e) => {
                setSelectedRouteId(e.target.value);
                setSelectedTime(''); // Reset time when route changes
              }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
              required
              disabled={loading}
            >
              <option value="">{loading ? 'Loading routes...' : '-- Choose a route --'}</option>
              {routes.map(route => (
                <option key={route._id} value={route._id}>
                  {route.name} (Bus: {route.bus.name})
                </option>
              ))}
            </select>
          </div>

          {selectedRoute && (
            <div>
              <label htmlFor='dept-time' className="block text-gray-700 font-medium mb-2">
                Select Departure Time
              </label>
              <select
                id='dept-time'
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                required
                disabled={!selectedRouteId}
              >
                <option value="">-- Choose a time --</option>
                {selectedRoute.schedule.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button type="submit" loading={isBooking} disabled={!selectedRouteId || !selectedTime}>
            Confirm Booking
          </Button>
        </form>

        {message && (
          <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-lg text-center">
            <p className="text-green-800 font-semibold">{message}</p>
          </div>
        )}
        {(error || bookingError) && (
          <div className="mt-6 p-4 bg-red-100 border border-red-200 rounded-lg text-center">
            <p className="text-red-800 font-semibold">{error || bookingError}</p>
          </div>
        )}
      </div>

      <div className="mt-10 bg-primary/10 p-6 rounded-xl border border-primary/20">
        <h3 className="text-lg font-semibold mb-3 text-primary">Tips for a Smooth Ride</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Bookings are first-come, first-served. Book early during peak hours!</li>
          <li>You can view and cancel your bookings under the "My Bookings" section.</li>
          <li>Enable live tracking after booking to see your bus's real-time location.</li>
        </ul>
      </div>
      </div>
  );
};

export default BookRide;