const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const cleanAndParseJSON = (text) => {
  const cleanedText = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanedText);
};

const evaluateInterview = async (answers) => {
  const formattedAnswers = answers
    .map(
      (item, index) => `
====================================
QUESTION ${index + 1}

Topic: ${item.topic}
Difficulty: ${item.difficulty}
Type: ${item.type}

QUESTION:
${item.question}

REFERENCE ANSWER:
${item.expectedAnswer || "Not provided"}

KEY CONCEPTS EXPECTED:
${
  item.keyPoints?.length
    ? item.keyPoints.map((point) => `- ${point}`).join("\n")
    : "Not provided"
}

EVALUATION CRITERIA:
${
  item.evaluationCriteria?.length
    ? item.evaluationCriteria.map((criterion) => `- ${criterion}`).join("\n")
    : "Not provided"
}

CANDIDATE ANSWER:
${item.answer || "No answer provided"}
====================================
`,
    )
    .join("\n");

  const prompt = `
You are a fair and experienced technical interviewer.

Evaluate each candidate answer using the provided:

1. Question
2. Reference Answer
3. Key Concepts
4. Evaluation Criteria

IMPORTANT EVALUATION RULES:

1. Do NOT require the candidate to use the exact same wording as the reference answer.

2. If the candidate gives a technically correct answer using a different approach or wording, consider it correct.

3. Evaluate understanding, not exact text matching.

4. A partially correct answer should receive partial credit.

5. Do not mark an answer incorrect simply because it is shorter than the reference answer.

6. For coding or DSA questions:
   - Evaluate the algorithmic approach.
   - Check logical correctness.
   - Consider time and space complexity when relevant.
   - Accept alternative correct solutions.

7. For conceptual questions:
   - Evaluate whether the important concepts are correctly explained.

8. Empty answers should receive a score of 0.

9. Be strict but fair.

10. Score each question from 0 to 10.

INTERVIEW DATA:

${formattedAnswers}

Return ONLY valid JSON.

Use EXACTLY this structure:

{
  "overallScore": 7.5,

  "questionEvaluations": [
    {
      "questionNumber": 1,
      "score": 8,
      "isCorrect": true,
      "feedback": "Explanation of why the answer is correct or partially correct.",
      "strengths": [
        "Correct concept identified"
      ],
      "improvements": [
        "Could explain complexity more clearly"
      ]
    }
  ],

  "strengths": [
    "Overall strength 1",
    "Overall strength 2"
  ],

  "weaknesses": [
    "Overall weakness 1",
    "Overall weakness 2"
  ],

  "improvements": [
    "Recommended improvement 1",
    "Recommended improvement 2"
  ],

  "feedback": "Detailed overall interview feedback."
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  const text = response.text;

  if (!text) {
    throw new Error("AI returned an empty evaluation.");
  }

  const evaluation = cleanAndParseJSON(text);

  if (
    typeof evaluation.overallScore !== "number" ||
    !Array.isArray(evaluation.questionEvaluations)
  ) {
    throw new Error("Invalid AI evaluation response.");
  }

  return evaluation;
};

module.exports = {
  evaluateInterview,
};
