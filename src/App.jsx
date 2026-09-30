import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ChatProvider } from './context/ChatContext';
import { AppLayout } from './components/layout/AppLayout';

import { Dashboard } from './pages/Dashboard';
import { Characters } from './pages/Characters';
import { CreateCharacter } from './pages/CreateCharacter';
import { EditCharacter } from './pages/EditCharacter';
import { CharacterDetail } from './pages/CharacterDetail';
import { Personas } from './pages/Personas';
import { CreatePersona } from './pages/CreatePersona';
import { EditPersona } from './pages/EditPersona';
import { Chat } from './pages/Chat';
import { Settings } from './pages/Settings';

import { ErrorBoundary } from './components/ui/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <ChatProvider>
          <Routes>
            {/* Standard Pages wrapped in AppLayout */}
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />
            <Route
              path="/characters"
              element={
                <AppLayout>
                  <Characters />
                </AppLayout>
              }
            />
            <Route
              path="/characters/create"
              element={
                <AppLayout>
                  <CreateCharacter />
                </AppLayout>
              }
            />
            <Route
              path="/characters/:id"
              element={
                <AppLayout>
                  <CharacterDetail />
                </AppLayout>
              }
            />
            <Route
              path="/characters/:id/edit"
              element={
                <AppLayout>
                  <EditCharacter />
                </AppLayout>
              }
            />

            <Route
              path="/personas"
              element={
                <AppLayout>
                  <Personas />
                </AppLayout>
              }
            />
            <Route
              path="/personas/create"
              element={
                <AppLayout>
                  <CreatePersona />
                </AppLayout>
              }
            />
            <Route
              path="/personas/:id/edit"
              element={
                <AppLayout>
                  <EditPersona />
                </AppLayout>
              }
            />

            <Route
              path="/settings"
              element={
                <AppLayout>
                  <Settings />
                </AppLayout>
              }
            />

            {/* Chat page with full-height layout */}
            <Route
              path="/chat/:characterId"
              element={
                <AppLayout hideNavbar>
                  <Chat />
                </AppLayout>
              }
            />

            {/* Fallback & Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ChatProvider>
      </AppProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}
