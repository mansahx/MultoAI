import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacters } from '../hooks/useCharacters';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { PageHeader } from '../components/layout/PageHeader';
import { CharacterCard } from '../components/character/CharacterCard';
import { Button } from '../components/ui/Button';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDate } from '../utils/helpers';

import {
  Search,
  PlusCircle,
  MessageSquare,
  Star,
  Users,
  UserCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { characters, loading, toggleFavorite, deleteCharacter, duplicateCharacter } = useCharacters();
  const { activePersona } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'favorites' | 'recent'
  const [recentSessions, setRecentSessions] = useState([]);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Load recent chat sessions
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const sessions = await storageService.getChatSessions();
        setRecentSessions(sessions.slice(0, 4));
      } catch (err) {
        console.error('Failed to load recent sessions:', err);
      }
    };
    fetchRecent();
  }, []);

  // Filter & Search logic
  const filteredCharacters = characters.filter((char) => {
    const matchesSearch =
      char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (char.description && char.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (Array.isArray(char.tags) && char.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (Array.isArray(char.personality) && char.personality.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())));

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
    <div className="flex flex-col gap-8">
      {/* Top Banner / Hero */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 overflow-hidden bg-slate-900">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unimodel AI • deepseek-v4-flash</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Explore the World of <span className="text-indigo-400">AI Roleplay</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Roleplay with interactive AI characters completely backend-free. All conversation history, personas, and characters are saved 100% locally in your browser.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="accent"
              icon={PlusCircle}
              size="lg"
              onClick={() => navigate('/characters/create')}
            >
              Create New Character
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Chats Section */}
      {recentSessions.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              Recent Chats
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentSessions.map((session) => {
              const char = characters.find(c => c.id === session.characterId);
              if (!char) return null;

              return (
                <div
                  key={session.id}
                  onClick={() => navigate(`/chat/${char.id}`)}
                  className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all duration-200 group flex items-center gap-3"
                >
                  <img
                    src={char.avatar}
                    alt={char.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-100 truncate group-hover:text-indigo-300 transition-colors">
                      {char.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {session.title}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {formatDate(session.updatedAt)}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Main Character Catalog Section */}
      <section className="flex flex-col gap-5">
        {/* Controls Bar: Search & Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search characters by name, traits, description..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
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

        {/* Character Cards Grid */}
        {filteredCharacters.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Characters Found"
            description={
              searchQuery
                ? `No characters matching keyword "${searchQuery}".`
                : 'No characters available yet. Create your first AI character!'
            }
            actionText="Create New Character"
            actionIcon={PlusCircle}
            onAction={() => navigate('/characters/create')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCharacters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onToggleFavorite={toggleFavorite}
                onDelete={(id) => setDeleteTargetId(id)}
                onDuplicate={duplicateCharacter}
              />
            ))}
          </div>
        )}
      </section>

      {/* Confirmation Dialog for Deleting Character */}
      <ConfirmationDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete AI Character?"
        message="Are you sure you want to delete this character and all associated chat history from local storage?"
      />
    </div>
  );
};
