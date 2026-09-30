import React from 'react';

export const PageHeader = ({
  title,
  description,
  action,
  children
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800/80">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {(action || children) && (
        <div className="flex items-center gap-3 shrink-0">
          {action}
          {children}
        </div>
      )}
    </div>
  );
};
