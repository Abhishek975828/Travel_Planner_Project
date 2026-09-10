// Splits `amount` equally among the given userIds.
// Handles paise/cent remainders so the split always sums exactly to `amount`
// (extra 0.01 units go to the first few people in the list).
const calculateEqualSplit = (amount, userIds) => {
  const count = userIds.length;
  const baseShare = Math.floor((amount / count) * 100) / 100; // round down to 2 decimals
  const totalRounded = Math.round(baseShare * count * 100) / 100;
  let remainder = Math.round((amount - totalRounded) * 100); // in paise/cents, as an integer

  return userIds.map((userId) => {
    let share = baseShare;
    if (remainder > 0) {
      share = Math.round((share + 0.01) * 100) / 100;
      remainder -= 1;
    }
    return { user: userId, amount: share };
  });
};

// Validates that a manually-provided unequal split sums up to `amount`.
// `splits` should look like: [{ user, amount }, ...]
// Returns { valid: true } or { valid: false, message }
const validateUnequalSplit = (amount, splits) => {
  if (!Array.isArray(splits) || splits.length === 0) {
    return { valid: false, message: "Splits array is required for unequal split" };
  }

  const total = splits.reduce((sum, s) => sum + Number(s.amount || 0), 0);
  const diff = Math.abs(total - amount);

  // Allow a tiny tolerance for floating point rounding
  if (diff > 0.01) {
    return {
      valid: false,
      message: `Split amounts (${total}) must add up to the total expense amount (${amount})`,
    };
  }

  return { valid: true };
};

module.exports = { calculateEqualSplit, validateUnequalSplit };