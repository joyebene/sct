import useApi  from '../../hooks/useApi';
import { format } from 'date-fns';

interface PassengerBooking {
  _id: string;
  user: {
    name: string;
    matricNumber: string;
  };
  bookingTime: string;
  bookingDate: string;
  route: {
    name: string;
  };
  status: string;
}

const DriverBookings = () => {
  // We'll create /api/bookings/driver endpoint on backend
  const { data: bookings = [], loading, error } = useApi<PassengerBooking[]>('/bookings/driver');

  if (loading) {
    return <div className="p-8 text-center">Loading passenger bookings...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  const hasBookings = bookings!.length > 0;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Passenger Bookings for My Bus</h1>

      {!hasBookings ? (
        <div className="bg-white p-12 rounded-xl shadow text-center">
          <p className="text-xl text-gray-600">No bookings found for your bus today.</p>
          <p className="mt-2 text-gray-500">Bookings will appear here when students reserve seats.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Matric</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Route</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time / Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings?.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.user?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.user?.matricNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.route?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.bookingTime} • {format(new Date(booking.bookingDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                          booking.status === 'Confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.status || 'Confirmed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        Showing bookings for today and upcoming days
      </div>
    </div>
  );
};

export default DriverBookings;