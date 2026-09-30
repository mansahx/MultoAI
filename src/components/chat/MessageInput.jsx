import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MessageInput = ({
  onSendMessage,
  isGenerating,
  onStopGeneration,
  characterName
}) => {
  const { settings } = useApp();
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || isGenerating) return;
    onSendMessage(text);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (settings?.enterToSend !== false) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  return (
    <div className="p-4 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 sticky bottom-0 z-20">
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        {/* Input container */}
        <div className="relative flex items-end gap-2 p-2 bg-slate-900/90 border border-slate-800 focus-within:border-indigo-500/60 rounded-2xl shadow-xl transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ketik pesan ke ${characterName || 'Karakter'}...`}
            disabled={isGenerating}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none max-h-[180px] min-h-[40px] leading-relaxed disabled:opacity-50"
          />

          {isGenerating ? (
            <button
              type="button"
              onClick={onStopGeneration}
              className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/20 transition-all shrink-0 active:scale-95"
              title="Hentikan balasan"
            >
              <Square className="w-4 h-4 fill-white" />
              <span className="hidden sm:inline">Hentikan</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              disabled={!text.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold border border-indigo-500/40 shadow-md transition-all shrink-0 active:scale-95 disabled:hover:bg-indigo-600"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between px-2 text-[11px] text-slate-500">
          <span>
            {settings?.enterToSend !== false
              ? 'Tekan Enter untuk mengirim, Shift + Enter untuk baris baru'
              : 'Tekan tombol Kirim untuk mengirim'}
          </span>
          <span className="hidden sm:inline">Multo AI • Frontend Local Storage</span>
        </div>
      </div>
    </div>
  );
};
