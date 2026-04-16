import React, { ReactNode } from 'react'
import { FaSpinner } from 'react-icons/fa';

export interface IButton {
    title: string;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    className?: string;
    loading?: boolean;
    styles?: React.CSSProperties;
    type?: "button" | "submit" | "reset" | undefined
}

function Btn({ title, startIcon, endIcon, onClick, disabled, className, loading, styles, type }: IButton) {
    return (
        <button
            type={type || "button"}
            disabled={disabled || loading}
            onClick={onClick}
            className={`${className} w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]
                bg-primary text-white hover:brightness-110 shadow-primary/30
                `}
                style={styles}
        >
            {loading ? (
                <>
                    <FaSpinner className="animate-spin text-lg" />
                    {/* <span>Verifying...</span> */}
                </>
            ) : (
                <>
                    {
                        startIcon && startIcon
                    }
                    <span>{title}</span>
                    {
                        endIcon && endIcon
                    }
                    {/* <FaArrowRight /> */}
                </>
            )}
        </button>
    )
}

export default Btn