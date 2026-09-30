import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MessageSquare, Edit3, Trash2, Copy, Sparkles, User } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const CharacterCard = ({
  character,
  onToggleFavorite,
  onDelete,
  onDuplicate
}) => {
  const navigate = useNavigate();

  const handleStartChat = (e) => {
    e.stopPropagation();
    navigate(`/chat/${character.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/characters/${character.id}/edit`);
  };

  const handleCardClick = () => {
    navigate(`/characters/${character.id}`);
  };

  const personalityList = Array.isArray(character.personality)
    ? character.personality
    : (character.personality || '').split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div
      onClick={handleCardClick}
      className="group relative glass-card rounded-2xl overflow-hidden border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10"
    >
      {/* Top Banner / Avatar Area */}
      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
        {character.avatar ? (
          <img
            src={character.avatar}
            alt={character.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-indigo-400">
            <User className="w-16 h-16 opacity-40" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Badges / Favorite */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-800">
            {character.age ? `${character.age} yo` : ''} {character.gender ? `• ${character.gender}` : ''}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(character.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              character.favorite
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg'
                : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-amber-400 hover:bg-slate-900'
            }`}
            aria-label="Toggle Favorite"
          >
            <Star className={`w-4 h-4 ${character.favorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Title overlay at bottom of avatar */}
        <div className="absolute bottom-3 left-4 right-4 z-10">
          <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors truncate">
            {character.name}
          </h3>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {character.description || 'Tidak ada deskripsi singkat.'}
        </p>

        {/* Personality Tags */}
        <div className="flex flex-wrap gap-1.5 min-h-[28px]">
          {personalityList.slice(0, 3).map((tag, idx) => (
            <Badge key={idx} variant="purple" size="sm">
              {tag}
            </Badge>
          ))}
          {personalityList.length > 3 && (
            <span className="text-[10px] text-slate-500 font-semibold px-1.5 py-0.5">
              +{personalityList.length - 3}
            </span>
          )}
        </div>

        {/* Action Bar */}
        <div className="pt-3 mt-1 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <Button
            size="sm"
            variant="accent"
            icon={MessageSquare}
            onClick={handleStartChat}
            className="flex-1"
          >
            Start Chat
          </Button>

          <div className="flex items-center gap-1">
            {onDuplicate && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(character.id);
                }}
                title="Duplicate Character"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleEdit}
              title="Edit Character"
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(character.id);
                }}
                title="Delete Character"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
