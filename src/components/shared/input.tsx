import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="mb-6">
      <label className="block text-[#99999] font-semibold mb-2 text-lg">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2 md:py-3 bg-accent bg-opacity-80 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800 placeholder-gray-500"
      />
    </div>
  );
};

export default Input;