import React, { forwardRef } from "react";

const Toggle = forwardRef(
  (
    {
      id,
      checked,
      onChange,
      label,
      className = "",
      variant = "default",
      ...props
    },
    ref
  ) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "featured":
          return {
            bg: "peer-checked:bg-blue-600 peer-checked:shadow-blue-200",
            ring: "peer-focus:ring-blue-300",
          };
        case "breaking":
          return {
            bg: "peer-checked:bg-blue-700 peer-checked:shadow-blue-300",
            ring: "peer-focus:ring-blue-400",
          };
        default:
          return {
            bg: "peer-checked:bg-blue-600 peer-checked:shadow-blue-200",
            ring: "peer-focus:ring-blue-300",
          };
      }
    };

    const styles = getVariantStyles();

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
        <div
          className={`peer peer-focus:ring-opacity-50 h-7 w-12 rounded-full bg-gray-300 shadow-inner transition-all duration-300 ease-in-out peer-checked:shadow-lg peer-focus:ring-4 ${styles.bg} ${styles.ring}`}
        ></div>
        <div className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out peer-checked:translate-x-5 peer-checked:shadow-lg"></div>
        {label && (
          <span className="ml-3 font-medium text-gray-700">{label}</span>
        )}
      </label>
    );
  }
);

Toggle.displayName = "Toggle";

export default Toggle;
