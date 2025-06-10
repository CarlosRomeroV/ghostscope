import React from "react";

type CorduraBarProps = {
  percentage: number;
};

const CorduraBar: React.FC<CorduraBarProps> = ({ percentage }) => {
  return (
    <div className="w-full max-w-xl mt-6">
      <div className="bg-gray-700 h-4 rounded overflow-hidden">
        <div
          className="bg-green-500 h-4 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-sm text-center text-green-300 mt-1">
        Cordura: {percentage}%
      </div>
    </div>
  );
};

export default CorduraBar;