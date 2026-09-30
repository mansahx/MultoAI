import React, { useState } from 'react';
import { formatDate } from '../../utils/helpers';
import { Copy, Edit3, Trash2, RefreshCw, Check, X, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MessageItem = ({
  message,
  character,
  userPersona,
  onEdit,
  onDelete,
  onRegenerate
}) => {
  const { addToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    addToast('Pesan disalin ke clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = (triggerRegenerate = false) => {
    if (!editText.trim()) return;
    onEdit(message.id, editText, triggerRegenerate);
    setIsEditing(false);
  };

  // Simple formatting helper for action text (*action text*)
  const renderFormattedText = (text) => {
    if (!text) return null;

    // Split by line breaks
    const paragraphs = text.split('\n');

    return paragraphs.map((para, pIdx) => {
      if (!para.trim()) return <br key={pIdx} />;

      // Match asterisks *action text*
      const parts = para.split(/(\*[^*]+\*)/g);

      return (
        <p key={pIdx} className="mb-2 last:mb-0 leading-relaxed">
          {parts.map((part, idx) => {
            if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
              return (
                <span key={idx} className="italic text-indigo-300/90 font-serif">
                  {part.slice(1, -1)}
                </span>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 mb-4 group ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar for AI */}
      {!isUser && (
        <img
          src={character?.avatar || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80'}
          alt={character?.name || 'AI'}
          className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 border border-slate-700 shadow-md"
        />
      )}

      {/* Message Bubble Container */}
      <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Name Header */}
        <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">
            {isUser ? (userPersona?.displayName || 'You') : (character?.name || 'AI')}
          </span>
          <span>•</span>
          <span>{formatDate(message.createdAt)}</span>
          {message.edited && <span className="text-[10px] italic text-slate-500">(edited)</span>}
        </div>

        {/* Inline Edit Form */}
        {isEditing ? (
          <div className="w-full glass-panel rounded-2xl p-3 border border-indigo-500/40 shadow-xl flex flex-col gap-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 resize-none min-h-[100px]"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditText(message.content);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Batal
              </button>

              {isUser ? (
                <button
                  type="button"
                  onClick={() => handleSaveEdit(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 shadow-md shadow-indigo-600/20"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Simpan & Regenerate
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSaveEdit(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 shadow-md"
                >
                  <Check className="w-3.5 h-3.5" /> Simpan
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Normal Message Content */
          <div className="relative group/bubble">
            <div
              className={`p-4 rounded-2xl text-sm shadow-lg leading-relaxed ${
                isUser
                  ? 'bg-indigo-600 text-white rounded-tr-xs border border-indigo-500/40'
                  : 'glass-card bg-slate-900/90 text-slate-200 rounded-tl-xs border border-slate-800'
              }`}
            >
              {renderFormattedText(message.content)}
            </div>

            {/* Quick Action Toolbar */}
            <div className={`absolute top-2 ${isUser ? '-left-24' : '-right-24'} opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-200 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-1 shadow-xl z-10`}>
              <button
                type="button"
                onClick={handleCopy}
                title="Copy Message"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                title="Edit Message"
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              {onRegenerate && (
                <button
                  type="button"
                  onClick={() => onRegenerate(message.id)}
                  title="Regenerate from here"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(message.id)}
                  title="Delete Message"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Avatar for User */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo-900/90 border border-indigo-500/40 flex items-center justify-center text-indigo-200 font-bold text-xs shrink-0 mt-1 shadow-md">
          {userPersona?.displayName ? userPersona.displayName.charAt(0).toUpperCase() : 'U'}
        </div>
      )}
    </div>
  );
};
