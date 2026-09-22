import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token } = useAuth();

  const hasToken = token || sessionStorage.getItem("rentar_token");
  const currentUser =
    user || JSON.parse(sessionStorage.getItem("rentar_user") || "null");

  if (!hasToken || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.rol)) {
    return <Navigate to="/error/403" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
