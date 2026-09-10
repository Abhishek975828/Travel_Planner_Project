// Props:
// - members: array of { user: { _id, name, email }, joinedAt }
// - createdBy: the trip creator's user id (string)
// - currentUserId: the logged-in user's id (string)
// - onRemove: optional function(userId) called when "Remove" is clicked
function MemberList({ members, createdBy, currentUserId, onRemove }) {
  const isCreator = currentUserId === createdBy;

  return (
    <ul className="member-list">
      {members.map((member) => {
        const memberId = member.user._id;
        const isThisMemberCreator = memberId === createdBy;

        return (
          <li key={memberId} className="member-row">
            <span>
              {member.user.name}
              {isThisMemberCreator && <span className="badge"> (creator)</span>}
            </span>

            {/* Only the creator sees Remove buttons, and never for themself */}
            {isCreator && !isThisMemberCreator && onRemove && (
              <button
                className="btn btn-danger btn-small"
                onClick={() => onRemove(memberId)}
              >
                Remove
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default MemberList;