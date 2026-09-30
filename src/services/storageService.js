import { openDB } from 'idb';
import { SEED_CHARACTERS, DEFAULT_PERSONA, DEFAULT_SETTINGS } from '../utils/seedData';
import { safeParseJSON, generateId } from '../utils/helpers';

const DB_NAME = 'MultoAIRoleplayDB';
const DB_VERSION = 1;

// Storage keys for localStorage
const KEYS = {
  CHARACTERS: 'multo_characters',
  PERSONAS: 'multo_personas',
  ACTIVE_PERSONA_ID: 'multo_active_persona_id',
  SETTINGS: 'multo_settings',
  INITIALIZED: 'multo_initialized_v1'
};

// Initialize IndexedDB
let dbPromise = null;

const getDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Chat sessions store
        if (!db.objectStoreNames.contains('chatSessions')) {
          const sessionStore = db.createObjectStore('chatSessions', { keyPath: 'id' });
          sessionStore.createIndex('characterId', 'characterId', { unique: false });
          sessionStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        // Messages store
        if (!db.objectStoreNames.contains('messages')) {
          const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
          messageStore.createIndex('sessionId', 'sessionId', { unique: false });
          messageStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Character Memories store
        if (!db.objectStoreNames.contains('memories')) {
          const memoryStore = db.createObjectStore('memories', { keyPath: 'id' });
          memoryStore.createIndex('characterId', 'characterId', { unique: false });
        }
      }
    });
  }
  return dbPromise;
};

