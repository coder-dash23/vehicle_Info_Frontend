import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useVehicle } from "../context/VehicleContext";
import Cookies from "universal-cookie";

const Dashboard = () => {
  const { vehicles, setVehicles } = useVehicle();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const navigate = useNavigate();
  const cookies = useMemo(() => new Cookies(), []);
  const username =  cookies.get("username");

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
        console.log(data);

        
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
          "Authorization": `Bearer ${token}`,
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

      {/* Vehicle List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            
            <div
              key={vehicle.id}
              className="bg-white shadow-lg rounded-lg p-5 border"
            >
              <h3 className="text-xl font-semibold">{vehicle.name}</h3>
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
              <div className="flex gap-2 mt-4">
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
