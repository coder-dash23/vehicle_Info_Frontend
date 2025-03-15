import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useVehicle } from "../context/VehicleContext";
import Cookies from "universal-cookie";

const VehicleForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicles, setVehicles } = useVehicle();

  const editingVehicle = location.state?.vehicle || null;

  const [formData, setFormData] = useState({
    name: editingVehicle ? editingVehicle.name : "",
    type: editingVehicle ? editingVehicle.type : "",
    plate: editingVehicle ? editingVehicle.plate : "",
    year: editingVehicle ? editingVehicle.year : "",
    mileage: editingVehicle ? editingVehicle.mileage : "",
    fuel: editingVehicle ? editingVehicle.fuel : "",
    transmission: editingVehicle ? editingVehicle.transmission : "",
    color: editingVehicle ? editingVehicle.color : "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const cookies = useMemo(() => new Cookies(), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const method = editingVehicle ? "PUT" : "POST";
    const url = editingVehicle
      ? `http://localhost:8090/vehicles/${editingVehicle.id}`
      : "http://localhost:8090/vehicles";
  
    try {
      const token = cookies.get("token");
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include", // Ensure cookies are sent with the request
        body: JSON.stringify(formData),
      });

      console.log(formData);

      if (!response.ok) {
        // Handle non-OK responses
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in.");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save vehicle");
      }
  
      const updatedVehicle = await response.json();
  
      if (editingVehicle) {
        setVehicles((prevVehicles) =>
          prevVehicles.map((vehicle) =>
            vehicle.id === editingVehicle.id ? updatedVehicle : vehicle
          )
        );
      } else {
        setVehicles([...vehicles, updatedVehicle]);
      }
  
      navigate("/Dashboard");
    } catch (error) {
      console.error("Error saving vehicle:", error);
      alert(error.message); // Optionally show the error message to the user
    }
  };
  
  
  
  

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow-lg">
      <h2 className="text-3xl font-bold mb-4">
        {editingVehicle ? "Edit Vehicle" : "Add Vehicle"}
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Vehicle Name"
          className="w-full px-3 py-2 mb-3 border rounded"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <select
          name="type"
          className="w-full px-3 py-2 mb-3 border rounded cursor-pointer"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="">Select Vehicle Type</option>
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
          <option value="Truck">Truck</option>
          <option value="Bus">Bus</option>
        </select>

        <input
          type="text"
          name="plate"
          placeholder="License Plate Number"
          className="w-full px-3 py-2 mb-3 border rounded"
          value={formData.plate}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Manufacturing Year"
          className="w-full px-3 py-2 mb-3 border rounded"
          value={formData.year}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="mileage"
          placeholder="Mileage (e.g., 50,000 km)"
          className="w-full px-3 py-2 mb-3 border rounded"
          value={formData.mileage}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="fuel"
          placeholder="Fuel Type"
          className="w-full px-3 py-2 mb-3 border rounded"
          value={formData.fuel}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="transmission"
          placeholder="Transmission (Manual/Automatic)"
          className="w-full px-3 py-2 mb-3 border rounded"
          value={formData.transmission}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="color"
          placeholder="Color"
          className="w-full px-3 py-2 mb-3 border rounded"
          value={formData.color}
          onChange={handleChange}
          required
        />

        <div className="flex gap-3">
          <button
            type="submit"
            onClick={() => navigate("/Dashboard")}
            className="w-full bg-blue-500 text-white py-2 rounded cursor-pointer"
          >
            {editingVehicle ? "Update" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/Dashboard")}
            className="w-full bg-gray-500 text-white py-2 rounded cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
