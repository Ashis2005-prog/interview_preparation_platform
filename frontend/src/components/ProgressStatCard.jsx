import React from "react";

const ProgressStatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">{value}</h2>

          {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
        </div>

        <div className={`${iconBg} ${iconColor} p-4 rounded-2xl`}>
          {Icon && <Icon size={26} />}
        </div>
      </div>
    </div>
  );
};

export default ProgressStatCard;
