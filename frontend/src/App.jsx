import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import TripList from "./pages/trips/TripList";
import CreateTrip from "./pages/trips/CreateTrip";
import JoinTrip from "./pages/trips/JoinTrip";
import TripDetails from "./pages/trips/TripDetails";

function RedirectIfLoggedIn({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/trips" replace />;
  }

  return children;
}

function DashboardRoute({ children }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          <RedirectIfLoggedIn>
            <Login />
          </RedirectIfLoggedIn>
        }
      />

      <Route
        path="/register"
        element={
          <RedirectIfLoggedIn>
            <Register />
          </RedirectIfLoggedIn>
        }
      />

      <Route
        path="/trips"
        element={
          <DashboardRoute>
            <TripList />
          </DashboardRoute>
        }
      />

      <Route
        path="/trips/create"
        element={
          <DashboardRoute>
            <CreateTrip />
          </DashboardRoute>
        }
      />

      <Route
        path="/trips/join"
        element={
          <DashboardRoute>
            <JoinTrip />
          </DashboardRoute>
        }
      />

      <Route
        path="/trips/:id"
        element={
          <DashboardRoute>
            <TripDetails />
          </DashboardRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;