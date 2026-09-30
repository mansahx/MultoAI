import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCharacters } from '../hooks/useCharacters';
import { PageHeader } from '../components/layout/PageHeader';
import { PersonalityChips } from '../components/character/PersonalityChips';
import { CharacterCard } from '../components/character/CharacterCard';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Save, Sparkles, User, MessageSquare } from 'lucide-react';
import { AvatarSelector } from '../components/character/AvatarSelector';

export const EditCharacter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCharacter, updateCharacter } = useCharacters();

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const char = getCharacter(id);
    if (!char) {
      navigate('/characters');
      return;
    }

    setFormData({
      ...char,
      likes: Array.isArray(char.likes) ? char.likes.join(', ') : char.likes || '',
      dislikes: Array.isArray(char.dislikes) ? char.dislikes.join(', ') : char.dislikes || '',
      personality: Array.isArray(char.personality) ? char.personality : (char.personality || '').split(',').map(s=>s.trim()).filter(Boolean)
    });
  }, [id, getCharacter, navigate]);

  if (!formData) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.greeting.trim()) {
      alert('Please fill out required fields (Name, Short Description, and Greeting Message).');
      return;
    }

    const payload = {
      ...formData,
      age: parseInt(formData.age, 10) || 20,
      likes: typeof formData.likes === 'string' ? formData.likes.split(',').map(s => s.trim()).filter(Boolean) : formData.likes,
      dislikes: typeof formData.dislikes === 'string' ? formData.dislikes.split(',').map(s => s.trim()).filter(Boolean) : formData.dislikes,
    };

    updateCharacter(id, payload);
    navigate(`/characters/${id}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Edit Character: ${formData.name}`}
        description="Update information, personality traits, greeting message, and scenario for this character."
        action={
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(`/characters/${id}`)}>
            Back
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 flex flex-col gap-6">
          {/* Main Identity */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-5">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <User className="w-4 h-4 text-indigo-400" /> Main Character Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Character Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <AvatarSelector
                  value={formData.avatar}
                  onChange={(newAvatar) => setFormData(prev => ({ ...prev, avatar: newAvatar }))}
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
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Short Description *</label>
              <textarea
                name="description"
                required
                rows={2}
                value={formData.description}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Personality & Style */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-5">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-purple-400" /> Personality & Traits
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Personality Tag Chips</label>
              <PersonalityChips
                value={formData.personality}
                onChange={(newTraits) => setFormData(prev => ({ ...prev, personality: newTraits }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Likes</label>
                <input
                  type="text"
                  name="likes"
                  value={formData.likes}
                  onChange={handleChange}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Dislikes</label>
                <input
                  type="text"
                  name="dislikes"
                  value={formData.dislikes}
                  onChange={handleChange}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Speaking Style</label>
              <input
                type="text"
                name="speakingStyle"
                value={formData.speakingStyle}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Scenario */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-5">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <MessageSquare className="w-4 h-4 text-cyan-400" /> Scenario & Greeting Message
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Greeting Message *</label>
              <textarea
                name="greeting"
                required
                rows={3}
                value={formData.greeting}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-serif italic"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Scenario</label>
              <textarea
                name="scenario"
                rows={2}
                value={formData.scenario}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Background Bio</label>
              <textarea
                name="background"
                rows={3}
                value={formData.background}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(`/characters/${id}`)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" icon={Save} size="lg">
              Save Changes
            </Button>
          </div>
        </form>

        {/* Live Preview */}
        <div className="flex flex-col gap-4">
          <div className="sticky top-20 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Preview
            </h3>
            <CharacterCard character={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};
