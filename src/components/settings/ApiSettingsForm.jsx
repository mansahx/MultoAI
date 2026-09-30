import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Key, ShieldAlert, Cpu, Save, Sliders } from 'lucide-react';

export const ApiSettingsForm = () => {
  const { settings, updateSettings } = useApp();
  const [formData, setFormData] = useState({
    apiKey: settings.apiKey || '',
    baseUrl: settings.baseUrl || 'https://api.unimodel.ai/v1',
    model: settings.model || 'deepseek-v4-flash',
    temperature: settings.temperature ?? 0.7,
    maxTokens: settings.maxTokens ?? 2048,
    enableStreaming: settings.enableStreaming !== false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">Unimodel AI Provider</h3>
          <p className="text-xs text-slate-400">Konfigurasi API key dan parameter model deepseek-v4-flash</p>
        </div>
      </div>

      {/* Warning Box */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-semibold text-amber-300">Peringatan Keamanan API Key:</strong>
          <p className="text-amber-200/80 leading-relaxed">
            API key Anda disimpan secara lokal di browser ini (<code className="text-amber-300 font-mono">localStorage</code>).
            Jangan gunakan API key produksi yang sensitif jika aplikasi ini dibuka di tempat umum.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* API Key */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Unimodel API Key *</span>
            {formData.apiKey && <span className="text-emerald-400 text-[11px]">✓ Terisi</span>}
          </label>
          <div className="relative">
            <input
              type="password"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              placeholder="sk-unimodel-..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Base URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">API Base URL</label>
          <input
            type="text"
            name="baseUrl"
            value={formData.baseUrl}
            onChange={handleChange}
            placeholder="https://api.unimodel.ai/v1"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        {/* Model */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Model AI</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="deepseek-v4-flash"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-indigo-300 font-bold focus:outline-none focus:border-indigo-500"
          />
          <p className="text-[11px] text-slate-500">Default: <code className="text-slate-400">deepseek-v4-flash</code></p>
        </div>

        {/* Temperature */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 flex justify-between">
            <span>Temperature: {formData.temperature}</span>
            <span className="text-slate-500 text-[11px]">Kreativitas</span>
          </label>
          <input
            type="range"
            name="temperature"
            min="0.1"
            max="1.5"
            step="0.05"
            value={formData.temperature}
            onChange={handleChange}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Max Tokens */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Max Response Tokens</label>
          <input
            type="number"
            name="maxTokens"
            value={formData.maxTokens}
            onChange={handleChange}
            min="256"
            max="8192"
            step="128"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Checkbox Streaming */}
      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          id="enableStreaming"
          name="enableStreaming"
          checked={formData.enableStreaming}
          onChange={handleChange}
          className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="enableStreaming" className="text-xs text-slate-300 font-medium cursor-pointer">
          Aktifkan Streaming Response (Realtime Typing Indicator token-by-token)
        </label>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-800">
        <Button type="submit" variant="accent" icon={Save}>
          Simpan Konfigurasi AI
        </Button>
      </div>
    </form>
  );
};
