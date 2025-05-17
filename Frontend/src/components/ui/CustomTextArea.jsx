import React, { forwardRef } from "react";

const CustomTextArea = forwardRef(
  ({ label, placeholder, error, rows, ...props }, ref) => {
    return (
      <div className="relative">
        {label && <label className="text-gray-600 block mb-1.5">{label}</label>}
        <textarea
          ref={ref}
          className={`w-full p-2 border rounded-md focus:outline-none 
                 text-gray-600 placeholder:text-gray-500 
                 ${
                   error
                     ? "border-red-500 focus:border-red-500"
                     : "border-gray-300 focus:border-gray-400"
                 }`}
          placeholder={placeholder}
          rows={rows || 3}
          {...props}
        />
        {error && <p className="text-red-500 text-xs pt-1">{error}</p>}
      </div>
    );
  }
);

export default CustomTextArea;
