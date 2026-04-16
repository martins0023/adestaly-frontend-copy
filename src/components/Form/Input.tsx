import React, { useState, InputHTMLAttributes } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { clsx, type ClassValue } from 'clsx'; // Optional: for cleaner class merging
import { twMerge } from 'tailwind-merge'; // Optional: for merging tailwind classes safely

// Utility to merge tailwind classes (Standard in modern React projects)
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  success?: boolean;
  error?: boolean;
  hint?: string;
  icon?: React.ReactNode;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, IInput>(
  ({ type = "text", className, success, error, hint, icon, label, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    // Toggle logic for password visibility
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="w-full">
        {
          label && (
            <div className="flex justify-between items-center ml-1">
              <label htmlFor={props.name} className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                {label}
              </label>
            </div>
          )
        }

        <div className="relative group">
          {/* Left Icon */}
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
              {icon}
            </div>
          )}

          <input
            {...props}
            ref={ref}
            type={inputType}
            className={cn(
              "w-full pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-medium placeholder:text-gray-400 outline-none transition-all",
              "focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10",
              icon ? "pl-11" : "pl-4",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
              success && "border-green-500 focus:border-green-500 focus:ring-green-500/10",
              props.disabled && "opacity-50 cursor-not-allowed",
              className // Allows custom styles from outside
            )}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          )}
        </div>

        {/* Hint / Error Message */}
        {hint && (
          <p className={cn(
            "mt-1.5 text-xs font-medium",
            error ? "text-red-500" : success ? "text-green-500" : "text-gray-500"
          )}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;