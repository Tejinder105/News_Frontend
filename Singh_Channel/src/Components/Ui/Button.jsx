import React from "react";

function Button({
    children,
    type = "button",
    bgColor = "bg-white/10",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
    

        <button
            className={`${bgColor} backdrop-blur-md flex items-center gap-1.5 border border-white/20 ${textColor} rounded-md px-4 py-1 text-base font-semibold transition-all duration-300 hover:bg-white/10`}
            >
            {children}
        </button>
        
    );
}

export default Button;
