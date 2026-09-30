import React from 'react';
import { UserCheck, CheckCircle, Edit3, Trash2, Copy, User } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const PersonaCard = ({
  persona,
  isActive,
  onSetActive,
  onEdit,
  onDelete,
  onDuplicate
}) => {
  const personalityList = Array.isArray(persona.personality)
    ? persona.personality
    : (persona.personality || '').split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className={`glass-card rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
      isActive
        ? 'border-indigo-500/60 bg-indigo-950/20 shadow-xl shadow-indigo-500/10'
        : 'border-slate-800 hover:border-slate-700'
    }`}>
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md ${
              isActive
                ? 'bg-indigo-600 text-white border border-indigo-500/40'
                : 'bg-slate-800 text-slate-300'
            }`}>
              {persona.displayName ? persona.displayName.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                {persona.displayName || persona.name}
              </h3>
              <p className="text-xs text-slate-400">
                {persona.name} • {persona.occupation || 'Wanderer'}
              </p>
            </div>
          </div>

          {isActive ? (
            <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Aktif
            </span>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSetActive(persona.id)}
            >
              Gunakan
            </Button>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs py-2 my-2 border-y border-slate-800/60">
          <div>
            <span className="text-slate-500">Umur:</span>{' '}
            <span className="text-slate-300 font-medium">{persona.age || '-'}</span>
          </div>
          <div>
            <span className="text-slate-500">Gender:</span>{' '}
            <span className="text-slate-300 font-medium">{persona.gender || '-'}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-3 mb-3 leading-relaxed">
          {persona.description || 'Tidak ada deskripsi persona.'}
        </p>

        {/* Personality tags */}
        {personalityList.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {personalityList.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="indigo" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onDuplicate(persona.id)}
          title="Duplicate Persona"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-xs flex items-center gap-1 px-2"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy</span>
        </button>

        <button
          type="button"
          onClick={() => onEdit(persona.id)}
          title="Edit Persona"
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors text-xs flex items-center gap-1 px-2"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(persona.id)}
            title="Delete Persona"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors text-xs flex items-center gap-1 px-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus</span>
          </button>
        )}
      </div>
    </div>
  );
};
