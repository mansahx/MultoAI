import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { exportService } from '../../services/exportService';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { ConfirmationDialog } from '../ui/ConfirmationDialog';
import { Database, Download, Upload, Trash2, HardDrive, RefreshCw } from 'lucide-react';

export const StorageStatsWidget = () => {
  const { addToast, refreshPersonas } = useApp();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmWipeOpen, setConfirmWipeOpen] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await storageService.getStorageStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load storage stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleExportBackup = async () => {
    try {
      await exportService.exportFullBackup();
      addToast('Backup lengkap berhasil di-download (JSON)', 'success');
    } catch (err) {
      addToast(`Gagal export backup: ${err.message}`, 'error');
    }
  };

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await exportService.importJSONFile(file);
      addToast('Data berhasil di-import dari file JSON!', 'success');
      loadStats();
      refreshPersonas();
    } catch (err) {
      addToast(`Gagal import data: ${err.message}`, 'error');
    }
    e.target.value = '';
  };

  const handleWipeData = async () => {
    try {
      await storageService.clearAllData();
      addToast('Semua data lokal telah dibersihkan dan di-reset ke data awal', 'info');
      setConfirmWipeOpen(false);
      loadStats();
      refreshPersonas();
    } catch (err) {
      addToast(`Gagal mereset data: ${err.message}`, 'error');
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Storage & Backup</h3>
            <p className="text-xs text-slate-400">Pengelolaan penyimpanan lokal browser (LocalStorage & IndexedDB)</p>
          </div>
        </div>

        <Button size="sm" variant="ghost" icon={RefreshCw} onClick={loadStats} />
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <p className="text-xl font-extrabold text-indigo-400">{stats ? stats.charactersCount : '-'}</p>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Karakter AI</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <p className="text-xl font-extrabold text-purple-400">{stats ? stats.personasCount : '-'}</p>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">User Personas</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <p className="text-xl font-extrabold text-cyan-400">{stats ? stats.sessionsCount : '-'}</p>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Chat Sessions</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <p className="text-xl font-extrabold text-emerald-400">{stats ? stats.messagesCount : '-'}</p>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Total Pesan</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            icon={Download}
            onClick={handleExportBackup}
          >
            Export Full Backup
          </Button>

          <label className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer font-medium transition-all">
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>

        <Button
          size="sm"
          variant="danger"
          icon={Trash2}
          onClick={() => setConfirmWipeOpen(true)}
        >
          Reset All Data
        </Button>
      </div>

      <ConfirmationDialog
        isOpen={confirmWipeOpen}
        onClose={() => setConfirmWipeOpen(false)}
        onConfirm={handleWipeData}
        title="Wipe & Reset Semua Data Lokal?"
        message="Tindakan ini akan menghapus seluruh Karakter, User Personas, Riwayat Percakapan, dan Memori yang tersimpan di browser Anda, lalu mengembalikannya ke data awal."
        confirmText="Hapus & Reset"
      />
    </div>
  );
};
