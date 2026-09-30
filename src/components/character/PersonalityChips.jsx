import React, { useState } from 'react';
import { Badge } from '../ui/Badge';
import { Plus } from 'lucide-react';

const PREDEFINED_TRAITS = [
  'Friendly',
  'Sarcastic',
  'Shy',
  'Intelligent',
  'Playful',
  'Protective',
  'Cold',
  'Romantic',
  'Mysterious',
  'Cynical',
  'Wise',
  'Energetic',
  'Loyal'
];

export const PersonalityChips = ({ value = [], onChange }) => {
  const [customInput, setCustomInput] = useState('');

  const handleToggle = (trait) => {
    if (value.includes(trait)) {
      onChange(value.filter(t => t !== trait));
    } else {
      onChange([...value, trait]);
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setCustomInput('');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Selected Traits */}
      <div className="flex flex-wrap gap-2 p-3 bg-slate-900/80 border border-slate-800 rounded-xl min-h-[48px] items-center">
        {value.length === 0 ? (
          <span className="text-xs text-slate-500 italic">Pilih atau tambahkan sifat kepribadian...</span>
        ) : (
          value.map((trait) => (
            <Badge
              key={trait}
              variant="purple"
              size="md"
              onRemove={() => handleToggle(trait)}
            >
              {trait}
            </Badge>
          ))
        )}
      </div>

      {/* Quick Select Chips */}
      <div className="flex flex-wrap gap-1.5">
        {PREDEFINED_TRAITS.map((trait) => {
          const isSelected = value.includes(trait);
          return (
            <button
              type="button"
              key={trait}
              onClick={() => handleToggle(trait)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-500 font-semibold shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {isSelected ? `✓ ${trait}` : `+ ${trait}`}
            </button>
          );
        })}
      </div>

      {/* Add Custom Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Tambahkan sifat kustom..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddCustom(e);
            }
          }}
        />
        <button
          type="button"
          onClick={handleAddCustom}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah
        </button>
      </div>
    </div>
  );
};
