import api from "./axios";

export const getActivities = (tripId) => api.get(`/trips/${tripId}/activities`);

export const addActivity = (tripId, data) =>
  api.post(`/trips/${tripId}/activities`, data);

export const updateActivity = (activityId, data) =>
  api.put(`/activities/${activityId}`, data);

export const deleteActivity = (activityId) =>
  api.delete(`/activities/${activityId}`);