import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';

export const Badge = ({
  children,
  variant = 'default',
  status,
  size = 'md',
  className = ''
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold'
  };

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-blue-50 text-blue-700 border border-blue-200',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-300',
    danger: 'bg-red-50 text-red-800 border border-red-200',
    dark: 'bg-slate-900 text-white border border-slate-900'
  };

  const statusClass = status ? (STATUS_COLORS[status] || variantStyles.default) : (variantStyles[variant] || variantStyles.default);

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border ${sizeStyles[size]} ${statusClass} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
