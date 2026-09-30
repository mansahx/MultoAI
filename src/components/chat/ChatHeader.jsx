import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Brain,
  Download,
  Trash2,
  MoreVertical,
  Edit2,
  Sparkles,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportService } from '../../services/exportService';

export const ChatHeader = ({
  character,
  session,
  memoriesCount = 0,
  onOpenMemories,
  onOpenHistoryEditor,
  onClearHistory,
  onRegenerate
}) => {
  const navigate = useNavigate();
  const { activePersona, addToast } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleExport = async () => {
    if (!session) return;
    try {
      await exportService.exportChatSession(session.id);
      addToast('Percakapan berhasil diexport ke file JSON', 'success');
    } catch (err) {
      addToast(`Gagal meng-export percakapan: ${err.message}`, 'error');
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between gap-3">
      {/* Left: Back & Character Info */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div
          onClick={() => character && navigate(`/characters/${character.id}`)}
          className="flex items-center gap-3 cursor-pointer group min-w-0"
        >
          <div className="relative">
            <img
              src={character?.avatar || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80'}
              alt={character?.name || 'Character'}
              className="w-10 h-10 rounded-full object-cover border border-slate-700 group-hover:border-indigo-500 transition-colors"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors truncate flex items-center gap-1.5">
              {character?.name || 'Loading Character...'}
            </h2>
            <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">Online</span>
              <span>•</span>
              <span className="text-slate-500 truncate">{character?.description || 'Roleplay AI'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Persona Pill */}
        <div
          onClick={() => navigate('/personas')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 cursor-pointer transition-colors"
          title="Ganti persona yang digunakan"
        >
          <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400">Persona:</span>
          <strong className="text-slate-200 truncate max-w-[100px]">
            {activePersona ? activePersona.displayName : 'Default'}
          </strong>
        </div>

        {/* Memories Button */}
        <button
          onClick={onOpenMemories}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs font-semibold transition-all"
        >
          <Brain className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Memori</span>
          {memoriesCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-purple-500 text-white text-[10px] font-bold">
              {memoriesCount}
            </span>
          )}
        </button>

        {/* More Options Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 glass-panel rounded-2xl border border-slate-800 shadow-2xl z-40 py-1 text-xs">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenHistoryEditor();
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-2.5 text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-indigo-400" />
                  Sunting History Prompt
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onRegenerate?.();
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-2.5 text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  Regenerate Last AI
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleExport();
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-2.5 text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  Export Chat (JSON)
                </button>

                <div className="my-1 border-t border-slate-800" />

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onClearHistory();
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-2.5 text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Chat History
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
