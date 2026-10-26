import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5'
  };

  const variantStyles = {
    primary: 'bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900 focus-visible:outline-blue-700 shadow-xs',
    secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-slate-600 shadow-xs',
    dark: 'bg-slate-900 text-white hover:bg-slate-800 active:bg-black focus-visible:outline-slate-900 shadow-xs',
    danger: 'bg-red-700 text-white hover:bg-red-800 active:bg-red-900 focus-visible:outline-red-700 shadow-xs',
    success: 'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 focus-visible:outline-emerald-700 shadow-xs',
    text: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};

export default Button;
