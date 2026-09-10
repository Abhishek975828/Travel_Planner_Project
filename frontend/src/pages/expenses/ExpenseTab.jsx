import { useState, useEffect } from "react";
import { getExpenses, deleteExpense, getBalances } from "../../api/expenses";
import BalanceCard from "../../components/BalanceCard";
import AddExpense from "./AddExpense";

// Props:
// - tripId: the trip this tab belongs to
// - members: trip.members array ({ user: {_id,name,email}, joinedAt }),
//   passed down from TripDetails so AddExpense can build its member pickers
function ExpenseTab({ tripId, members }) {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  async function fetchData() {
    try {
      const [expensesRes, balancesRes] = await Promise.all([
        getExpenses(tripId),
        getBalances(tripId),
      ]);
      setExpenses(expensesRes.data);
      setBalances(balancesRes.data);
    } catch (err) {
      setError("Could not load expenses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  async function handleDelete(expenseId) {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await deleteExpense(expenseId);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete expense.");
    }
  }

  function handleExpenseAdded() {
    setShowAddForm(false);
    fetchData();
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h3>Expenses</h3>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "Add Expense"}
        </button>
      </div>

      {showAddForm && (
        <AddExpense tripId={tripId} members={members} onAdded={handleExpenseAdded} />
      )}

      {expenses.length === 0 && <p>No expenses added yet.</p>}

      {expenses.map((expense) => (
        <div key={expense._id} className="list-row">
          <div>
            <strong>{expense.description}</strong> — ₹{expense.amount}
            <p className="muted">
              Paid by {expense.paidBy.name} • {expense.splitType} split
            </p>
            <p className="muted">
              Split among:{" "}
              {expense.splitAmong
                .map((s) => `${s.user.name} (₹${s.amount})`)
                .join(", ")}
            </p>
          </div>
          <div className="row-actions">
            <button
              className="btn btn-danger btn-small"
              onClick={() => handleDelete(expense._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <h3>Balances</h3>
      {balances.map((entry) => (
        <BalanceCard key={entry.user._id} entry={entry} />
      ))}
    </div>
  );
}

export default ExpenseTab;