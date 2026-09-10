import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinTrip } from "../../api/trips";

function JoinTrip() {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await joinTrip(inviteCode.trim());
      navigate(`/trips/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid invite code.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-page">
      <h2>Join Trip</h2>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Invite Code
          <input
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="e.g. AB12CD"
            required
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Joining..." : "Join Trip"}
        </button>
      </form>
    </div>
  );
}

export default JoinTrip;