import React from "react";
import { ChevronDown } from "lucide-react";

const CustomSelect = (
  {
    label,
    options,
    required,
    value,
    onChange,
    error,
    placeholder,
    mustFill,
    ...props
  },
  ref
) => {
  return (
    <div className="relative w-full">
      <label className="text-gray-600 block mb-1.5">
        {label}
        {mustFill && <span className="text-red-500"> *</span>}
      </label>
      <div className="relative">
        <select
          ref={ref}
          value={value}
          required={required}
          onChange={onChange}
          {...props}
          className={`
                        appearance-none w-full px-3 py-[8px] border rounded-lg bg-white text-gray-500 focus:outline-none
                        ${
                          error
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-gray-400"
                        }
                    `}
        >
          <option disabled selected value="">
            {placeholder || "Select an option"}
          </option>
          {options &&
            options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
      </div>
      {error && <p className="text-red-500 text-xs pt-1">{error}</p>}
    </div>
  );
};

export default React.forwardRef(CustomSelect);
