import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { ChatHeader } from '../components/chat/ChatHeader';
import { MessageItem } from '../components/chat/MessageItem';
import { MessageInput } from '../components/chat/MessageInput';
import { MemoryDrawer } from '../components/chat/MemoryDrawer';
import { HistoryEditorModal } from '../components/chat/HistoryEditorModal';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';
import { ShieldAlert, Sparkles, RefreshCw, Key } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Chat = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const { settings, activePersona } = useApp();

  const {
    activeSession,
    character,
    messages,
    memories,
    isLoadingMessages,
    isGenerating,
    streamingContent,
    error,
    loadChatSession,
    sendMessage,
    stopGeneration,
    regenerateResponse,
    editMessage,
    deleteMessage,
    clearChatHistory,
    overwriteHistory,
    addMemory,
    updateMemory,
    deleteMemory,
    clearMemories
  } = useChat();

  const [memoryDrawerOpen, setMemoryDrawerOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // Load chat session when characterId changes
  useEffect(() => {
    if (characterId) {
      loadChatSession(characterId);
    }
  }, [characterId]);

  // Auto scroll to bottom when new messages arrive or while streaming
  useEffect(() => {
    if (settings?.autoScroll !== false) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingContent, isGenerating]);

  const hasApiKey = aiService.hasValidApiKey();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto border-x border-slate-800/60 bg-slate-950">
      {/* Header */}
      <ChatHeader
        character={character}
        session={activeSession}
        memoriesCount={memories.length}
        onOpenMemories={() => setMemoryDrawerOpen(true)}
        onOpenHistoryEditor={() => setHistoryModalOpen(true)}
        onClearHistory={() => setConfirmClearOpen(true)}
        onRegenerate={() => regenerateResponse()}
      />

      {/* API Key Missing Warning Banner */}
      {!hasApiKey && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Unimodel AI API Key is not set. Sending messages requires an API Key.</span>
          </div>
          <Button size="sm" variant="accent" onClick={() => navigate('/settings')}>
            Configure API Key
          </Button>
        </div>
      )}

      {/* Main Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Scenario Banner Box */}
        {character?.scenario && (
          <div className="glass-panel rounded-2xl p-4 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed my-2 bg-indigo-950/20 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-indigo-300 block mb-0.5">Roleplay Scenario:</strong>
              <p>{character.scenario}</p>
            </div>
          </div>
        )}

        {/* Message List */}
        {isLoadingMessages ? (
          <div className="flex justify-center items-center py-12 text-xs text-slate-500">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-400 mr-2" />
            Loading chat history...
          </div>
        ) : (
          messages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              character={character}
              userPersona={activePersona}
              onEdit={editMessage}
              onDelete={deleteMessage}
              onRegenerate={regenerateResponse}
            />
          ))
        )}

        {/* Live Streaming Response Bubble */}
        {isGenerating && (
          <div className="flex gap-3 mb-4 justify-start animate-fade-in">
            <img
              src={character?.avatar}
              alt={character?.name}
              className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 border border-slate-700 shadow-md"
            />
            <div className="max-w-[75%] flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">{character?.name}</span>
                <span className="text-indigo-400 animate-pulse font-medium">• is typing...</span>
              </div>

              <div className="glass-card bg-slate-900/90 text-slate-200 p-4 rounded-2xl rounded-tl-xs border border-indigo-500/30 text-sm shadow-lg leading-relaxed min-w-[120px]">
                {streamingContent ? (
                  <p className="whitespace-pre-wrap">{streamingContent}</p>
                ) : (
                  <div className="flex items-center gap-1.5 py-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 typing-dot-1" />
                    <span className="w-2 h-2 rounded-full bg-purple-400 typing-dot-2" />
                    <span className="w-2 h-2 rounded-full bg-pink-400 typing-dot-3" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Alert Box */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-3 my-3 shadow-xl">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <strong className="font-bold text-rose-300">Failed to get AI response:</strong>
              <p className="leading-relaxed">{error}</p>
              <div className="pt-2">
                <Button size="sm" variant="outline" onClick={() => regenerateResponse()}>
                  Try Again (Regenerate)
                </Button>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <MessageInput
        onSendMessage={sendMessage}
        isGenerating={isGenerating}
        onStopGeneration={stopGeneration}
        characterName={character?.name}
      />

      {/* Modals & Drawers */}
      <MemoryDrawer
        isOpen={memoryDrawerOpen}
        onClose={() => setMemoryDrawerOpen(false)}
        character={character}
        memories={memories}
        onAddMemory={addMemory}
        onUpdateMemory={updateMemory}
        onDeleteMemory={deleteMemory}
        onClearMemories={clearMemories}
      />

      <HistoryEditorModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        messages={messages}
        onSaveHistory={overwriteHistory}
      />

      <ConfirmationDialog
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        onConfirm={() => {
          clearChatHistory();
          setConfirmClearOpen(false);
        }}
        title="Clear All Chat History?"
        message="This action will delete all messages in this conversation from IndexedDB."
      />
    </div>
  );
};
