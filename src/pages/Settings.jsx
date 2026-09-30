import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { ApiSettingsForm } from '../components/settings/ApiSettingsForm';
import { StorageStatsWidget } from '../components/settings/StorageStatsWidget';
import { useApp } from '../context/AppContext';

export const Settings = () => {
  const { settings, updateSettings } = useApp();

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <PageHeader
        title="App Settings"
        description="Configure Unimodel AI API Key, chat preferences, display theme, and local storage data."
      />

      {/* AI Provider Config */}
      <ApiSettingsForm />

      {/* Chat & UI Preferences */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-5">
        <h3 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">
          Chat & Conversation Preferences
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-200">Press Enter to Send</p>
              <p className="text-xs text-slate-400">If disabled, press the Send button to send messages</p>
            </div>
            <input
              type="checkbox"
              checked={settings.enterToSend !== false}
              onChange={(e) => updateSettings({ enterToSend: e.target.checked })}
              className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-200">Auto-Scroll Chat</p>
              <p className="text-xs text-slate-400">Automatically scroll down when new messages arrive</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoScroll !== false}
              onChange={(e) => updateSettings({ autoScroll: e.target.checked })}
              className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Local Storage Stats & Reset */}
      <StorageStatsWidget />
    </div>
  );
};
