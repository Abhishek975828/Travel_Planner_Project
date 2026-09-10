import { useState, useEffect } from "react";
import {
  getActivities,
  addActivity,
  updateActivity,
  deleteActivity,
} from "../../api/activities";

const emptyForm = {
  day: "",
  title: "",
  time: "",
  notes: "",
  cost: "",
};

function ItineraryTab({ tripId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(emptyForm);

  // Which activity is currently being edited inline (null = none)
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  async function fetchActivities() {
    try {
      const response = await getActivities(tripId);
      setActivities(response.data);
    } catch (err) {
      setError("Could not load the itinerary.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  async function handleAdd(e) {
    e.preventDefault();

    try {
      await addActivity(tripId, {
        ...form,
        day: Number(form.day),
        cost: Number(form.cost) || 0,
      });

      setForm(emptyForm);
      fetchActivities();
    } catch (err) {
      alert(err.response?.data?.message || "Could not add activity.");
    }
  }

  function startEdit(activity) {
    setEditingId(activity._id);

    setEditForm({
      day: activity.day,
      title: activity.title,
      time: activity.time || "",
      notes: activity.notes || "",
      cost: activity.cost || "",
    });
  }

  async function handleSaveEdit(activityId) {
    try {
      await updateActivity(activityId, {
        ...editForm,
        day: Number(editForm.day),
        cost: Number(editForm.cost) || 0,
      });

      setEditingId(null);
      fetchActivities();
    } catch (err) {
      alert(err.response?.data?.message || "Could not update activity.");
    }
  }

  async function handleDelete(activityId) {
    if (!window.confirm("Delete this activity?")) return;

    try {
      await deleteActivity(activityId);
      fetchActivities();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete activity.");
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  // Group activities by day, e.g. { 1: [...], 2: [...] }
  const groupedByDay = activities.reduce((groups, activity) => {
    const day = activity.day;

    if (!groups[day]) {
      groups[day] = [];
    }

    groups[day].push(activity);

    return groups;
  }, {});

  const sortedDays = Object.keys(groupedByDay).sort(
    (a, b) => a - b
  );

  return (
    <div>
      <h3>Add Activity</h3>

      <form
        className="form form-inline"
        onSubmit={handleAdd}
      >
        <input
          type="number"
          placeholder="Day (e.g. 1)"
          min="1"
          value={form.day}
          onChange={(e) =>
            setForm({
              ...form,
              day: e.target.value,
            })
          }
          required
        />

        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
          required
        />

        <input
          placeholder="Time (e.g. 10:00 AM)"
          value={form.time}
          onChange={(e) =>
            setForm({
              ...form,
              time: e.target.value,
            })
          }
        />

        <input
          placeholder="Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({
              ...form,
              notes: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Cost"
          min="0"
          value={form.cost}
          onChange={(e) =>
            setForm({
              ...form,
              cost: e.target.value,
            })
          }
        />

        <button
          type="submit"
          className="btn btn-primary"
        >
          Add
        </button>
      </form>

      {activities.length === 0 && (
        <p>No activities added yet.</p>
      )}

      {sortedDays.map((day) => (
        <div
          key={day}
          className="day-group"
        >
          <h4>Day {day}</h4>

          {groupedByDay[day].map((activity) => (
            <div
              key={activity._id}
              className="list-row"
            >
              {editingId === activity._id ? (
                // ----- Inline edit form -----
                <div className="form form-inline">
                  <input
                    type="number"
                    value={editForm.day}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        day: e.target.value,
                      })
                    }
                  />

                  <input
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        title: e.target.value,
                      })
                    }
                  />

                  <input
                    value={editForm.time}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        time: e.target.value,
                      })
                    }
                  />

                  <input
                    value={editForm.notes}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        notes: e.target.value,
                      })
                    }
                  />

                  <input
                    type="number"
                    value={editForm.cost}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        cost: e.target.value,
                      })
                    }
                  />

                  <button
                    className="btn btn-primary btn-small"
                    onClick={() =>
                      handleSaveEdit(activity._id)
                    }
                  >
                    Save
                  </button>

                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() =>
                      setEditingId(null)
                    }
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                // ----- Normal display -----
                <>
                  <div>
                    <strong>
                      {activity.title}
                    </strong>

                    {activity.time && (
                      <span className="muted">
                        {" "}
                        — {activity.time}
                      </span>
                    )}

                    {activity.notes && (
                      <p className="muted">
                        {activity.notes}
                      </p>
                    )}

                    {activity.cost > 0 && (
                      <p>
                        Cost: ₹{activity.cost}
                      </p>
                    )}
                  </div>

                  <div className="row-actions">
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={() =>
                        startEdit(activity)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-small"
                      onClick={() =>
                        handleDelete(activity._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ItineraryTab;