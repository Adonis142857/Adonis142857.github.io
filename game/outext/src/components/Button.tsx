import React from "react";

export const Button: React.FC<{
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}> = ({ children, className, onClick, disabled }) => {
  return (
    <button
      className={`border border-white px-2 py-1 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
