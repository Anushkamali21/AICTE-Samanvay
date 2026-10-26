import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = '',
  headerClassName = ''
}) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden ${className}`}>
      {(title || subtitle || action) && (
        <div className={`px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4 ${headerClassName}`}>
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
