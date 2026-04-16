import React, { SelectHTMLAttributes } from 'react'
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { dropdown } from '../../../public/images/index';
import Image from 'next/image';
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ISelect extends SelectHTMLAttributes<HTMLSelectElement> {
    success?: boolean;
    error?: boolean;
    hint?: string;
    icon?: React.ReactNode;
    label?: string;
}

const Select = React.forwardRef<HTMLSelectElement, ISelect>(
    ({ children, className, success, error, hint, icon, label, ...props }, ref) => {
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

                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                            {icon}
                        </div>
                    )}

                    <select
                        {...props}
                        ref={ref}
                        className={cn(
                            "w-full pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-medium appearance-none outline-none transition-all",
                            "focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10",
                            icon ? "pl-11" : "pl-4",
                            error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
                            success && "border-green-500 focus:border-green-500 focus:ring-green-500/10",
                            props.disabled && "opacity-50 cursor-not-allowed",
                            className
                        )}
                    >
                        {children}
                    </select>
                    {/* <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <Image src={dropdown} alt="" width={12} height={12} className="w-3 h-3 text-gray-400" />
                    </div> */}
                </div>

                {hint && (
                    <p className={cn(
                        "mt-1.5 text-xs font-medium",
                        error ? "text-red-500" : success ? "text-green-500" : "text-gray-500"
                    )}>
                        {hint}
                    </p>
                )}
            </div>
        )
    }
)

Select.displayName = "Select";

export default Select