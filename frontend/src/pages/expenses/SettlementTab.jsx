import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  getSettlementSuggestions,
  getSettlementHistory,
  recordSettlement,
} from "../../api/expenses";

function SettlementTab({ tripId }) {
  const { user } = useContext(AuthContext);

  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchData() {
    try {
      const [suggestionsRes, historyRes] = await Promise.all([
        getSettlementSuggestions(tripId),
        getSettlementHistory(tripId),
      ]);
      setSuggestions(suggestionsRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      setError("Could not load settlements.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  async function handleMarkSettled(toUserId, amount) {
    if (!window.confirm(`Confirm you paid ₹${amount}?`)) return;
    try {
      await recordSettlement(tripId, toUserId, amount);
      fetchData(); // refresh both suggestions and history
    } catch (err) {
      alert(err.response?.data?.message || "Could not record settlement.");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div>
      <h3>Suggested Settlements</h3>
      {suggestions.length === 0 && <p>Everyone is settled up!</p>}

      {suggestions.map((s, index) => {
        // Only the person who owes money ("from") can confirm they paid
        const canConfirm = s.from._id === user?._id;

        return (
          <div key={index} className="list-row">
            <span>
              {s.from.name} owes {s.to.name} ₹{s.amount}
            </span>
            {canConfirm && (
              <button
                className="btn btn-primary btn-small"
                onClick={() => handleMarkSettled(s.to._id, s.amount)}
              >
                Mark as Settled
              </button>
            )}
          </div>
        );
      })}

      <h3>Settlement History</h3>
      {history.length === 0 && <p>No settlements recorded yet.</p>}

      {history.map((record) => (
        <div key={record._id} className="list-row">
          <span>
            {record.from.name} paid {record.to.name} ₹{record.amount} on{" "}
            {new Date(record.settledAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default SettlementTab;