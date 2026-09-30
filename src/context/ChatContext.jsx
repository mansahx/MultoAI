import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { memoryService } from '../services/memoryService';
import { useApp } from './AppContext';
import { generateId } from '../utils/helpers';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { activePersona, addToast } = useApp();

  const [activeSession, setActiveSession] = useState(null);
  const [character, setCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [memories, setMemories] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // AI Response state
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  // Load chat session for a given character ID
  const loadChatSession = async (characterId) => {
    if (!characterId) return;

    setIsLoadingMessages(true);
    setError(null);

    try {
      const char = storageService.getCharacterById(characterId);
      setCharacter(char);

      if (!char) {
        throw new Error('Character not found');
      }

      // Find or create session
      let session = await storageService.getChatSessionByCharacter(characterId);
      const currentPersona = activePersona || storageService.getActivePersona();

      if (!session) {
        session = await storageService.createChatSession(
          characterId,
          currentPersona ? currentPersona.id : null
        );
      }

      setActiveSession(session);

      // Fetch messages & memories
      const msgs = await storageService.getMessages(session.id);
      setMessages(msgs);

      const mems = await memoryService.getMemories(characterId);
      setMemories(mems);
    } catch (err) {
      console.error('Error loading chat session:', err);
      setError(err.message);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Reload current messages
  const reloadMessages = async () => {
    if (activeSession) {
      const msgs = await storageService.getMessages(activeSession.id);
      setMessages(msgs);
    }
  };

  // Reload memories
  const reloadMemories = async () => {
    if (character) {
      const mems = await memoryService.getMemories(character.id);
      setMemories(mems);
    }
  };

  // Stop AI generation
  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    setStreamingContent('');
  };

  // Send new user message and invoke Unimodel AI
  const sendMessage = async (userContent) => {
    if (!userContent.trim() || !activeSession || !character || isGenerating) return;

    setError(null);
    const content = userContent.trim();

    // 1. Add user message locally
    const userMsg = await storageService.addMessage(activeSession.id, 'user', content);
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    // 2. Trigger AI Response
    await triggerAIResponse(updatedMessages);
  };

  // Trigger AI request given a message history array
  const triggerAIResponse = async (historyMessages) => {
    if (!character || !activeSession) return;

    setIsGenerating(true);
    setStreamingContent('');
    setError(null);

    abortControllerRef.current = new AbortController();

    const currentPersona = activePersona || storageService.getActivePersona();

    try {
      const responseText = await aiService.sendChatMessage({
        character,
        persona: currentPersona,
        history: historyMessages,
        onChunk: (accumulated) => {
          setStreamingContent(accumulated);
        },
        signal: abortControllerRef.current.signal
      });

      // Save AI message to IndexedDB once complete
      const aiMsg = await storageService.addMessage(activeSession.id, 'assistant', responseText);
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      if (err.name === 'AbortError') {
        addToast('Generasi balasan dibatalkan', 'info');
      } else {
        console.error('AI Response error:', err);
        setError(err.message);
        addToast(`Gagal mendapatkan balasan AI: ${err.message}`, 'error', 6000);
      }
    } finally {
      setIsGenerating(false);
      setStreamingContent('');
      abortControllerRef.current = null;
    }
  };

  // Regenerate an AI message response
  const regenerateResponse = async (aiMessageId = null) => {
    if (!activeSession || isGenerating) return;

    let historyToUse = [...messages];

    if (aiMessageId) {
      const targetIndex = messages.findIndex(m => m.id === aiMessageId);
      if (targetIndex !== -1) {
        // Delete all messages starting from target AI message
        await storageService.deleteMessagesFromId(activeSession.id, aiMessageId);
        historyToUse = messages.slice(0, targetIndex);
      }
    } else {
      // Regenerate last message if it's assistant, or trigger after last user msg
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.role === 'assistant') {
        await storageService.deleteMessage(lastMsg.id);
        historyToUse = messages.slice(0, messages.length - 1);
      }
    }

    setMessages(historyToUse);
    await triggerAIResponse(historyToUse);
  };

  // Edit an existing message
  const editMessage = async (messageId, newContent, triggerRegenerate = false) => {
    if (!activeSession || !newContent.trim()) return;

    const targetIndex = messages.findIndex(m => m.id === messageId);
    if (targetIndex === -1) return;

    const targetMsg = messages[targetIndex];
    await storageService.updateMessage(messageId, newContent.trim());

    if (targetMsg.role === 'user' && triggerRegenerate) {
      // Delete subsequent messages and regenerate AI response
      const historyToKeep = messages.slice(0, targetIndex + 1);
      historyToKeep[targetIndex] = { ...targetMsg, content: newContent.trim(), edited: true };

      // Delete subsequent messages from IndexedDB
      if (targetIndex + 1 < messages.length) {
        const nextMsgId = messages[targetIndex + 1].id;
        await storageService.deleteMessagesFromId(activeSession.id, nextMsgId);
      }

      setMessages(historyToKeep);
      await triggerAIResponse(historyToKeep);
    } else {
      await reloadMessages();
      addToast('Pesan berhasil diperbarui', 'success');
    }
  };

  // Delete a single message
  const deleteMessage = async (messageId) => {
    if (!activeSession) return;
    await storageService.deleteMessage(messageId);
    setMessages(prev => prev.filter(m => m.id !== messageId));
    addToast('Pesan dihapus', 'info');
  };

  // Clear entire chat history for current session
  const clearChatHistory = async () => {
    if (!activeSession) return;
    const greetingMsg = character?.greeting ? {
      id: generateId('msg'),
      sessionId: activeSession.id,
      role: 'assistant',
      content: character.greeting,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      edited: false
    } : null;

    if (greetingMsg) {
      await storageService.overwriteMessages(activeSession.id, [greetingMsg]);
    } else {
      await storageService.overwriteMessages(activeSession.id, []);
    }

    await reloadMessages();
    addToast('Riwayat percakapan dibersihkan', 'info');
  };

  // Overwrite history manually (used in History Editor modal)
  const overwriteHistory = async (newMessagesArray) => {
    if (!activeSession) return;
    await storageService.overwriteMessages(activeSession.id, newMessagesArray);
    await reloadMessages();
    addToast('Riwayat percakapan berhasil disunting', 'success');
  };

  // Memory Actions
  const addMemory = async (content) => {
    if (!character) return;
    await memoryService.addMemory(character.id, content);
    await reloadMemories();
    addToast('Memori baru ditambahkan', 'success');
  };

  const updateMemory = async (id, content) => {
    await memoryService.updateMemory(id, content);
    await reloadMemories();
    addToast('Memori diperbarui', 'success');
  };

  const deleteMemory = async (id) => {
    await memoryService.deleteMemory(id);
    await reloadMemories();
    addToast('Memori dihapus', 'info');
  };

  const clearMemories = async () => {
    if (!character) return;
    await memoryService.clearMemories(character.id);
    await reloadMemories();
    addToast('Semua memori dibersihkan', 'info');
  };

  return (
    <ChatContext.Provider
      value={{
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContext };
export default ChatContext;
