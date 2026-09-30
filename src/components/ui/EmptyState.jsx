import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'Tidak Ada Data',
  description = 'Belum ada data untuk ditampilkan saat ini.',
  actionText,
  onAction,
  actionIcon
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center glass-card rounded-2xl border border-slate-800/80 my-4">
      <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-100 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} icon={actionIcon} variant="accent">
          {actionText}
        </Button>
      )}
    </div>
  );
};
