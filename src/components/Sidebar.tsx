import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, Bus, MapPin, Users, Settings } from 'lucide-react';

const Sidebar = ({ role }: { role: string}) => {
  const [isOpen, setIsOpen] = useState(false);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  // Role-specific menu items
  const menuItems = {
    student: [
      { name: 'Dashboard', icon: MapPin, path: '/student-dashboard' },
      { name: 'Book Ride', icon: Bus, path: '/student-dashboard/book' },
      { name: 'My Bookings', icon: Users, path: '/student-dashboard/bookings' },
    ],
    driver: [
      { name: 'Live Tracking', icon: MapPin, path: '/driver-dashboard' },
      { name: 'My Route', icon: Bus, path: '/driver-dashboard/route' },
      { name: 'My Bookings', icon: Users, path: '/driver-dashboard/bookings' },
    ],
    admin: [
      { name: 'Overview', icon: MapPin, path: '/admin-dashboard' },
      { name: 'Manage Buses', icon: Bus, path: '/admin-dashboard/buses' },
      { name: 'Users', icon: Users, path: '/admin-dashboard/users' },
      { name: 'Routes', icon: Settings, path: '/admin-dashboard/routes' },
    ],
  };

  const items = menuItems[role] || [];

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow"
        onClick={toggleMenu}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-primary text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out md:relative md:block`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-10">Campus Transport</h2>

          <nav className="space-y-2">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded text-accent hover:bg-accent hover:text-primary transition"
                onClick={() => setIsOpen(false)} // close on mobile
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded hover:bg-red-700 transition"
            >
              <LogOut size={20} />
              <span className='text-accent'>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar open */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};

export default Sidebar;