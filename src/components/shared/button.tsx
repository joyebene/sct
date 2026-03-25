import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, loading, ...props }) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="w-full bg-primary text-accent py-2 md:py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;