import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <nav className="home-navbar">
      <Link to="/" className="home-navbar-brand">
        <span className="brand-mark">✈</span>
        <span>
          Travel<span>Planner</span>
        </span>
      </Link>

      <div className="home-navbar-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How it works</a>

        {isAuthenticated ? (
          <Link to="/trips" className="nav-dashboard-btn">
            Dashboard →
          </Link>
        ) : (
          <>
            <Link to="/login" className="nav-login">
              Login
            </Link>

            <Link to="/register" className="nav-register">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;