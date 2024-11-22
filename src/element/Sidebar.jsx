import { useState, useEffect } from "react";
import {
  FaHome,
  FaBox,
  FaChartBar,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Collapse sidebar by default on mobile devices
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`h-screen bg-gray-800 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <img src="/path-to-your-logo.png" alt="Logo" className="h-8 w-8" />
          {!isCollapsed && (
            <span className="text-white text-lg font-semibold">Dashboard</span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
        >
          {isCollapsed ? ">" : "<"}
        </button>
      </div>

      <nav className="mt-6">
        <ul className="space-y-2">
          <li className="text-gray-300">
            <Link
              to="/"
              className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md transition-all duration-300"
            >
              <FaHome className="w-6 h-6" />
              {!isCollapsed && <span className="ml-4">Dashboard</span>}
            </Link>
          </li>
          <li className="text-gray-300">
            <Link
              to="/manage-product"
              className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md transition-all duration-300"
            >
              <FaBox className="w-6 h-6" />
              {!isCollapsed && <span className="ml-4">Manage Products</span>}
            </Link>
          </li>
          <li className="text-gray-300">
            <Link
              to="/manage-order"
              className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md transition-all duration-300"
            >
              <FaChartBar className="w-6 h-6" />
              {!isCollapsed && <span className="ml-4">Manage Order</span>}
            </Link>
          </li>
          <li className="text-gray-300">
            <Link
              to="/users"
              className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md transition-all duration-300"
            >
              <FaUsers className="w-6 h-6" />
              {!isCollapsed && <span className="ml-4">Users</span>}
            </Link>
          </li>
          <li className="text-gray-300">
            <Link
              to="/settings"
              className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md transition-all duration-300"
            >
              <FaCog className="w-6 h-6" />
              {!isCollapsed && <span className="ml-4">Settings</span>}
            </Link>
          </li>
          <li className="text-gray-300">
            <Link
              to="/logout"
              className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md transition-all duration-300"
            >
              <FaSignOutAlt className="w-6 h-6" />
              {!isCollapsed && <span className="ml-4">Log Out</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
