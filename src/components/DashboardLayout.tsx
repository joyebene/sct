import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import schoolLogo from "../assets/school-logo.webp";

const DashboardLayout = ({ role }: { role: "student" | "driver"| "admin" }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role={role} />

      <div className="flex flex-col flex-1 transition-all duration-300">
        <Header />
        <main className="flex-1 mt-16">
          {/* The outer div provides the background image */}
          <div
            className="h-full bg-center bg-contain bg-no-repeat"
            style={{ backgroundImage: `url(${schoolLogo})`}}
          >
            {/* This div provides the color overlay and contains the content */}
            <div className="h-full bg-secondary/50 p-6">
              <div className="max-w-7xl mx-auto">
                <Outlet /> {/* Renders the child dashboard page */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;