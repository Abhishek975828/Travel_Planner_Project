import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}

      <nav className="home-navbar">

        <Link to="/" className="home-navbar-brand">
          <span className="brand-mark">✈</span>

          <span>
            Travel<span>Planner</span>
          </span>
        </Link>

        <div className="home-navbar-links">

          <a href="#features">
            Features
          </a>

          <a href="#how-it-works">
            How It Works
          </a>

          {isAuthenticated ? (
            <Link
              to="/trips"
              className="nav-dashboard-btn"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-login"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="nav-register"
              >
                Get Started
              </Link>
            </>
          )}

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-content">

          <span className="hero-badge">
            ✈️ Your journey, organized
          </span>

          <h1>
            Plan trips.
            <br />
            <span>Share memories.</span>
            <br />
            Split expenses.
          </h1>

          <p>
            Travel Planner makes group travel simple. Organize your
            itinerary, manage expenses and keep everyone on the same page.
            Plan your trip together without the usual travel chaos.
          </p>

          <div className="hero-actions">

            <Link
              to={isAuthenticated ? "/trips" : "/register"}
              className="btn btn-primary btn-large"
            >
              {isAuthenticated
                ? "Go to Dashboard"
                : "Start Planning →"}
            </Link>

            {!isAuthenticated && (
              <Link
                to="/login"
                className="btn btn-outline btn-large"
              >
                Sign In
              </Link>
            )}

          </div>

          <div className="hero-trust">

            <div>
              <strong>Easy</strong>
              <span>Trip planning</span>
            </div>

            <div>
              <strong>Smart</strong>
              <span>Expense splitting</span>
            </div>

            <div>
              <strong>Shared</strong>
              <span>Group itinerary</span>
            </div>

          </div>

        </div>


        {/* ================= HERO VISUAL ================= */}

        <div className="hero-visual">

          <div className="main-travel-card">

            <div className="travel-card-image">
              <span>🌴</span>
            </div>

            <div className="travel-card-content">

              <span className="small-label">
                UPCOMING TRIP
              </span>

              <h3>
                Goa Adventure
              </h3>

              <p>
                📍 Goa, India
              </p>

              <div className="travel-card-footer">

                <span>
                  12 Jun — 16 Jun
                </span>

                <span className="status-badge">
                  Upcoming
                </span>

              </div>

            </div>

          </div>


          <div className="floating-card floating-members">

            <div className="mini-icon">
              👥
            </div>

            <div>
              <strong>
                6 Members
              </strong>

              <span>
                Going together
              </span>
            </div>

          </div>


          <div className="floating-card floating-expense">

            <div className="mini-icon green">
              ✓
            </div>

            <div>
              <strong>
                ₹2,450
              </strong>

              <span>
                Expenses tracked
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <span className="section-label">
            EVERYTHING YOU NEED
          </span>

          <h2>
            Travel planning, without the chaos.
          </h2>

          <p>
            Everything your group needs before and during the trip.
          </p>

        </div>


        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon purple">
              🗺️
            </div>

            <h3>
              Plan Your Itinerary
            </h3>

            <p>
              Create day-by-day activities and keep your entire
              trip schedule organized in one place.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon blue">
              💳
            </div>

            <h3>
              Split Expenses
            </h3>

            <p>
              Track shared expenses and automatically calculate
              who owes whom. No more confusing calculations.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon orange">
              👥
            </div>

            <h3>
              Travel Together
            </h3>

            <p>
              Invite your friends and manage trip members from
              a single dashboard.
            </p>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="section-heading">

          <span className="section-label">
            HOW IT WORKS
          </span>

          <h2>
            Ready in three simple steps.
          </h2>

          <p>
            Start your trip, invite your friends and enjoy
            an organized travel experience.
          </p>

        </div>


        <div className="steps-grid">

          <div className="step">

            <span>
              01
            </span>

            <h3>
              Create a Trip
            </h3>

            <p>
              Give your adventure a name, destination and dates.
              Everything starts with creating your trip.
            </p>

          </div>


          <div className="step">

            <span>
              02
            </span>

            <h3>
              Invite Your Group
            </h3>

            <p>
              Share your unique invite code and bring your
              friends or travel partners into the trip.
            </p>

          </div>


          <div className="step">

            <span>
              03
            </span>

            <h3>
              Enjoy the Journey
            </h3>

            <p>
              Plan activities, track expenses and settle payments
              while keeping everything organized.
            </p>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="home-cta">

        <div>

          <span className="section-label">
            YOUR NEXT ADVENTURE
          </span>

          <h2>
            Make your next trip easier.
          </h2>

          <p>
            Start planning your group adventure today.
          </p>

        </div>

        <Link
          to={
            isAuthenticated
              ? "/trips/create"
              : "/register"
          }
          className="btn btn-white btn-large"
        >
          Create a Trip →
        </Link>

      </section>


      {/* ================= POLISHED FOOTER ================= */}

      <footer className="home-footer">

        <div className="footer-main">

          {/* Brand */}

          <div className="footer-brand">

            <Link
              to="/"
              className="footer-logo"
            >
              <span className="footer-logo-mark">
                ✈
              </span>

              <span>
                Travel<span>Planner</span>
              </span>
            </Link>

            <p>
              Plan together, travel better. Keep your trips,
              itinerary and expenses organized in one place.
            </p>

          </div>


          {/* Quick Links */}

          <div className="footer-column">

            <h4>
              Explore
            </h4>

            <a href="#features">
              Features
            </a>

            <a href="#how-it-works">
              How It Works
            </a>

            <Link to="/">
              Home
            </Link>

          </div>


          {/* Account */}

          <div className="footer-column">

            <h4>
              Account
            </h4>

            {isAuthenticated ? (
              <>
                <Link to="/trips">
                  Dashboard
                </Link>

                <Link to="/trips/create">
                  Create Trip
                </Link>

                <Link to="/trips/join">
                  Join Trip
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  Sign In
                </Link>

                <Link to="/register">
                  Get Started
                </Link>
              </>
            )}

          </div>


          {/* About */}

          <div className="footer-column footer-about">

            <h4>
              Travel Planner
            </h4>

            <p>
              Your simple companion for planning memorable
              group adventures.
            </p>

            <span className="footer-tagline">
              ✈ Plan • Travel • Remember
            </span>

          </div>

        </div>


        {/* Bottom */}

        <div className="footer-bottom">

          <span>
            © 2026 Travel Planner. All rights reserved.
          </span>

          <span>
            Made for better journeys ✈
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Home;