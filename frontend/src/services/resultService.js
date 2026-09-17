import api from "./api";

export const saveInterviewResult = async (resultData) => {
  const response = await api.post("/results", resultData);

  return response.data;
};

export const getInterviewResults = async () => {
  const response = await api.get("/results");

  return response.data;
};

export const getInterviewResult = async (id) => {
  const response = await api.get(`/results/${id}`);

  return response.data;
};

export const deleteInterviewResult = async (id) => {
  const response = await api.delete(`/results/${id}`);

  return response.data;
};
