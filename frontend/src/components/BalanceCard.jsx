// Props:
// - entry: { user: { _id, name, email }, balance: number }
//   positive balance = this person is owed money (green)
//   negative balance = this person owes money (red)
//   zero balance = settled up (neutral)
function BalanceCard({ entry }) {
  const { user, balance } = entry;

  let colorClass = "balance-neutral";
  let statusText = "settled up";

  if (balance > 0) {
    colorClass = "balance-positive";
    statusText = `is owed ₹${balance.toFixed(2)}`;
  } else if (balance < 0) {
    colorClass = "balance-negative";
    statusText = `owes ₹${Math.abs(balance).toFixed(2)}`;
  }

  return (
    <div className="balance-card">
      <span className="balance-name">{user.name}</span>
      <span className={`balance-amount ${colorClass}`}>{statusText}</span>
    </div>
  );
}

export default BalanceCard;