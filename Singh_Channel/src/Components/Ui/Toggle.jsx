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
      // Standardize to blue-600 for consistency, can differentiate later if strictly needed
      return {
        bg: "peer-checked:bg-blue-600",
        ring: "peer-focus:ring-blue-500/30",
        shadow: "peer-checked:shadow-blue-200"
      };
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
          className={`peer h-6 w-11 rounded-full bg-gray-200 transition-all duration-300 ease-in-out after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] hover:bg-gray-300 peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:ring-4 ${styles.ring}`}
        ></div>

        {label && (
          <span className="ml-3 font-medium text-gray-700 select-none">{label}</span>
        )}
      </label>
    );
  }
);

Toggle.displayName = "Toggle";

export default Toggle;
