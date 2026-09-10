import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTrip } from "../../api/trips";

function CreateTrip() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // After creation we show the invite code first (instead of navigating
  // straight away) so the user has a chance to copy/share it.
  const [createdTrip, setCreatedTrip] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await createTrip({ title, destination, startDate, endDate });
      setCreatedTrip(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create trip.");
    } finally {
      setSubmitting(false);
    }
  }

  // Step 2: trip was created, show the invite code before moving on.
  if (createdTrip) {
    return (
      <div className="form-page">
        <h2>Trip Created!</h2>
        <p>Share this invite code with the people joining your trip:</p>
        <div className="invite-code-box">{createdTrip.inviteCode}</div>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/trips/${createdTrip._id}`)}
        >
          Go to Trip
        </button>
      </div>
    );
  }

  return (
    <div className="form-page">
      <h2>Create Trip</h2>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>

        <label>
          Destination
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </label>

        <label>
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>

        <label>
          End Date
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Creating..." : "Create Trip"}
        </button>
      </form>
    </div>
  );
}

export default CreateTrip;