import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyTrips } from "../../api/trips";

function TripList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTrips() {
      try {
        const response = await getMyTrips();
        setTrips(response.data);
      } catch (err) {
        setError("Could not load your trips. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

  const today = new Date();

  const upcomingTrips = trips.filter(
    (trip) => new Date(trip.startDate) >= today
  );

  const totalMembers = trips.reduce(
    (total, trip) => total + (trip.members?.length || 0),
    0
  );

  function getTripStatus(trip) {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    if (today < start) {
      return "Upcoming";
    }

    if (today >= start && today <= end) {
      return "Ongoing";
    }

    return "Completed";
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  // =========================================
  // DESTINATION IMAGE
  // =========================================

  function getTripImage(destination) {
    const place = destination?.toLowerCase().trim() || "";

    const beachPlaces = [
      "goa",
      "maldives",
      "andaman",
      "nicobar",
      "pondicherry",
      "puducherry",
      "kerala",
      "lakshadweep",
      "phuket",
      "bali",
      "miami",
      "hawaii",
      "sri lanka",
    ];

    const mountainPlaces = [
      "manali",
      "shimla",
      "kashmir",
      "gulmarg",
      "sonamarg",
      "leh",
      "ladakh",
      "uttarakhand",
      "mussoorie",
      "nainital",
      "darjeeling",
      "sikkim",
      "spiti",
      "kasol",
      "mount abu",
    ];

    const historicalPlaces = [
      "jaipur",
      "agra",
      "udaipur",
      "jodhpur",
      "varanasi",
      "delhi",
      "amritsar",
      "khajuraho",
      "hampi",
      "mysore",
      "mysuru",
      "lucknow",
      "hyderabad",
    ];

    const cityPlaces = [
      "mumbai",
      "bangalore",
      "bengaluru",
      "pune",
      "chandigarh",
      "kolkata",
      "chennai",
      "ahmedabad",
      "noida",
      "gurgaon",
      "gurugram",
      "new york",
      "london",
      "paris",
      "dubai",
      "singapore",
    ];

    const naturePlaces = [
      "munnar",
      "coorg",
      "kodagu",
      "jim corbett",
      "corbett",
      "ranthambore",
      "kaziranga",
      "ooty",
      "wayanad",
      "meghalaya",
      "rishikesh",
      "alleppey",
      "alappuzha",
    ];

    if (beachPlaces.some((placeName) => place.includes(placeName))) {
      return "/trip-images/beach.jpg";
    }

    if (mountainPlaces.some((placeName) => place.includes(placeName))) {
      return "/trip-images/mountains.jpg";
    }

    if (
      historicalPlaces.some((placeName) => place.includes(placeName))
    ) {
      return "/trip-images/historical.jpg";
    }

    if (cityPlaces.some((placeName) => place.includes(placeName))) {
      return "/trip-images/city.jpg";
    }

    if (naturePlaces.some((placeName) => place.includes(placeName))) {
      return "/trip-images/nature.jpg";
    }

    return "/trip-images/default.jpg";
  }

  return (
    <div className="dashboard-page">

      {/* Header */}

      <div className="dashboard-welcome">

        <div>

          <span className="dashboard-eyebrow">
            TRAVEL DASHBOARD
          </span>

          <h1>
            Plan your next
            <span> adventure.</span>
          </h1>

          <p>
            Manage your trips, itinerary and expenses all in one place.
          </p>

        </div>

        <div className="dashboard-actions">

          <Link
            to="/trips/join"
            className="dashboard-secondary-btn"
          >
            ↗ Join Trip
          </Link>

          <Link
            to="/trips/create"
            className="dashboard-primary-btn"
          >
            ＋ Create Trip
          </Link>

        </div>

      </div>


      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon purple">
            🧳
          </div>

          <div>
            <span>Total Trips</span>
            <strong>{trips.length}</strong>
            <small>Your adventures</small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon blue">
            📅
          </div>

          <div>
            <span>Upcoming</span>
            <strong>{upcomingTrips.length}</strong>
            <small>Trips ahead</small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon orange">
            👥
          </div>

          <div>
            <span>Travelers</span>
            <strong>{totalMembers}</strong>
            <small>Across your trips</small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon green">
            🌍
          </div>

          <div>
            <span>Destinations</span>

            <strong>
              {new Set(
                trips.map((trip) => trip.destination)
              ).size}
            </strong>

            <small>Places explored</small>
          </div>

        </div>

      </div>


      {/* Loading */}

      {loading && (

        <div className="dashboard-message">

          <div className="loading-spinner"></div>

          <p>
            Loading your adventures...
          </p>

        </div>

      )}


      {/* Error */}

      {error && (

        <div className="dashboard-error">
          ⚠️ {error}
        </div>

      )}


      {/* Trips */}

      {!loading && !error && (

        <>

          <div className="trips-section-header">

            <div>

              <span className="section-mini-label">
                YOUR ADVENTURES
              </span>

              <h2>
                My Trips
              </h2>

            </div>

            {trips.length > 0 && (

              <span className="trip-count">
                {trips.length}{" "}
                {trips.length === 1
                  ? "trip"
                  : "trips"}
              </span>

            )}

          </div>


          {trips.length === 0 ? (

            <div className="empty-trips">

              <div className="empty-trip-icon">
                ✈️
              </div>

              <h3>
                No trips yet
              </h3>

              <p>
                Your next adventure is waiting. Create a trip
                or join one using an invite code.
              </p>

              <div className="empty-actions">

                <Link
                  to="/trips/create"
                  className="dashboard-primary-btn"
                >
                  ＋ Create Your First Trip
                </Link>

                <Link
                  to="/trips/join"
                  className="dashboard-secondary-btn"
                >
                  Join a Trip
                </Link>

              </div>

            </div>

          ) : (

            <div className="modern-trip-grid">

              {trips.map((trip) => {

                const status = getTripStatus(trip);

                return (

                  <Link
                    key={trip._id}
                    to={`/trips/${trip._id}`}
                    className="modern-trip-card"
                  >

                    {/* Trip Image */}

                    <div
                      className="trip-card-cover"
                      style={{
                        backgroundImage: `url("${getTripImage(
                          trip.destination
                        )}")`,
                      }}
                    >

                      <div className="trip-cover-overlay">

                        <span
                          className={`trip-status ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>

                        <span className="trip-location">
                          📍 {trip.destination}
                        </span>

                      </div>

                    </div>


                    {/* Trip Information */}

                    <div className="modern-trip-content">

                      <h3>
                        {trip.title}
                      </h3>


                      <div className="trip-info-row">

                        <span>
                          📅
                        </span>

                        <div>

                          <small>
                            TRAVEL DATES
                          </small>

                          <p>
                            {formatDate(trip.startDate)}
                            {" — "}
                            {formatDate(trip.endDate)}
                          </p>

                        </div>

                      </div>


                      <div className="trip-info-row">

                        <span>
                          👥
                        </span>

                        <div>

                          <small>
                            TRAVELERS
                          </small>

                          <p>
                            {trip.members?.length || 0}{" "}
                            {trip.members?.length === 1
                              ? "member"
                              : "members"}
                          </p>

                        </div>

                      </div>


                      <div className="trip-card-bottom">

                        <span>
                          View trip details
                        </span>

                        <span className="trip-arrow">
                          →
                        </span>

                      </div>

                    </div>

                  </Link>

                );
              })}

            </div>

          )}

        </>

      )}

    </div>
  );
}

export default TripList;