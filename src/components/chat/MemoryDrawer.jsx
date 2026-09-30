import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Brain, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

export const MemoryDrawer = ({
  isOpen,
  onClose,
  character,
  memories = [],
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
  onClearMemories
}) => {
  const [newMemoryText, setNewMemoryText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newMemoryText.trim()) return;
    onAddMemory(newMemoryText.trim());
    setNewMemoryText('');
  };

  const handleStartEdit = (mem) => {
    setEditingId(mem.id);
    setEditText(mem.content);
  };

  const handleSaveEdit = (id) => {
    if (!editText.trim()) return;
    onUpdateMemory(id, editText.trim());
    setEditingId(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Memori & Fakta Karakter (${character?.name || 'AI'})`}
      maxWidth="max-w-xl"
    >
      <div className="flex flex-col gap-5">
        <p className="text-xs text-slate-400 leading-relaxed bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl">
          <strong className="text-purple-300">Sistem Memori Lokal:</strong> Fakta dan peristiwa penting ini akan otomatis disisipkan ke dalam System Prompt AI agar {character?.name || 'karakter'} selalu mengingatnya.
        </p>

        {/* Add Memory Form */}
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newMemoryText}
            onChange={(e) => setNewMemoryText(e.target.value)}
            placeholder="Tambah memori baru (contoh: User menyukai kopi hitam)..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <Button type="submit" size="sm" variant="accent" icon={Plus}>
            Tambah
          </Button>
        </form>

        {/* Memories List */}
        <div className="flex flex-col gap-2.5 max-h-[350px] overflow-y-auto pr-1">
          {memories.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 italic">
              Belum ada memori tersimpan untuk {character?.name}. Tambahkan di atas!
            </div>
          ) : (
            memories.map((mem) => (
              <div
                key={mem.id}
                className="glass-card rounded-xl p-3 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                {editingId === mem.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 bg-slate-950 border border-purple-500/50 rounded-lg px-2.5 py-1 text-xs text-slate-100 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(mem.id)}
                      className="p-1 text-emerald-400 hover:bg-slate-800 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 text-slate-400 hover:bg-slate-800 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="flex-1 text-slate-200 leading-snug">{mem.content}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEdit(mem)}
                        className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteMemory(mem.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {memories.length > 0 && (
          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <Button
              size="sm"
              variant="danger"
              icon={Trash2}
              onClick={onClearMemories}
            >
              Bersihkan Semua Memori
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
