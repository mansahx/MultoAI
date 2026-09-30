import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { useApp } from '../context/AppContext';

export const usePersonas = () => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { activePersona, setActivePersona, refreshPersonas, addToast } = useApp();

  const loadPersonas = useCallback(() => {
    setLoading(true);
    try {
      const list = storageService.getPersonas();
      setPersonas(list);
    } catch (err) {
      console.error('Failed to load personas:', err);
      addToast('Failed to load personas', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadPersonas();
  }, [loadPersonas]);

  const getPersona = useCallback((id) => {
    return storageService.getPersonaById(id);
  }, []);

  const createPersona = useCallback((data) => {
    const created = storageService.createPersona(data);
    loadPersonas();
    refreshPersonas();
    addToast(`Persona "${created.name}" created successfully`, 'success');
    return created;
  }, [loadPersonas, refreshPersonas, addToast]);

  const updatePersona = useCallback((id, data) => {
    const updated = storageService.updatePersona(id, data);
    loadPersonas();
    refreshPersonas();
    addToast('Persona updated successfully', 'success');
    return updated;
  }, [loadPersonas, refreshPersonas, addToast]);

  const deletePersona = useCallback((id) => {
    const persona = storageService.getPersonaById(id);
    const name = persona ? persona.name : 'Persona';
    storageService.deletePersona(id);
    loadPersonas();
    refreshPersonas();
    addToast(`Persona "${name}" has been deleted`, 'info');
  }, [loadPersonas, refreshPersonas, addToast]);

  const duplicatePersona = useCallback((id) => {
    const original = storageService.getPersonaById(id);
    if (!original) return null;

    const copyData = {
      ...original,
      id: undefined,
      name: `${original.name} (Copy)`,
      displayName: `${original.displayName} (Copy)`,
      createdAt: undefined,
      updatedAt: undefined
    };

    const newPersona = storageService.createPersona(copyData);
    loadPersonas();
    refreshPersonas();
    addToast(`Duplicate persona "${newPersona.name}" created`, 'success');
    return newPersona;
  }, [loadPersonas, refreshPersonas, addToast]);

  return {
    personas,
    activePersona,
    loading,
    refreshPersonas: loadPersonas,
    getPersona,
    createPersona,
    updatePersona,
    deletePersona,
    duplicatePersona,
    setActivePersona
  };
};
