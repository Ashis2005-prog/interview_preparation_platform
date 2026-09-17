import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Briefcase,
  Calendar,
  Trash2,
  Eye,
  Pencil,
  FileQuestion,
} from "lucide-react";

const SessionCard = ({ session, onDelete }) => {
  const badgeColor = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{session.title}</h2>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            badgeColor[session.difficulty]
          }`}
        >
          {session.difficulty}
        </span>
      </div>

      {/* Details */}
      <div className="mt-5 space-y-3 text-gray-600">
        <p className="flex items-center gap-2">
          <Building2 size={18} />
          {session.company}
        </p>

        <p className="flex items-center gap-2">
          <Briefcase size={18} />
          {session.role}
        </p>

        <p className="flex items-center gap-2">
          <Calendar size={18} />
          {new Date(session.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Topics */}
      <div className="mt-5 flex flex-wrap gap-2">
        {session.topics?.map((topic) => (
          <span
            key={topic}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
          >
            {topic}
          </span>
        ))}
      </div>

      {/* Status */}
      <div className="mt-5">
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            session.status === "Completed"
              ? "bg-green-100 text-green-700"
              : session.status === "In Progress"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
          }`}
        >
          {session.status}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          to={`/sessions/${session._id}`}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          <Eye size={18} />
          View
        </Link>

        <Link
          to={`/sessions/${session._id}/edit`}
          className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg"
        >
          <Pencil size={18} />
          Edit
        </Link>

        <Link
          to={`/sessions/${session._id}/questions`}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
        >
          <FileQuestion size={18} />
          Questions
        </Link>

        <button
          onClick={() => onDelete(session._id)}
          className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default SessionCard;
