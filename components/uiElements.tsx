
import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const baseStyles = "font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ease-in-out duration-200 flex items-center shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400 justify-center",
    secondary: "bg-slate-200 hover:bg-slate-300 text-slate-700 focus:ring-slate-400 justify-center",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400 justify-center",
    success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400 justify-center",
    warning: "bg-yellow-400 hover:bg-yellow-500 text-slate-800 focus:ring-yellow-300 justify-center",
    outline: "bg-transparent hover:bg-slate-100 text-slate-700 border border-slate-300 focus:ring-slate-300 justify-center",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base", // Increased padding
    lg: "px-7 py-3 text-lg",   // Increased padding
    xl: "px-8 py-3.5 text-xl font-semibold", // For very prominent buttons
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2 flex-shrink-0">{leftIcon}</span>}
      <span className="flex-grow text-center">{children}</span>
      {rightIcon && <span className="ml-2 flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg', color?: string, className?: string }> = ({ size = 'md', color = 'border-blue-500', className }) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };
  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 ${color} ${sizeClasses[size]} ${className}`}></div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300 ease-in-out p-4">
      <div className={`bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full ${sizeClasses[size]} transform transition-all duration-300 ease-in-out scale-100 opacity-100`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 -mr-2 rounded-full hover:bg-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mb-6 text-slate-700">{children}</div>
        {footer && <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-slate-200">{footer}</div>}
      </div>
    </div>
  );
};

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  titleClassName?: string;
  action?: ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, titleClassName = '', action }) => {
  return (
    <div className={`bg-white shadow-xl rounded-xl ${title ? 'p-6 sm:p-8' : 'p-5 sm:p-6'} ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-5">
          {title && <h2 className={`text-2xl font-semibold text-slate-800 ${titleClassName}`}>{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, id, error, className, leftIcon, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <div className="relative">
        {leftIcon && <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">{leftIcon}</span>}
        <input
          id={id}
          className={`block w-full ${leftIcon ? 'pl-10' : 'px-3'} py-2.5 border ${error ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm transition-colors ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
export const Textarea: React.FC<TextareaProps> = ({ label, id, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <textarea
        id={id}
        className={`block w-full px-3 py-2.5 border ${error ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm transition-colors ${className}`}
        rows={4}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, id, error, options, className, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <select
        id={id}
        className={`block w-full px-3 py-2.5 border ${error ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm transition-colors bg-white ${className}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};