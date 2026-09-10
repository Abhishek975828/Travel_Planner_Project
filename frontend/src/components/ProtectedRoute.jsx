import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Wrap any page in <ProtectedRoute> to require login.
// While we're still checking localStorage for a saved session, show a
// simple loading message instead of redirecting too early.
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;