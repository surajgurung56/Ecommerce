import React, { useId } from 'react';

const CustomInput = ({ label, type = 'text', className = '', error, mustFill, ...props }, ref) => {
    const id = useId();
    return (
        <div className="relative">
            {label && (
                <label className="text-gray-600 block mb-1.5" htmlFor={id}>
                    {label}{mustFill && <span className="text-red-500"> *</span>}
                </label>
            )}
            <input
                id={id}
                ref={ref}
                type={type}
                className={`w-full p-2 border rounded-md focus:outline-none 
                 text-gray-600 placeholder:text-gray-500 
                 ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-400'} 
                 ${className}`}
                {...props}
            />
            {error && <p className="text-red-500 text-xs pt-1">{error}</p>}
        </div>
    );
};

export default React.forwardRef(CustomInput);
