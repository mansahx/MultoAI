import React from 'react';

export const Badge = ({
  children,
  variant = 'indigo',
  size = 'md',
  onRemove,
  className = ''
}) => {
  const variants = {
    indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
    purple: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    rose: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    slate: "bg-slate-800/80 text-slate-300 border-slate-700"
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5 rounded-md",
    md: "text-xs px-2.5 py-1 rounded-lg",
    lg: "text-sm px-3 py-1 rounded-xl"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium border ${variants[variant] || variants.indigo} ${sizes[size] || sizes.md} ${className}`}>
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:opacity-75 focus:outline-none p-0.5 ml-0.5 rounded"
        >
          ×
        </button>
      )}
    </span>
  );
};
