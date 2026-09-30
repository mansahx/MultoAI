import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { generateId } from '../utils/helpers';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [settings, setSettings] = useState(() => storageService.getSettings());
  const [personas, setPersonas] = useState([]);
  const [activePersona, setActivePersonaState] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Initialize storage and load initial state
  useEffect(() => {
    const init = async () => {
      await storageService.initStorage();
      refreshSettings();
      refreshPersonas();
      setInitialized(true);
    };
    init();
  }, []);

  const refreshSettings = () => {
    const current = storageService.getSettings();
    setSettings(current);
  };

  const updateSettings = (newSettings) => {
    const updated = storageService.updateSettings(newSettings);
    setSettings(updated);
    addToast('Pengaturan berhasil disimpan', 'success');
  };

  const refreshPersonas = () => {
    const list = storageService.getPersonas();
    setPersonas(list);
    const active = storageService.getActivePersona();
    setActivePersonaState(active);
  };

  const setActivePersona = (personaId) => {
    storageService.setActivePersonaId(personaId);
    refreshPersonas();
    addToast('Persona aktif diperbarui', 'info');
  };

  // Toast System
  const addToast = (message, type = 'info', duration = 3500) => {
    const id = generateId('toast');
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        initialized,
        settings,
        updateSettings,
        refreshSettings,
        personas,
        activePersona,
        setActivePersona,
        refreshPersonas,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext };
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
export default AppContext;
