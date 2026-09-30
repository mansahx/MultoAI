import { storageService } from './storageService';

export const exportService = {
  // Export single chat session with character, persona, messages, and memories
  async exportChatSession(sessionId) {
    const session = await storageService.getChatSessionById(sessionId);
    if (!session) throw new Error('Chat session not found');

    const character = storageService.getCharacterById(session.characterId);
    const persona = storageService.getPersonaById(session.personaId) || storageService.getActivePersona();
    const messages = await storageService.getMessages(sessionId);
    const memories = await storageService.getMemories(session.characterId);

    const exportData = {
      version: '1.0',
      type: 'multo_ai_chat_session',
      exportDate: new Date().toISOString(),
      session,
      character,
      persona,
      messages,
      memories
    };

    const fileName = `MultoAI_${character ? character.name.replace(/[^a-z0-9]/gi, '_') : 'Chat'}_${new Date().toISOString().slice(0, 10)}.json`;
    this.downloadJSON(exportData, fileName);
  },

  // Export full backup (all characters, personas, sessions, settings)
  async exportFullBackup() {
    const characters = storageService.getCharacters();
    const personas = storageService.getPersonas();
    const sessions = await storageService.getChatSessions();
    const settings = storageService.getSettings();

    const fullSessions = [];
    for (const s of sessions) {
      const msgs = await storageService.getMessages(s.id);
      fullSessions.push({ ...s, messages: msgs });
    }

    const backupData = {
      version: '1.0',
      type: 'multo_ai_full_backup',
      exportDate: new Date().toISOString(),
      characters,
      personas,
      sessions: fullSessions,
      settings
    };

    const fileName = `MultoAI_FullBackup_${new Date().toISOString().slice(0, 10)}.json`;
    this.downloadJSON(backupData, fileName);
  },

  // Download object as JSON file
  downloadJSON(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Import JSON file
  async importJSONFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const parsed = JSON.parse(e.target.result);

          if (parsed.type === 'multo_ai_chat_session') {
            const importedSession = await this.importChatSession(parsed);
            resolve({ type: 'session', data: importedSession });
          } else if (parsed.type === 'multo_ai_full_backup') {
            await this.importFullBackup(parsed);
            resolve({ type: 'full_backup' });
          } else {
            reject(new Error('Invalid or unsupported JSON file format'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  async importChatSession(data) {
    const { character, persona, session, messages, memories } = data;

    // Ensure character exists or recreate
    let charId = character?.id;
    if (character) {
      const existingChar = storageService.getCharacterById(charId);
      if (!existingChar) {
        storageService.createCharacter(character);
      }
    }

    // Ensure persona exists or recreate
    let personaId = persona?.id;
    if (persona) {
      const existingPersona = storageService.getPersonaById(personaId);
      if (!existingPersona) {
        storageService.createPersona(persona);
      }
    }

    // Create imported session
    const newSession = await storageService.createChatSession(
      charId || 'char_imported',
      personaId || storageService.getActivePersonaId(),
      session?.title ? `[Imported] ${session.title}` : `Imported Chat`
    );

    // Overwrite messages
    if (messages && Array.isArray(messages)) {
      await storageService.overwriteMessages(newSession.id, messages);
    }

    // Add memories if available
    if (memories && Array.isArray(memories) && charId) {
      for (const mem of memories) {
        await storageService.addMemory(charId, mem.content);
      }
    }

    return newSession;
  },

  async importFullBackup(data) {
    if (data.characters && Array.isArray(data.characters)) {
      storageService.saveCharacters(data.characters);
    }
    if (data.personas && Array.isArray(data.personas)) {
      storageService.savePersonas(data.personas);
    }
    if (data.settings) {
      storageService.updateSettings(data.settings);
    }
    if (data.sessions && Array.isArray(data.sessions)) {
      for (const s of data.sessions) {
        const created = await storageService.createChatSession(s.characterId, s.personaId, s.title);
        if (s.messages && Array.isArray(s.messages)) {
          await storageService.overwriteMessages(created.id, s.messages);
        }
      }
    }
  }
};
