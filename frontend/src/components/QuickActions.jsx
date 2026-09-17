import React from "react";
import { PlusCircle, BrainCircuit, FileText, BarChart3 } from "lucide-react";

const actions = [
  {
    title: "Create Session",
    icon: <PlusCircle size={30} />,
  },
  {
    title: "AI Interview",
    icon: <BrainCircuit size={30} />,
  },
  {
    title: "Practice",
    icon: <FileText size={30} />,
  },
  {
    title: "Progress",
    icon: <BarChart3 size={30} />,
  },
];

const QuickActions = () => {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {actions.map((item) => (
        <button
          key={item.title}
          className="bg-white rounded-2xl p-8 shadow hover:shadow-xl transition text-center"
        >
          <div className="flex justify-center text-blue-600">{item.icon}</div>

          <p className="mt-4 font-semibold">{item.title}</p>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