export const storageService = {
  // Initialize storage with seed data if fresh install
  async initStorage() {
    const isInitialized = localStorage.getItem(KEYS.INITIALIZED);
    if (!isInitialized) {
      // Seed characters
      localStorage.setItem(KEYS.CHARACTERS, JSON.stringify(SEED_CHARACTERS));

      // Seed persona
      localStorage.setItem(KEYS.PERSONAS, JSON.stringify([DEFAULT_PERSONA]));
      localStorage.setItem(KEYS.ACTIVE_PERSONA_ID, DEFAULT_PERSONA.id);

      // Seed settings
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));

      // Seed initial chat session for Aiko Vance
      const firstSessionId = `session_aiko_${Date.now()}`;
      const firstSession = {
        id: firstSessionId,
        characterId: SEED_CHARACTERS[0].id,
        personaId: DEFAULT_PERSONA.id,
        title: `Chat with ${SEED_CHARACTERS[0].name}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const initialGreetingMessage = {
        id: generateId('msg'),
        sessionId: firstSessionId,
        role: 'assistant',
        content: SEED_CHARACTERS[0].greeting,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        edited: false
      };

      const db = await getDB();
      await db.put('chatSessions', firstSession);
      await db.put('messages', initialGreetingMessage);

      // Seed initial memory for Aiko Vance
      const initialMemory = {
        id: generateId('mem'),
        characterId: SEED_CHARACTERS[0].id,
        content: "User came in on a rainy midnight carrying an encrypted datachip.",
        createdAt: new Date().toISOString()
      };
      await db.put('memories', initialMemory);

      localStorage.setItem(KEYS.INITIALIZED, 'true');
    }
  },

  // --- CHARACTERS ---
  getCharacters() {
    const data = localStorage.getItem(KEYS.CHARACTERS);
    return safeParseJSON(data, []);
  },

  getCharacterById(id) {
    const characters = this.getCharacters();
    return characters.find(c => c.id === id) || null;
  },

  saveCharacters(characters) {
    localStorage.setItem(KEYS.CHARACTERS, JSON.stringify(characters));
  },

  createCharacter(characterData) {
    const characters = this.getCharacters();
    const newCharacter = {
      ...characterData,
      id: characterData.id || generateId('char'),
      favorite: characterData.favorite || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    characters.unshift(newCharacter);
    this.saveCharacters(characters);
    return newCharacter;
  },

  updateCharacter(id, updatedFields) {
    const characters = this.getCharacters();
    const index = characters.findIndex(c => c.id === id);
    if (index === -1) return null;

    characters[index] = {
      ...characters[index],
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    this.saveCharacters(characters);
    return characters[index];
  },

  deleteCharacter(id) {
    const characters = this.getCharacters();
    const filtered = characters.filter(c => c.id !== id);
    this.saveCharacters(filtered);

    // Clean up related chat sessions in IndexedDB asynchronously
    this.deleteSessionsByCharacterId(id);
  },

  toggleFavoriteCharacter(id) {
    const characters = this.getCharacters();
    const index = characters.findIndex(c => c.id === id);
    if (index !== -1) {
      characters[index].favorite = !characters[index].favorite;
      this.saveCharacters(characters);
    }
    return characters[index];
  },

  // --- PERSONAS ---
  getPersonas() {
    const data = localStorage.getItem(KEYS.PERSONAS);
    return safeParseJSON(data, []);
  },

  getPersonaById(id) {
    const personas = this.getPersonas();
    return personas.find(p => p.id === id) || null;
  },

  getActivePersonaId() {
    return localStorage.getItem(KEYS.ACTIVE_PERSONA_ID) || null;
  },

  setActivePersonaId(id) {
    localStorage.setItem(KEYS.ACTIVE_PERSONA_ID, id);
  },

  getActivePersona() {
    const activeId = this.getActivePersonaId();
    const personas = this.getPersonas();
    if (!activeId && personas.length > 0) {
      return personas[0];
    }
    return personas.find(p => p.id === activeId) || personas[0] || null;
  },

  savePersonas(personas) {
    localStorage.setItem(KEYS.PERSONAS, JSON.stringify(personas));
  },

  createPersona(personaData) {
    const personas = this.getPersonas();
    const newPersona = {
      ...personaData,
      id: personaData.id || generateId('persona'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    personas.unshift(newPersona);
    this.savePersonas(personas);

    if (personas.length === 1) {
      this.setActivePersonaId(newPersona.id);
    }
    return newPersona;
  },

  updatePersona(id, updatedFields) {
    const personas = this.getPersonas();
    const index = personas.findIndex(p => p.id === id);
    if (index === -1) return null;

    personas[index] = {
      ...personas[index],
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    this.savePersonas(personas);
    return personas[index];
  },

  deletePersona(id) {
    const personas = this.getPersonas();
    const filtered = personas.filter(p => p.id !== id);
    this.savePersonas(filtered);

    if (this.getActivePersonaId() === id) {
      const nextActive = filtered.length > 0 ? filtered[0].id : null;
      if (nextActive) this.setActivePersonaId(nextActive);
      else localStorage.removeItem(KEYS.ACTIVE_PERSONA_ID);
    }
  },

  // --- SETTINGS ---
  getSettings() {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return safeParseJSON(data, DEFAULT_SETTINGS);
  },

  updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  },

  // --- CHAT SESSIONS (IndexedDB) ---
  async getChatSessions() {
    const db = await getDB();
    const tx = db.transaction('chatSessions', 'readonly');
    const store = tx.objectStore('chatSessions');
    const sessions = await store.getAll();
    return sessions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  async getChatSessionById(id) {
    const db = await getDB();
    return await db.get('chatSessions', id);
  },

  async getChatSessionByCharacter(characterId) {
    const db = await getDB();
    const index = db.transaction('chatSessions', 'readonly').objectStore('chatSessions').index('characterId');
    const sessions = await index.getAll(characterId);
    if (sessions.length > 0) {
      return sessions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
    }
    return null;
  },

  async createChatSession(characterId, personaId, customTitle = null) {
    const db = await getDB();
    const character = this.getCharacterById(characterId);
    const title = customTitle || `Chat with ${character ? character.name : 'AI Character'}`;

    const newSession = {
      id: generateId('session'),
      characterId,
      personaId,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.put('chatSessions', newSession);

    // If character has a greeting message, add it as first message
    if (character && character.greeting) {
      const greetingMsg = {
        id: generateId('msg'),
        sessionId: newSession.id,
        role: 'assistant',
        content: character.greeting,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        edited: false
      };
      await db.put('messages', greetingMsg);
    }

    return newSession;
  },

  async updateChatSession(id, fields) {
    const db = await getDB();
    const session = await db.get('chatSessions', id);
    if (!session) return null;

    const updated = {
      ...session,
      ...fields,
      updatedAt: new Date().toISOString()
    };
    await db.put('chatSessions', updated);
    return updated;
  },

  async deleteChatSession(id) {
    const db = await getDB();
    await db.delete('chatSessions', id);

    // Delete messages associated with this session
    const tx = db.transaction('messages', 'readwrite');
    const index = tx.objectStore('messages').index('sessionId');
    const messageKeys = await index.getAllKeys(id);
    for (const key of messageKeys) {
      await tx.objectStore('messages').delete(key);
    }
    await tx.done;
  },

  async deleteSessionsByCharacterId(characterId) {
    const db = await getDB();
    const tx = db.transaction(['chatSessions', 'messages'], 'readwrite');
    const sessionIndex = tx.objectStore('chatSessions').index('characterId');
    const sessions = await sessionIndex.getAll(characterId);

    for (const session of sessions) {
      await tx.objectStore('chatSessions').delete(session.id);
      const msgIndex = tx.objectStore('messages').index('sessionId');
      const msgKeys = await msgIndex.getAllKeys(session.id);
      for (const msgKey of msgKeys) {
        await tx.objectStore('messages').delete(msgKey);
      }
    }
    await tx.done;
  },

  // --- MESSAGES (IndexedDB) ---
  async getMessages(sessionId) {
    const db = await getDB();
    const tx = db.transaction('messages', 'readonly');
    const index = tx.objectStore('messages').index('sessionId');
    const messages = await index.getAll(sessionId);
    return messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  },

  async addMessage(sessionId, role, content) {
    const db = await getDB();
    const newMessage = {
      id: generateId('msg'),
      sessionId,
      role,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      edited: false
    };

    await db.put('messages', newMessage);
    await this.updateChatSession(sessionId, { updatedAt: new Date().toISOString() });
    return newMessage;
  },

  async updateMessage(messageId, newContent) {
    const db = await getDB();
    const message = await db.get('messages', messageId);
    if (!message) return null;

    const updated = {
      ...message,
      content: newContent,
      updatedAt: new Date().toISOString(),
      edited: true
    };

    await db.put('messages', updated);
    await this.updateChatSession(message.sessionId, { updatedAt: new Date().toISOString() });
    return updated;
  },

  async deleteMessage(messageId) {
    const db = await getDB();
    const message = await db.get('messages', messageId);
    if (message) {
      await db.delete('messages', messageId);
      await this.updateChatSession(message.sessionId, { updatedAt: new Date().toISOString() });
    }
  },

  async deleteMessagesFromId(sessionId, startMessageId) {
    const db = await getDB();
    const messages = await this.getMessages(sessionId);
    const targetIndex = messages.findIndex(m => m.id === startMessageId);

    if (targetIndex !== -1) {
      const messagesToDelete = messages.slice(targetIndex);
      const tx = db.transaction('messages', 'readwrite');
      for (const msg of messagesToDelete) {
        await tx.objectStore('messages').delete(msg.id);
      }
      await tx.done;
    }
  },

  async overwriteMessages(sessionId, newMessagesArray) {
    const db = await getDB();
    // Delete old messages
    const txDelete = db.transaction('messages', 'readwrite');
    const index = txDelete.objectStore('messages').index('sessionId');
    const oldKeys = await index.getAllKeys(sessionId);
    for (const k of oldKeys) {
      await txDelete.objectStore('messages').delete(k);
    }
    await txDelete.done;

    // Insert new messages
    const txInsert = db.transaction('messages', 'readwrite');
    for (const msg of newMessagesArray) {
      await txInsert.objectStore('messages').put({
        ...msg,
        sessionId,
        updatedAt: new Date().toISOString()
      });
    }
    await txInsert.done;
    await this.updateChatSession(sessionId, { updatedAt: new Date().toISOString() });
  },

  // --- MEMORIES (IndexedDB) ---
  async getMemories(characterId) {
    const db = await getDB();
    const tx = db.transaction('memories', 'readonly');
    const index = tx.objectStore('memories').index('characterId');
    return await index.getAll(characterId);
  },

  async addMemory(characterId, content) {
    const db = await getDB();
    const newMemory = {
      id: generateId('mem'),
      characterId,
      content,
      createdAt: new Date().toISOString()
    };
    await db.put('memories', newMemory);
    return newMemory;
  },

  async updateMemory(id, content) {
    const db = await getDB();
    const memory = await db.get('memories', id);
    if (!memory) return null;

    const updated = { ...memory, content, updatedAt: new Date().toISOString() };
    await db.put('memories', updated);
    return updated;
  },

  async deleteMemory(id) {
    const db = await getDB();
    await db.delete('memories', id);
  },

  async clearMemories(characterId) {
    const db = await getDB();
    const tx = db.transaction('memories', 'readwrite');
    const index = tx.objectStore('memories').index('characterId');
    const keys = await index.getAllKeys(characterId);
    for (const k of keys) {
      await tx.objectStore('memories').delete(k);
    }
    await tx.done;
  },

  // --- STORAGE STATS & WIPE ---
  async getStorageStats() {
    const characters = this.getCharacters();
    const personas = this.getPersonas();
    const sessions = await this.getChatSessions();
    const db = await getDB();
    const messagesCount = await db.count('messages');

    return {
      charactersCount: characters.length,
      personasCount: personas.length,
      sessionsCount: sessions.length,
      messagesCount
    };
  },

  async clearAllData() {
    localStorage.removeItem(KEYS.CHARACTERS);
    localStorage.removeItem(KEYS.PERSONAS);
    localStorage.removeItem(KEYS.ACTIVE_PERSONA_ID);
    localStorage.removeItem(KEYS.SETTINGS);
    localStorage.removeItem(KEYS.INITIALIZED);

    const db = await getDB();
    await db.clear('chatSessions');
    await db.clear('messages');
    await db.clear('memories');

    // Re-init with seed data
    await this.initStorage();
  }
};
