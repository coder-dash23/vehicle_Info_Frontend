import { Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";

const PrivateRoute = () => {
    const cookies = new Cookies();
    const token = cookies.get("token");

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
 