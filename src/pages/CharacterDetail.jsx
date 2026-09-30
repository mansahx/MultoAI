import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCharacters } from '../hooks/useCharacters';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';
import {
  MessageSquare,
  Edit3,
  Trash2,
  Copy,
  Star,
  ArrowLeft,
  User,
  Heart,
  ThumbsDown,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const CharacterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCharacter, toggleFavorite, deleteCharacter, duplicateCharacter } = useCharacters();

  const [confirmDelete, setConfirmDelete] = useState(false);

  const character = getCharacter(id);

  if (!character) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-bold text-slate-200 mb-4">Character Not Found</h3>
        <Button variant="primary" onClick={() => navigate('/characters')}>
          Back to Character Catalog
        </Button>
      </div>
    );
  }

  const personalityList = Array.isArray(character.personality)
    ? character.personality
    : (character.personality || '').split(',').map(s => s.trim()).filter(Boolean);

  const likesList = Array.isArray(character.likes)
    ? character.likes
    : (character.likes || '').split(',').map(s => s.trim()).filter(Boolean);

  const dislikesList = Array.isArray(character.dislikes)
    ? character.dislikes
    : (character.dislikes || '').split(',').map(s => s.trim()).filter(Boolean);

  const handleDelete = () => {
    deleteCharacter(id);
    navigate('/characters');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/characters')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Character Catalog
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(character.id)}
            className={`p-2 rounded-xl border transition-all ${
              character.favorite
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-amber-400'
            }`}
          >
            <Star className={`w-4 h-4 ${character.favorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Detail Header Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 overflow-hidden relative">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <img
            src={character.avatar}
            alt={character.name}
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover border-2 border-slate-700 shadow-2xl shrink-0"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80';
            }}
          />

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{character.name}</h1>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-indigo-300 font-semibold">
                  {character.age ? `${character.age} yo` : ''} {character.gender ? `• ${character.gender}` : ''}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                {character.description}
              </p>
            </div>

            {/* Personality Tags */}
            {personalityList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {personalityList.map((tag, idx) => (
                  <Badge key={idx} variant="purple" size="md">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="accent"
                size="lg"
                icon={MessageSquare}
                onClick={() => navigate(`/chat/${character.id}`)}
              >
                Start Roleplay Chat
              </Button>

              <Button
                variant="secondary"
                icon={Edit3}
                onClick={() => navigate(`/characters/${character.id}/edit`)}
              >
                Edit Character
              </Button>

              <Button
                variant="outline"
                icon={Copy}
                onClick={() => duplicateCharacter(character.id)}
              >
                Duplicate
              </Button>

              <Button
                variant="danger"
                icon={Trash2}
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scenario & Greeting Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Scenario & Greeting
          </h3>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Initial Greeting Message</h4>
            <p className="text-sm text-slate-200 p-4 rounded-xl bg-slate-900 border border-slate-800 font-serif italic leading-relaxed">
              {character.greeting || 'No greeting available.'}
            </p>
          </div>

          {character.scenario && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scenario & Setting</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
                {character.scenario}
              </p>
            </div>
          )}
        </div>

        {/* Bio & Background Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <BookOpen className="w-4 h-4 text-purple-400" /> Background & Bio
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {character.background || character.longDescription || 'No detailed background bio available.'}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800">
            <div>
              <h4 className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mb-1.5">
                <Heart className="w-3.5 h-3.5" /> Likes
              </h4>
              <p className="text-xs text-slate-300">
                {likesList.join(', ') || '-'}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-rose-400 flex items-center gap-1 mb-1.5">
                <ThumbsDown className="w-3.5 h-3.5" /> Dislikes
              </h4>
              <p className="text-xs text-slate-300">
                {dislikesList.join(', ') || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete this Character?"
        message={`Are you sure you want to delete "${character.name}"? All existing chat history will be permanently deleted.`}
      />
    </div>
  );
};
