import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersonas } from '../hooks/usePersonas';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Save, UserCheck } from 'lucide-react';

export const CreatePersona = () => {
  const navigate = useNavigate();
  const { createPersona } = usePersonas();

  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    age: '24',
    gender: 'Non-binary',
    occupation: 'Explorer',
    description: '',
    personality: 'Curious, resourceful, kind',
    appearance: 'Casual explorer outfit',
    background: 'Traveled through many distant lands seeking knowledge.',
    likes: 'Good books, campfire stories',
    dislikes: 'Arrogance',
    speakingStyle: 'Thoughtful, warm',
    additionalInformation: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.displayName.trim()) {
      alert('Please fill out Persona Name and Display Name.');
      return;
    }

    createPersona(formData);
    navigate('/personas');
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <PageHeader
        title="Create New User Persona"
        description="This persona will be included in the AI System Prompt so characters recognize your identity."
        action={
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate('/personas')}>
            Cancel
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">User Identity Profile</h3>
            <p className="text-xs text-slate-400">Define how AI characters address and interact with you</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Persona Name (Internal Label) *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Main Persona, Fantasy OC"
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-semibold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Display Name (Name in Chat) *</label>
            <input
              type="text"
              name="displayName"
              required
              value={formData.displayName}
              onChange={handleChange}
              placeholder="e.g. Alex, Rowan"
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-semibold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Gender</label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Occupation / Role</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="e.g. Detective, Apprentice, Student"
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Speaking Style</label>
            <input
              type="text"
              name="speakingStyle"
              value={formData.speakingStyle}
              onChange={handleChange}
              placeholder="Casual, formal, curious..."
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Short Persona Description</label>
          <textarea
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleChange}
            placeholder="Summary about yourself or character..."
            className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Personality Traits</label>
          <input
            type="text"
            name="personality"
            value={formData.personality}
            onChange={handleChange}
            placeholder="Patient, clever, brave..."
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Background Story</label>
          <textarea
            name="background"
            rows={3}
            value={formData.background}
            onChange={handleChange}
            placeholder="Your persona's backstory or origins..."
            className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Additional AI Notes</label>
          <textarea
            name="additionalInformation"
            rows={2}
            value={formData.additionalInformation}
            onChange={handleChange}
            placeholder="Special instructions to provide AI regarding this persona..."
            className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={() => navigate('/personas')}>
            Cancel
          </Button>
          <Button type="submit" variant="accent" icon={Save}>
            Save New Persona
          </Button>
        </div>
      </form>
    </div>
  );
};
