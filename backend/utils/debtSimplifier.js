// Takes a list of { userId, balance } (positive = is owed, negative = owes)
// and returns the minimum number of transactions needed to settle everyone up.
//
// Greedy approach: repeatedly match the person who owes the MOST
// with the person who is owed the MOST, settle as much of that pair
// as possible, then repeat until everyone is at (near) zero.
const simplifyDebts = (balances) => {
  const EPSILON = 0.01; // ignore amounts smaller than 1 paisa/cent

  // Work on a copy so we don't mutate the caller's data
  const people = balances
    .map((b) => ({ userId: b.userId, balance: Math.round(b.balance * 100) / 100 }))
    .filter((b) => Math.abs(b.balance) > EPSILON);

  const transactions = [];

  while (true) {
    // Find the biggest debtor (most negative) and biggest creditor (most positive)
    let debtor = null;
    let creditor = null;

    people.forEach((p) => {
      if (p.balance < 0 && (!debtor || p.balance < debtor.balance)) debtor = p;
      if (p.balance > 0 && (!creditor || p.balance > creditor.balance)) creditor = p;
    });

    // Nothing left to settle
    if (!debtor || !creditor) break;

    const amount = Math.min(-debtor.balance, creditor.balance);
    const roundedAmount = Math.round(amount * 100) / 100;

    if (roundedAmount <= EPSILON) break;

    transactions.push({
      from: debtor.userId,
      to: creditor.userId,
      amount: roundedAmount,
    });

    debtor.balance = Math.round((debtor.balance + roundedAmount) * 100) / 100;
    creditor.balance = Math.round((creditor.balance - roundedAmount) * 100) / 100;
  }

  return transactions;
};

module.exports = { simplifyDebts };