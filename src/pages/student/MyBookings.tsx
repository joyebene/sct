// src/pages/student/MyBookings.tsx
import { Link } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import { format } from 'date-fns';

// Define interfaces matching what backend actually returns
interface RouteInfo {
  _id: string;
  name: string;
  bus: string;
}

interface Booking {
  _id: string;
  route: RouteInfo;
  bookingTime: string;
  bookingDate: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  seatNumber: number;
}

const MyBookings = () => {
  const { data: bookings = [], loading, error, refetch } = useApi<Booking[]>('/bookings');

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-xl max-w-md">
          <p className="text-red-600 font-medium mb-2">Error loading bookings</p>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const hasBookings = bookings!.length > 0;

  return (
    <div className="min-h-[calc(100vh-80px)] max-w-6xl mx-auto sm:px-4 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Bookings</h1>

      {!hasBookings ? (
        <div className="bg-white p-10 md:p-16 rounded-xl shadow-lg text-center border border-gray-200">
          <p className="text-xl md:text-2xl text-gray-600 mb-6">
            You don't have any bookings yet.
          </p>
          <Link
            to="/student-dashboard/book"
            className="inline-block px-4 md:px-8 py-2 md:py-3 bg-primary text-accent font-medium rounded-lg hover:bg-primary transition shadow-md"
          >
            Book a Ride Now
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10 overflow-auto">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 min-w-50">Route</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 min-w-40">Time / Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 min-w-25">Bus</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 min-w-22.5">Seat</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 min-w-32.5">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 min-w-27.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings?.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.route.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.bookingTime} • {format(new Date(booking.bookingDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.route.bus}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.seatNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'Confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : booking.status === 'Completed'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800' // For 'Cancelled'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {booking.status === 'Confirmed' && (
                        <button
                          onClick={async () => {
                            if (!window.confirm('Cancel this booking?')) return;

                            try {
                              // Future: await api.delete(`/bookings/${booking._id}`);
                              alert(`Booking ${booking._id} cancelled (API integration pending)`);
                              refetch(); // optimistic refresh
                            } catch (err) {
                              alert(`Failed to cancel booking ${booking._id}: ${err}`);
                            }
                          }}
                          className="text-red-600 hover:text-red-800 font-medium transition"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden text-center py-3 text-sm text-gray-500 bg-gray-50 border-t">
            ← Swipe left/right to view all columns →
          </div>
        </div>
      )}

      {hasBookings && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing your upcoming and recent bookings • Last updated just now
        </div>
      )}
    </div>
  );
};

export default MyBookings;