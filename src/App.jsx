import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { VehicleProvider } from "./context/VehicleContext";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Dashboard from "./Components/Dashboard";
import VehicleForm from "./Components/VehicleForm";
import PrivateRoute from "./Components/PrivateRoute"; // Import Private Route

function App() {
  return (
    <VehicleProvider>
      <Router>
        <Navbar />
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-vehicle" element={<VehicleForm />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </VehicleProvider>
  );
}

export default App;
