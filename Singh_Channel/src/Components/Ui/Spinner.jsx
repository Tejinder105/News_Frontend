import React from "react";

function Spinner() {
  return (
    <div className="flex min-h-screen  items-center justify-center bg-white">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
}

export default Spinner;
