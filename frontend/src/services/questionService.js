import API from "./api";

export const createQuestion = async (data) => {
  const response = await API.post("/questions", data);
  return response.data;
};

export const getQuestions = async (sessionId) => {
  const response = await API.get(`/questions/${sessionId}`);
  return response.data;
};

export const toggleSolved = async (id) => {
  const response = await API.patch(`/questions/${id}/toggle`);
  return response.data;
};

export const deleteQuestion = async (id) => {
  const response = await API.delete(`/questions/${id}`);
  return response.data;
};
