import api from "./api";

export const evaluateInterview = async (answers) => {
  const response = await api.post("/evaluation/interview", {
    answers,
  });

  return response.data;
};
