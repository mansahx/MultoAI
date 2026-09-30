import React, { useState } from 'react';
import { Upload, Link, Image as ImageIcon, X, Check } from 'lucide-react';

export const AvatarSelector = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'url'
  const [urlInput, setUrlInput] = useState(value?.startsWith('http') ? value : '');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read file as Base64 Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target.result;
      onChange(base64Url);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header Tabs */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300">Avatar Karakter *</label>
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3 h-3" />
            Upload Device
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'url'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Link className="w-3 h-3" />
            URL Gambar
          </button>
        </div>
      </div>

      {/* Main Selector Box */}
      <div className="flex items-center gap-4 p-4 glass-card rounded-xl border border-slate-800">
        {/* Preview Thumbnail */}
        <div className="relative group shrink-0">
          {value ? (
            <img
              src={value}
              alt="Avatar preview"
              className="w-16 h-16 rounded-xl object-cover border border-slate-700 shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80';
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white p-1 rounded-full shadow-md hover:bg-rose-500 transition-colors"
              title="Hapus Gambar"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Tab Controls */}
        <div className="flex-1 min-w-0">
          {activeTab === 'upload' ? (
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl cursor-pointer bg-slate-900/60 hover:bg-slate-900 transition-all text-xs font-semibold text-slate-300">
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Pilih Gambar dari Komputer / Perangkat</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-slate-500">Format: PNG, JPG, WEBP, GIF. Otomatis dikonversi ke Base64 lokal.</p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Check className="w-3.5 h-3.5" /> Set URL
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
