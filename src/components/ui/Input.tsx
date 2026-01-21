import React, { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  value: string | number;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      startAdornment,
      endAdornment,
      value,
      fullWidth = false,
      className = "",
      onChange,
      ...props
    },
    ref
  ) => {
    const widthClass = fullWidth ? "w-full" : "";
    const errorClass = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-gray-200 focus:border-blue-500";

    const adornmentClass = startAdornment ? "pl-10" : "";

    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}

        <div className="relative group">
          {startAdornment && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              {startAdornment}
            </div>
          )}

          <input
            ref={ref}
            className={`
              block w-full px-4 py-3 
              bg-gray-50 border-2 ${errorClass}
              rounded-xl text-sm
              placeholder-gray-400
              transition-all duration-200
              focus:bg-white focus:ring-2 focus:ring-opacity-20
              ${error ? 'focus:ring-red-200' : 'focus:ring-blue-200'}
              hover:border-gray-300
              ${adornmentClass}
              outline-none
            `}
            value={value}
            onChange={onChange}
            {...props}
          />

          {endAdornment && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
              {endAdornment}
            </div>
          )}
          
          {/* Focus border effect */}
          <div className={`
            absolute inset-0 rounded-xl border-2 border-transparent 
            pointer-events-none transition-all
            ${error ? 'group-focus-within:border-red-400' : 'group-focus-within:border-blue-400'}
          `}></div>
        </div>

        {(error || helperText) && (
          <p
            className={`mt-2 text-sm ${
              error ? "text-red-600 font-medium" : "text-gray-500"
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
