import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacters } from '../hooks/useCharacters';
import { PageHeader } from '../components/layout/PageHeader';
import { PersonalityChips } from '../components/character/PersonalityChips';
import { CharacterCard } from '../components/character/CharacterCard';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Save, Sparkles, Image, User, MessageSquare } from 'lucide-react';
import { AvatarSelector } from '../components/character/AvatarSelector';

export const CreateCharacter = () => {
  const navigate = useNavigate();
  const { createCharacter } = useCharacters();

  const [formData, setFormData] = useState({
    name: '',
    avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
    description: '',
    longDescription: '',
    age: '24',
    gender: 'Female',
    personality: ['Friendly', 'Intelligent'],
    appearance: '',
    background: '',
    likes: 'Black Coffee, Books, Rain',
    dislikes: 'Rude behavior, Noise',
    speakingStyle: 'Warm, thoughtful, slightly formal',
    scenario: 'You meet in a quiet café on a misty evening.',
    greeting: '*Looks up with a welcoming smile.* "Hello there! Come in out of the cold. What brings you here today?"',
    exampleDialogue: 'User: "What are you reading?"\nAI: *Closes the book gently.* "Just an old classic. Do you enjoy stories of distant lands?"',
    instructions: 'Stay in character at all times. Respond with empathy and intelligence.',
    tags: ['Original', 'Companion', 'Roleplay']
  });

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

    const newChar = createCharacter(payload);
    navigate(`/characters/${newChar.id}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Create New AI Character"
        description="Design personality traits, speaking style, background, and opening greeting for your new roleplay character."
        action={
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form (2 Columns) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 flex flex-col gap-6">
          {/* Basic Info Box */}
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
                  placeholder="e.g. Aiko Vance"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-semibold"
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
                  placeholder="24"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Gender</label>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Female, Male, Android, etc."
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
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
                placeholder="Brief overview of character's role or occupation shown on character cards..."
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Personality & Style Box */}
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
                  placeholder="Coffee, Rain, Books (comma separated)"
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
                  placeholder="Noise, Hypocrisy (comma separated)"
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
                placeholder="e.g. Sarcastic, soft-spoken, tech jargon..."
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Scenario & Roleplay Setup */}
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
                placeholder="The initial message spoken by the character when chat begins..."
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-serif italic"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Scenario & Setting</label>
              <textarea
                name="scenario"
                rows={2}
                value={formData.scenario}
                onChange={handleChange}
                placeholder="Description of the environment or setup when starting the chat..."
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Background Story (Bio)</label>
              <textarea
                name="background"
                rows={3}
                value={formData.background}
                onChange={handleChange}
                placeholder="Life story or origins of the character..."
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Example Dialogue</label>
              <textarea
                name="exampleDialogue"
                rows={3}
                value={formData.exampleDialogue}
                onChange={handleChange}
                placeholder="User: ...&#10;AI: ..."
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Additional AI System Instructions</label>
              <textarea
                name="instructions"
                rows={2}
                value={formData.instructions}
                onChange={handleChange}
                placeholder="Specific system directives when roleplaying as this character..."
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" icon={Save} size="lg">
              Save New Character
            </Button>
          </div>
        </form>

        {/* Right Live Preview Column */}
        <div className="flex flex-col gap-4">
          <div className="sticky top-20 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Live Preview Card
            </h3>
            <CharacterCard
              character={{
                ...formData,
                id: 'preview_id',
                favorite: false
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
