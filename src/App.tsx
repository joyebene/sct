import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import DriverDashboard from './pages/dashboard/DriverDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// Placeholder pages (create these folders/files)
import BookRide from './pages/student/BookRide';     
import MyBookings from './pages/student/MyBookings'; 
import DriverBookings from './pages/driver/DriverBooking';

function App() {
  // Simple auth check (improve later with context or protected route component)
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role;

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Navigate to={`/${role}-dashboard`} />} />

        {/* Student Routes */}
        <Route
          path="/student-dashboard"
          element={<DashboardLayout role="student" />}
        >
          <Route index element={<StudentDashboard />} />
          <Route path="book" element={<BookRide />} />
          <Route path="bookings" element={<MyBookings />} />
        </Route>

        {/* Driver Routes */}
        <Route
          path="/driver-dashboard"
          element={<DashboardLayout role="driver" />}
        >
          <Route index element={<DriverDashboard />} />
          <Route path="bookings" element={<DriverBookings />} />
          
          {/* Add more driver sub-routes later */}
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={<DashboardLayout role="admin" />}
        >
          <Route index element={<AdminDashboard />} />
          {/* Add more admin sub-routes later */}
        </Route>

        <Route path="*" element={<Navigate to={`/${role}-dashboard`} />} />
      </Routes>
    </Router>
  );
}

export default App;