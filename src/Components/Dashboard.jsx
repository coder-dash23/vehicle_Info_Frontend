import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useVehicle } from "../context/VehicleContext";
import Cookies from "universal-cookie";
import Downloadcsv from "../Components/Downloadcsv"

const Dashboard = () => {
  const { vehicles, setVehicles } = useVehicle();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    fuel: "",
    transmission: "",
  });

  const navigate = useNavigate();
  const cookies = useMemo(() => new Cookies(), []);
  const username = cookies.get("username");

  useEffect(() => {
    const fetchVehicles = async () => {
      const token = cookies.get("token");
      if (!token) {
        console.warn("No token found, redirecting to login.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8090/vehicles", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch vehicles. Status: ${response.status}`
          );
        }

        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        alert("Failed to fetch vehicles. Please try again later.");
      } finally {
        setIsAuthChecked(true);
      }
    };

    fetchVehicles();
  }, [setVehicles, navigate, cookies]);

  if (!isAuthChecked) {
    return null;
  }

  // Delete vehicle function
  const handleDelete = async (id) => {
    try {
      const token = cookies.get("token");
      const response = await fetch(`http://localhost:8090/vehicles/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete vehicle");
      }

      // Remove deleted vehicle from state
      setVehicles((prevVehicles) =>
        prevVehicles.filter((vehicle) => vehicle.id !== id)
      );
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  // Search Handler
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter Handler
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };



  const filteredVehicles = vehicles.filter((vehicle) => {
    return (
      (searchQuery === "" ||
        vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase()) || // Ensure model exists
        vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.year.toString().includes(searchQuery)) && // Ensure year is treated as string
      (filters.type === "" || vehicle.type === filters.type) &&
      (filters.fuel === "" || vehicle.fuel === filters.fuel) &&
      (filters.transmission === "" ||
        vehicle.transmission === filters.transmission)
    );
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="bg-blue-100 p-3 rounded-lg shadow-md md:ml-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Hello, <span className="text-blue-600">{username}</span> 👋
          </h2>
        </div>
        <h2 className="text-3xl font-bold text-center md:text-left">
          Vehicle List
        </h2>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/add-vehicle")}
            className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded cursor-pointer"
          >
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by name, model, plate, colors..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border rounded w-full md:w-1/3"
        />

        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Types</option>
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
          <option value="Bus">Bus</option>
        </select>

        <select
          name="fuel"
          value={filters.fuel}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Fuel Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
        </select>

        <select
          name="transmission"
          value={filters.transmission}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Transmissions</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>
      </div>

      <Downloadcsv/>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white shadow-lg rounded-lg p-5 border"
            >
              <h3 className="text-xl font-semibold">{vehicle.name}</h3>
              <p className="text-gray-600 mt-2">
                Model No: <span className="font-medium">{vehicle.model}</span>
              </p>
              <p className="text-gray-600 mt-2">
                Type: <span className="font-medium">{vehicle.type}</span>
              </p>
              <p className="text-gray-600 mt-2">
                License Plate:{" "}
                <span className="font-medium">{vehicle.plate}</span>
              </p>
              <p className="text-gray-600 mt-2">
                Manufacturing Year:{" "}
                <span className="font-medium">{vehicle.year}</span>
              </p>
              <p className="text-gray-600 mt-2">
                Mileage: <span className="font-medium">{vehicle.mileage}</span>
              </p>
              <p className="text-gray-600 mt-2">
                Fuel Type: <span className="font-medium">{vehicle.fuel}</span>
              </p>
              <p className="text-gray-600 mt-2">
                Transmission:{" "}
                <span className="font-medium">{vehicle.transmission}</span>
              </p>
              <p className="text-gray-600 mt-2">
                Color: <span className="font-medium">{vehicle.color}</span>
              </p>

              {/* Action Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() =>
                    navigate("/add-vehicle", { state: { vehicle } })
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center col-span-3">
            No vehicles available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
