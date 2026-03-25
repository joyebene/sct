// src/pages/dashboards/AdminDashboard.jsx
const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Active Buses</h2>
          <p className="text-4xl font-bold text-green-600">7</p>
          <p className="text-sm text-gray-500">Currently on route</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Bookings Today</h2>
          <p className="text-4xl font-bold text-blue-600">142</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Alerts</h2>
          <p className="text-2xl font-bold text-red-600">2 delays</p>
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Live Map Overview</h2>
        <div className="h-96 bg-gray-200 rounded flex items-center justify-center">
          Full Admin Map with All Buses (Leaflet next)
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;