import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { createExpense } from "../../api/expenses";

// Props:
// - tripId
// - members: trip.members array ({ user: {_id,name,email}, joinedAt })
// - onAdded: called after a successful submit, so the parent can refresh the list
function AddExpense({ tripId, members, onAdded }) {
  const { user } = useContext(AuthContext);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [paidBy, setPaidBy] = useState(user?._id || "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // For "equal" split: which members are included (default: everyone)
  const [includedMembers, setIncludedMembers] = useState(
    members.map((m) => m.user._id)
  );

  // For "unequal" split: each member's own share amount, keyed by userId
  const [unequalShares, setUnequalShares] = useState(
    Object.fromEntries(members.map((m) => [m.user._id, ""]))
  );

  function toggleIncluded(userId) {
    setIncludedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  function handleUnequalChange(userId, value) {
    setUnequalShares((prev) => ({ ...prev, [userId]: value }));
  }

  // Sum of all the unequal share inputs, used to show a running total
  const unequalTotal = Object.values(unequalShares).reduce(
    (sum, val) => sum + (Number(val) || 0),
    0
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    let body = { description, amount: numericAmount, splitType, paidBy };

    if (splitType === "equal") {
      if (includedMembers.length === 0) {
        setError("Select at least one member to split between.");
        return;
      }
      body.splitBetween = includedMembers;
    } else {
      // unequal: build the splits array and check it sums to the total
      const splits = members
        .map((m) => ({ user: m.user._id, amount: Number(unequalShares[m.user._id]) || 0 }))
        .filter((s) => s.amount > 0);

      const sum = splits.reduce((total, s) => total + s.amount, 0);
      if (Math.abs(sum - numericAmount) > 0.01) {
        setError(`Shares (₹${sum}) must add up to the total amount (₹${numericAmount}).`);
        return;
      }
      body.splits = splits;
    }

    setSubmitting(true);
    try {
      await createExpense(tripId, body);
      onAdded();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add expense.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form add-expense-form" onSubmit={handleSubmit}>
      <label>
        Description
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>

      <label>
        Amount (₹)
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </label>

      <label>
        Paid By
        <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
          {members.map((m) => (
            <option key={m.user._id} value={m.user._id}>
              {m.user.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Split Type
        <select value={splitType} onChange={(e) => setSplitType(e.target.value)}>
          <option value="equal">Equal</option>
          <option value="unequal">Unequal</option>
        </select>
      </label>

      {splitType === "equal" && (
        <div>
          <p>Split between:</p>
          {members.map((m) => (
            <label key={m.user._id} className="checkbox-label">
              <input
                type="checkbox"
                checked={includedMembers.includes(m.user._id)}
                onChange={() => toggleIncluded(m.user._id)}
              />
              {m.user.name}
            </label>
          ))}
        </div>
      )}

      {splitType === "unequal" && (
        <div>
          <p>Enter each person's share:</p>
          {members.map((m) => (
            <label key={m.user._id} className="unequal-share-row">
              {m.user.name}
              <input
                type="number"
                min="0"
                value={unequalShares[m.user._id]}
                onChange={(e) => handleUnequalChange(m.user._id, e.target.value)}
              />
            </label>
          ))}
          <p className="muted">
            Running total: ₹{unequalTotal} / ₹{amount || 0}
          </p>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
}

export default AddExpense;