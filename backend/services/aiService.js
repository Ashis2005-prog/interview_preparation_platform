const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Safe fallback JSON parser
const cleanAndParseJSON = (text) => {
  try {
    if (!text || typeof text !== "string") {
      throw new Error("Empty AI response");
    }

    let cleaned = text.trim();

    // 1. Strip Markdown code fences if present
    cleaned = cleaned
      .replace(/^```json\s*/im, "")
      .replace(/^```\s*/im, "")
      .replace(/\s*```$/m, "")
      .trim();

    // 2. Extract outermost JSON bounds
    const firstBrace = cleaned.indexOf("{");
    const firstBracket = cleaned.indexOf("[");

    let start = -1;
    if (firstBrace === -1) start = firstBracket;
    else if (firstBracket === -1) start = firstBrace;
    else start = Math.min(firstBrace, firstBracket);

    if (start === -1) {
      throw new Error("No JSON object or array found in AI response");
    }

    const lastBrace = cleaned.lastIndexOf("}");
    const lastBracket = cleaned.lastIndexOf("]");
    const end = Math.max(lastBrace, lastBracket);

    if (end === -1 || end <= start) {
      throw new Error("Incomplete JSON returned by AI");
    }

    cleaned = cleaned.substring(start, end + 1);

    // 3. Strip problematic non-printable control characters (retaining valid whitespace \t, \n, \r)
    cleaned = cleaned.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, " ");

    // 4. Parse directly
    try {
      return JSON.parse(cleaned);
    } catch {
      // Fallback: fix unescaped backslashes commonly emitted inside code examples
      const sanitized = cleaned.replace(
        /\\(?!["\\/bfnrtu]|u[0-9a-fA-F]{4})/g,
        "\\\\",
      );
      return JSON.parse(sanitized);
    }
  } catch (error) {
    console.error("❌ Failed to parse AI JSON");
    console.error("Original AI response:\n", text);
    console.error("Parse error:", error.message);
    throw new Error(`AI returned invalid JSON: ${error.message}`);
  }
};

const generateInterviewQuestions = async ({
  company,
  role,
  experience,
  difficulty,
  topics,
}) => {
  const topicList = Array.isArray(topics) ? topics : [];

  if (topicList.length === 0) {
    throw new Error("Please select at least one interview topic.");
  }

  const prompt = `
You are an expert technical interviewer creating a realistic software engineering mock interview.

Candidate Information:
Company: ${company || "General"}
Role: ${role || "Software Developer"}
Experience: ${experience || 0} years
Difficulty: ${difficulty || "Medium"}

Selected Topics:
${topicList.join(", ")}

Generate EXACTLY 5 interview questions.

CRITICAL REQUIREMENTS:
1. Every question MUST be completely answerable using only the information provided.
2. Questions must be directly related to the selected topics.
3. Realistic for a software engineering interview; no vague prompts.
4. Provide a variety of types: Conceptual, Practical, Debugging, Problem Solving.
5. For DSA questions: Include problem description, inputs, outputs, examples, and constraints.
6. For SQL/DBMS: Include table schemas and sample data.
7. For Debugging: Provide the complete code snippet.
8. Return ONLY raw JSON adhering strictly to the schema below.

Output schema:
{
  "questions": [
    {
      "question": "string",
      "topic": "string",
      "difficulty": "Easy | Medium | Hard",
      "type": "Conceptual | Practical | Debugging | Problem Solving",
      "expectedAnswer": "string",
      "keyPoints": ["string"],
      "evaluationCriteria": ["string"]
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash", // Use a valid production model
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("AI returned an empty response.");
  }

  const parsed = cleanAndParseJSON(text);

  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error("Invalid AI question response.");
  }

  if (parsed.questions.length !== 5) {
    throw new Error("AI did not generate exactly 5 questions.");
  }

  return {
    company: company || "",
    role: role || "",
    experience: experience || 0,
    difficulty: difficulty || "Medium",
    questions: parsed.questions,
  };
};

// ==========================================
// GENERATE PRACTICE MCQs
// ==========================================

const generatePracticeQuestions = async ({ subject, difficulty, count }) => {
  try {
    const safeCount = Math.min(Math.max(Number(count) || 10, 5), 20);

    const prompt = `
You are an expert technical interview question generator.

Generate exactly ${safeCount} multiple-choice questions for:
Subject: ${subject}
Difficulty: ${difficulty}

Requirements:
1. Questions must be technically correct with exactly 4 options.
2. Only ONE option must be correct.
3. No ambiguous or repeated questions.
4. "answer" must be the zero-based index of the correct option (0, 1, 2, or 3).
5. Return ONLY raw JSON.

Output schema:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": 0,
      "explanation": "string"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash", // Use a valid production model
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    const parsed = cleanAndParseJSON(text);

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Invalid question format returned by AI");
    }

    const questions = parsed.questions
      .filter(
        (q) =>
          q.question &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          Number.isInteger(q.answer) &&
          q.answer >= 0 &&
          q.answer <= 3,
      )
      .slice(0, safeCount);

    if (questions.length === 0) {
      throw new Error("AI did not generate valid questions");
    }

    return { questions };
  } catch (error) {
    console.error("Practice question generation error:", error);
    throw error;
  }
};

module.exports = {
  generateInterviewQuestions,
  generatePracticeQuestions,
};
