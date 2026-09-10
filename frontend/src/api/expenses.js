import api from "./axios";

// ----- Expenses -----

// GET /trips/:id/expenses -> all expenses for a trip
export const getExpenses = (tripId) => api.get(`/trips/${tripId}/expenses`);

// POST /trips/:id/expenses -> create an expense (equal or unequal split)
export const createExpense = (tripId, data) =>
  api.post(`/trips/${tripId}/expenses`, data);

// PUT /expenses/:expenseId -> update an expense
export const updateExpense = (expenseId, data) =>
  api.put(`/expenses/${expenseId}`, data);

// DELETE /expenses/:expenseId -> delete an expense
export const deleteExpense = (expenseId) => api.delete(`/expenses/${expenseId}`);

// ----- Balances -----

// GET /trips/:id/balances -> [{ user, balance }, ...]
// positive balance = this person is owed money, negative = they owe money
export const getBalances = (tripId) => api.get(`/trips/${tripId}/balances`);

// ----- Settlements -----

// GET /trips/:id/settlements/suggestions -> minimum set of payments to settle up
export const getSettlementSuggestions = (tripId) =>
  api.get(`/trips/${tripId}/settlements/suggestions`);

// GET /trips/:id/settlements -> history of recorded payments
export const getSettlementHistory = (tripId) =>
  api.get(`/trips/${tripId}/settlements`);

// POST /trips/:id/settlements -> logged-in user records that they paid `to`
export const recordSettlement = (tripId, to, amount) =>
  api.post(`/trips/${tripId}/settlements`, { to, amount });