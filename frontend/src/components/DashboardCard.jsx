import React from "react";

const DashboardCard = ({ title, value, subtitle, icon, color }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <h2 className="text-3xl font-bold mt-2">{value}</h2>

          <p className="text-sm text-green-600 mt-2">{subtitle}</p>
        </div>

        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-white ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
