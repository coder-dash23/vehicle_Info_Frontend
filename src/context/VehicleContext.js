import { createContext, useContext, useState } from "react";

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);

  return (
    <VehicleContext.Provider value={{ vehicles, setVehicles }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => useContext(VehicleContext);
