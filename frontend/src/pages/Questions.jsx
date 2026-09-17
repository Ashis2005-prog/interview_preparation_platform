import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import QuestionForm from "../components/QuestionForm";
import QuestionCard from "../components/QuestionCard";

import {
  createQuestion,
  getQuestions,
  toggleSolved,
  deleteQuestion,
} from "../services/questionService";

const Questions = () => {
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);

  const loadQuestions = async () => {
    try {
      const data = await getQuestions(id);
      setQuestions(data.questions);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [id]);

  const addQuestion = async (data) => {
    await createQuestion(data);
    loadQuestions();
  };

  const toggle = async (questionId) => {
    await toggleSolved(questionId);
    loadQuestions();
  };

  const remove = async (questionId) => {
    if (window.confirm("Delete this question?")) {
      await deleteQuestion(questionId);
      loadQuestions();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Interview Questions</h1>

          <QuestionForm sessionId={id} onSubmit={addQuestion} />

          <div className="mt-8 grid gap-6">
            {questions.map((question) => (
              <QuestionCard
                key={question._id}
                question={question}
                onToggle={toggle}
                onDelete={remove}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Questions;
