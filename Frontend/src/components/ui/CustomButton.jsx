import { LoaderCircle } from "lucide-react";
import React from "react";

const CustomButton = ({ text, onClick, disabled = false, className, type = "button", loading }) => {
    return (
        <button
            className={`${className ? className : "bg-primary text-white py-2 rounded-md  w-full"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            type={type}
            onClick={onClick}
            disabled={disabled}
        >
            <div className="flex items-center justify-center">
                {loading && <LoaderCircle className="animate-spin mr-2" size={20} />}
                {text}
            </div>

        </button>
    );
};

export default CustomButton;