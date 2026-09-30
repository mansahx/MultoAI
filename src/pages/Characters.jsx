import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCharacters } from '../hooks/useCharacters';
import { PageHeader } from '../components/layout/PageHeader';
import { CharacterCard } from '../components/character/CharacterCard';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';
import { PlusCircle, Search, Users, Star } from 'lucide-react';

export const Characters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') === 'favorites' ? 'favorites' : 'all';

  const { characters, loading, toggleFavorite, deleteCharacter, duplicateCharacter } = useCharacters();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState(initialFilter);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const filteredCharacters = characters.filter((char) => {
    const matchesSearch =
      char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (char.description && char.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (Array.isArray(char.tags) && char.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;
    if (filterTab === 'favorites') return char.favorite;
    return true;
  });

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteCharacter(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="AI Character Catalog"
        description="Manage and choose AI characters to roleplay and chat with."
        action={
          <Button
            variant="accent"
            icon={PlusCircle}
            onClick={() => navigate('/characters/create')}
          >
            Create New Character
          </Button>
        }
      />

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search characters by name or tags..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({characters.length})
          </button>
          <button
            onClick={() => setFilterTab('favorites')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              filterTab === 'favorites'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            Favorites ({characters.filter(c => c.favorite).length})
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredCharacters.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Characters Found"
          description="Try using different search keywords or create a new character."
          actionText="Create New Character"
          actionIcon={PlusCircle}
          onAction={() => navigate('/characters/create')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCharacters.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              onToggleFavorite={toggleFavorite}
              onDelete={(id) => setDeleteTargetId(id)}
              onDuplicate={duplicateCharacter}
            />
          ))}
        </div>
      )}

      <ConfirmationDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete AI Character?"
        message="Are you sure you want to delete this character from local storage?"
      />
    </div>
  );
};
