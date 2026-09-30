import { storageService } from './storageService';

export const memoryService = {
  async getMemories(characterId) {
    if (!characterId) return [];
    return await storageService.getMemories(characterId);
  },

  async addMemory(characterId, content) {
    if (!characterId || !content.trim()) return null;
    return await storageService.addMemory(characterId, content.trim());
  },

  async updateMemory(memoryId, content) {
    if (!memoryId || !content.trim()) return null;
    return await storageService.updateMemory(memoryId, content.trim());
  },

  async deleteMemory(memoryId) {
    if (!memoryId) return;
    await storageService.deleteMemory(memoryId);
  },

  async clearMemories(characterId) {
    if (!characterId) return;
    await storageService.clearMemories(characterId);
  },

  formatMemoriesForPrompt(memories = []) {
    if (!memories || memories.length === 0) return '';
    const items = memories.map(m => `- ${m.content}`).join('\n');
    return `IMPORTANT MEMORIES & KNOWN FACTS ABOUT USER:\n${items}\n`;
  }
};
