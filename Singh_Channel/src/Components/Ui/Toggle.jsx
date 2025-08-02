import React, { forwardRef } from "react";

const Toggle = forwardRef(({ id, checked, onChange, label, className = "", ...props }, ref) => {
  return (
    <label
      htmlFor={id || props.name}
      className={`relative inline-flex cursor-pointer items-center ${className}`}
    >
      <input
        id={id || props.name}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
        ref={ref}
        {...props}
      />
      <div className="peer h-6 w-11 rounded-full bg-gray-300 transition-colors duration-300 peer-checked:bg-blue-600"></div>
      <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-300 peer-checked:translate-x-5"></div>
      {label && <span className="ml-3 font-medium text-gray-700">{label}</span>}
    </label>
  );
});

export default Toggle;
