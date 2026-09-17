import API from "./api";

export const createSession = async (sessionData) => {
  const response = await API.post("/sessions", sessionData);
  return response.data;
};

export const getSessions = async () => {
  const response = await API.get("/sessions");
  return response.data;
};

export const getSessionById = async (id) => {
  const response = await API.get(`/sessions/${id}`);
  return response.data;
};

export const updateSession = async (id, data) => {
  const response = await API.put(`/sessions/${id}`, data);
  return response.data;
};

export const deleteSession = async (id) => {
  const response = await API.delete(`/sessions/${id}`);
  return response.data;
};
