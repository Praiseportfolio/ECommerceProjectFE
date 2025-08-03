import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export default function RequireVerified({ children }) {
  //   const { isAuthenticated, isVerified } = useAuth();
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  //   if (!isVerified) {
  //     return <Navigate to="/verify-email" state={{ from: location }} replace />;
  //   }

  return children;
}
