import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Save, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HistoryEditorModal = ({
  isOpen,
  onClose,
  messages = [],
  onSaveHistory
}) => {
  const { addToast } = useApp();
  const [jsonContent, setJsonContent] = useState('');
  const [parseError, setParseError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const formatted = messages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt
      }));
      setJsonContent(JSON.stringify(formatted, null, 2));
      setParseError(null);
    }
  }, [isOpen, messages]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!Array.isArray(parsed)) {
        throw new Error('Data riwayat harus berupa array JSON');
      }

      onSaveHistory(parsed);
      onClose();
    } catch (err) {
      setParseError(err.message);
      addToast(`Error JSON Syntax: ${err.message}`, 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Conversation History (Context Manual)"
      maxWidth="max-w-3xl"
    >
      <div className="flex flex-col gap-4">
        <p className="text-xs text-slate-400 bg-slate-900 border border-slate-800 p-3 rounded-xl">
          Anda dapat menyunting riwayat pesan percakapan secara langsung. Format berupa array JSON dari objek pesan <code className="text-indigo-300">{"{ role: 'user'|'assistant', content: string }"}</code>.
        </p>

        {parseError && (
          <div className="p-3 bg-rose-950/80 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{parseError}</span>
          </div>
        )}

        <textarea
          value={jsonContent}
          onChange={(e) => {
            setJsonContent(e.target.value);
            setParseError(null);
          }}
          className="w-full font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl p-4 text-emerald-300 focus:outline-none focus:border-indigo-500 min-h-[350px] leading-relaxed"
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" icon={Save} onClick={handleSave}>
            Simpan Perubahan History
          </Button>
        </div>
      </div>
    </Modal>
  );
};
