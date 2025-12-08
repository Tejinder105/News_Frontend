import React from "react";

const SectionHeading = ({
  title,
  color = "blue",
  animated = false,
  size = "lg",
  showLine = true,
  icon = null,
  className = "",
  children,
  ...props
}) => {
  const colorStyles = {
    red: {
      dot: "bg-red-600",
      line: "bg-red-600",
      text: "text-gray-900",
    },
    blue: {
      dot: "bg-blue-600",
      line: "bg-blue-600",
      text: "text-gray-900",
    },
    green: {
      dot: "bg-green-600",
      line: "bg-green-600",
      text: "text-gray-900",
    },
    purple: {
      dot: "bg-purple-600",
      line: "bg-purple-600",
      text: "text-gray-900",
    },
    gray: {
      dot: "bg-gray-600",
      line: "bg-gray-600",
      text: "text-gray-900",
    },
    indigo: {
      dot: "bg-indigo-600",
      line: "bg-indigo-600",
      text: "text-gray-900",
    },
  };

  // Size variants
  const sizeStyles = {
    sm: {
      title: "text-base font-bold",
      dot: "h-1.5 w-1.5",
      gap: "gap-1.5",
      line: "h-px mt-0.5 ml-3",
    },
    md: {
      title: "text-lg font-bold",
      dot: "h-2 w-2",
      gap: "gap-2",
      line: "h-px mt-1 ml-3",
    },
    lg: {
      title: "text-lg font-bold sm:text-xl",
      dot: "h-2 w-2",
      gap: "gap-2",
      line: "h-px mt-1 ml-4",
    },
    xl: {
      title: "text-xl font-bold sm:text-2xl",
      dot: "h-2.5 w-2.5",
      gap: "gap-2.5",
      line: "h-px mt-1.5 ml-4",
    },
  };

  const currentColor = colorStyles[color] || colorStyles.blue;
  const currentSize = sizeStyles[size] || sizeStyles.lg;

  const dotClasses = [
    currentSize.dot,
    "rounded-full",
    currentColor.dot,
    animated ? "animate-pulse" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const titleClasses = [
    currentSize.title,
    currentColor.text,
  ]
    .filter(Boolean)
    .join(" ");

  const containerClasses = [
    "flex items-baseline",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses} {...props}>
      <h2 className={`flex items-center ${currentSize.gap} ${titleClasses}`}>
        {icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : (
          <div className={dotClasses} />
        )}
        {title}
        {children}
      </h2>
      {showLine && (
        <div className={`${currentSize.line} flex-1 ${currentColor.line}`} />
      )}
    </div>
  );
};

export default SectionHeading;
