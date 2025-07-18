import React from "react";

function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative h-5 w-5">
        <div className="absolute h-full w-full rounded-full border-3 border-gray-200/50"></div>
        <div className="absolute h-full w-full animate-spin rounded-full border-3 border-transparent border-t-white border-r-white"></div>
      </div>
    </div>
  );
}

export default Spinner;