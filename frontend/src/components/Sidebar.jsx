import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Sidebar() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">✈</div>
        <div>
          <strong>Travel</strong>
          <span>Planner</span>
        </div>
      </div>

      <div className="sidebar-section">
        <span className="sidebar-label">MENU</span>

        <NavLink
          to="/trips"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span>⌂</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/trips/create"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span>＋</span>
          Create Trip
        </NavLink>

        <NavLink
          to="/trips/join"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span>↗</span>
          Join Trip
        </NavLink>
      </div>

      <div className="sidebar-spacer" />

      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="sidebar-user-info">
          <strong>{user?.name || "User"}</strong>
          <span>Traveler</span>
        </div>
      </div>

      <button className="sidebar-logout" onClick={handleLogout}>
        <span>↪</span>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;