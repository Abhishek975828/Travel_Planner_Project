// Generates a short, human-friendly invite code, e.g. "K3F9XZ"
const generateInviteCode = (length = 6) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing chars like 0/O, 1/I
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

module.exports = generateInviteCode;
