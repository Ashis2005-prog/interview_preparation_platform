const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.6-flash",
});

const generateInterviewQuestions = async ({
  company,
  role,
  experience,
  difficulty,
  topics,
}) => {
  const prompt = `
Generate 10 interview questions.

Company: ${company}
Role: ${role}
Experience: ${experience}
Difficulty: ${difficulty}

Topics:
${topics.join(",")}

Return ONLY JSON.

Example:

[
{
"question":"Explain React Virtual DOM",
"topic":"React",
"difficulty":"Medium"
}
]
`;

  const result = await model.generateContent(prompt);

  const text = result.response.text();

  return JSON.parse(text.replace(/```json/g, "").replace(/```/g, ""));
};

module.exports = {
  generateInterviewQuestions,
};
