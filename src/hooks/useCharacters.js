import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { useApp } from '../context/AppContext';

export const useCharacters = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useApp();

  const loadCharacters = useCallback(() => {
    setLoading(true);
    try {
      const list = storageService.getCharacters();
      setCharacters(list);
    } catch (err) {
      console.error('Failed to load characters:', err);
      addToast('Failed to load character list', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  const getCharacter = useCallback((id) => {
    return storageService.getCharacterById(id);
  }, []);

  const createCharacter = useCallback((data) => {
    const created = storageService.createCharacter(data);
    loadCharacters();
    addToast(`Character "${created.name}" created successfully`, 'success');
    return created;
  }, [loadCharacters, addToast]);

  const updateCharacter = useCallback((id, data) => {
    const updated = storageService.updateCharacter(id, data);
    loadCharacters();
    addToast('Character updated successfully', 'success');
    return updated;
  }, [loadCharacters, addToast]);

  const deleteCharacter = useCallback((id) => {
    const char = storageService.getCharacterById(id);
    const name = char ? char.name : 'Character';
    storageService.deleteCharacter(id);
    loadCharacters();
    addToast(`Character "${name}" has been deleted`, 'info');
  }, [loadCharacters, addToast]);

  const toggleFavorite = useCallback((id) => {
    const updated = storageService.toggleFavoriteCharacter(id);
    loadCharacters();
    if (updated) {
      addToast(
        updated.favorite
          ? `"${updated.name}" added to Favorites`
          : `"${updated.name}" removed from Favorites`,
        'info'
      );
    }
  }, [loadCharacters, addToast]);

  const duplicateCharacter = useCallback((id) => {
    const original = storageService.getCharacterById(id);
    if (!original) return null;

    const copyData = {
      ...original,
      id: undefined,
      name: `${original.name} (Copy)`,
      createdAt: undefined,
      updatedAt: undefined
    };

    const newChar = storageService.createCharacter(copyData);
    loadCharacters();
    addToast(`Duplicate character "${newChar.name}" created`, 'success');
    return newChar;
  }, [loadCharacters, addToast]);

  return {
    characters,
    loading,
    refreshCharacters: loadCharacters,
    getCharacter,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    toggleFavorite,
    duplicateCharacter
  };
};
