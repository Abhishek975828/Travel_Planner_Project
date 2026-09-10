import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { getTripById, removeMember } from "../../api/trips";
import { AuthContext } from "../../context/AuthContext";
import MemberList from "../../components/MemberList";
import ItineraryTab from "../itinerary/ItineraryTab";
import ExpenseTab from "../expenses/ExpenseTab";
import SettlementTab from "../expenses/SettlementTab";
import ChatTab from "../chat/ChatTab";

function TripDetails() {
  const { id: tripId } = useParams();
  const { user } = useContext(AuthContext);

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [activeTab, setActiveTab] = useState("itinerary");

  async function fetchTrip() {
    try {
      const response = await getTripById(tripId);
      setTrip(response.data);
    } catch (err) {
      setError("Could not load this trip.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  async function handleRemoveMember(userId) {
    if (!window.confirm("Remove this member from the trip?")) return;

    try {
      await removeMember(tripId, userId);
      fetchTrip();
    } catch (err) {
      alert(err.response?.data?.message || "Could not remove member.");
    }
  }

  function handleCopyInviteCode() {
    navigator.clipboard.writeText(trip.inviteCode);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getTripStatus() {
    const today = new Date();
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

    if (historicalPlaces.some((placeName) => place.includes(placeName))) {
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

  if (loading) {
    return (
      <div className="trip-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading your trip...</p>
      </div>
    );
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (!trip) {
    return null;
  }

  const status = getTripStatus();

  return (
    <div className="trip-details-page">

      {/* =========================
          TRIP HERO
      ========================= */}

      <div
        className="trip-details-hero"
        style={{
          backgroundImage: `url("${getTripImage(trip.destination)}")`,
        }}
      >
        <div className="trip-details-hero-overlay"></div>

        <div className="trip-details-hero-content">
          <span className={`trip-details-status ${status.toLowerCase()}`}>
            {status}
          </span>

          <h1>{trip.title}</h1>

          <div className="trip-details-location">
            <span>📍</span>
            <span>{trip.destination}</span>
          </div>

          <div className="trip-details-date">
            <span>📅</span>
            <span>
              {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
            </span>
          </div>
        </div>
      </div>

      {/* =========================
          INVITE + MEMBERS
      ========================= */}

      <div className="trip-details-info-grid">

        <div className="trip-info-card invite-card">
          <div className="trip-info-card-icon">🔑</div>

          <div className="trip-info-card-content">
            <span className="trip-info-label">INVITE CODE</span>

            <div className="invite-code-modern">
              <strong>{trip.inviteCode}</strong>

              <button
                className="invite-copy-btn"
                onClick={handleCopyInviteCode}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>

            <p>Share this code with friends to join this trip.</p>
          </div>
        </div>

        <div className="trip-info-card members-card">
          <div className="trip-info-card-icon">👥</div>

          <div className="trip-info-card-content">
            <span className="trip-info-label">TRAVELERS</span>

            <strong className="member-count">
              {trip.members?.length || 0}{" "}
              {trip.members?.length === 1 ? "Member" : "Members"}
            </strong>

            <p>People traveling together</p>
          </div>
        </div>
      </div>

      {/* =========================
          MEMBERS
      ========================= */}

      <div className="trip-members-section">
        <div className="trip-section-heading">
          <div>
            <span className="trip-section-label">TRAVEL GROUP</span>
            <h2>Trip Members</h2>
          </div>

          <span className="members-total">
            {trip.members?.length || 0}{" "}
            {trip.members?.length === 1 ? "traveler" : "travelers"}
          </span>
        </div>

        <div className="trip-members-card">
          <MemberList
            members={trip.members}
            createdBy={trip.createdBy}
            currentUserId={user?._id}
            onRemove={handleRemoveMember}
          />
        </div>
      </div>

      {/* =========================
          TABS
      ========================= */}

      <div className="trip-tabs-section">
        <div className="trip-tabs-header">
          <span className="trip-section-label">TRIP MANAGEMENT</span>
          <h2>Manage Your Trip</h2>
        </div>

        <div className="tab-buttons modern-trip-tabs">

          <button
            className={`btn tab-btn ${
              activeTab === "itinerary" ? "tab-btn-active" : ""
            }`}
            onClick={() => setActiveTab("itinerary")}
          >
            <span>📋</span>
            <span>Itinerary</span>
          </button>

          <button
            className={`btn tab-btn ${
              activeTab === "expenses" ? "tab-btn-active" : ""
            }`}
            onClick={() => setActiveTab("expenses")}
          >
            <span>💰</span>
            <span>Expenses & Balances</span>
          </button>

          <button
            className={`btn tab-btn ${
              activeTab === "settlements" ? "tab-btn-active" : ""
            }`}
            onClick={() => setActiveTab("settlements")}
          >
            <span>🤝</span>
            <span>Settlements</span>
          </button>

          <button
            className={`btn tab-btn ${
              activeTab === "chat" ? "tab-btn-active" : ""
            }`}
            onClick={() => setActiveTab("chat")}
          >
            <span>💬</span>
            <span>Chat</span>
          </button>

        </div>

        <div className="tab-content trip-tab-content">

          {activeTab === "itinerary" && (
            <ItineraryTab tripId={tripId} />
          )}

          {activeTab === "expenses" && (
            <ExpenseTab
              tripId={tripId}
              members={trip.members}
            />
          )}

          {activeTab === "settlements" && (
            <SettlementTab tripId={tripId} />
          )}

          {activeTab === "chat" && (
            <ChatTab tripId={tripId} />
          )}

        </div>
      </div>
    </div>
  );
}

export default TripDetails;
