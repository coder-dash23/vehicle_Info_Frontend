import { useLocation } from "react-router-dom";
import Cookies from "universal-cookie";

const Navbar = () => {
  const location = useLocation();
  const cookies = new Cookies();
  const isAuthenticated = cookies.get("token"); // Check if user is logged in

  const handleLogout = () => {
    cookies.remove("token"); // Remove auth token
    cookies.remove("username")
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <a href="/dashboard" className="text-lg font-bold">
          VehicleApp
        </a>
        <div>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="px-4 cursor-pointer">
              Logout
            </button>
          ) : (
            <>
              {location.pathname !== "/login" && location.pathname !== "/signup" && (
                <a href="/dashboard" className="px-4 cursor-pointer">
                  Dashboard
                </a>
              )}
              <a href="/login" className="px-4 cursor-pointer">Login</a>
              <a href="/signup" className="px-4 cursor-pointer">Signup</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
