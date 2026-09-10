import api from "./axios";

export const createTrip = (data) => api.post("/trips", data);

export const joinTrip = (inviteCode) => api.post("/trips/join", { inviteCode });

export const getMyTrips = () => api.get("/trips");

export const getTripById = (tripId) => api.get(`/trips/${tripId}`);

export const removeMember = (tripId, userId) =>
  api.delete(`/trips/${tripId}/members/${userId}`);