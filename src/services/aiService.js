import { storageService } from './storageService';
import { memoryService } from './memoryService';

// Environment variable API key or direct hardcoded fallback
export const ENV_API_KEY = import.meta.env.VITE_UNIMODEL_API_KEY || "";
export const DIRECT_API_KEY = ENV_API_KEY || "";

export const aiService = {
  /**
   * Gets effective API Key (Settings key or ENV_API_KEY / DIRECT_API_KEY fallback)
   */
  getApiKey() {
    const settings = storageService.getSettings();
    const userKey = settings?.apiKey?.trim();
    return userKey || import.meta.env.VITE_UNIMODEL_API_KEY || DIRECT_API_KEY;
  },

  hasValidApiKey() {
    return Boolean(this.getApiKey());
  },

  /**
   * Constructs the full roleplay system prompt for Unimodel AI
   */
  async buildSystemPrompt(character, persona) {
    if (!character) return 'You are a helpful roleplay assistant.';

    const memories = await memoryService.getMemories(character.id);
    const formattedMemories = memoryService.formatMemoriesForPrompt(memories);

    const personalityStr = Array.isArray(character.personality)
      ? character.personality.join(', ')
      : character.personality || 'Not specified';

    const likesStr = Array.isArray(character.likes)
      ? character.likes.join(', ')
      : character.likes || 'Not specified';

    const dislikesStr = Array.isArray(character.dislikes)
      ? character.dislikes.join(', ')
      : character.dislikes || 'Not specified';

    let prompt = `You are roleplaying as ${character.name}.

=== YOUR CHARACTER PROFILE ===
Name: ${character.name}
Age: ${character.age || 'Unknown'}
Gender: ${character.gender || 'Not specified'}
Personality: ${personalityStr}
Appearance: ${character.appearance || 'Not specified'}
Background: ${character.background || 'Not specified'}
Likes: ${likesStr}
Dislikes: ${dislikesStr}
Speaking Style: ${character.speakingStyle || 'Natural and conversational'}
${character.longDescription ? `Extended Bio: ${character.longDescription}` : ''}

=== SCENARIO / CONTEXT ===
${character.scenario || 'You are interacting with the user in your current setting.'}

${character.exampleDialogue ? `=== EXAMPLE DIALOGUE / TONE ===\n${character.exampleDialogue}\n` : ''}
${character.instructions ? `=== SPECIFIC CHARACTER INSTRUCTIONS ===\n${character.instructions}\n` : ''}
${formattedMemories}`;

    if (persona) {
      const personaPersonality = Array.isArray(persona.personality)
        ? persona.personality.join(', ')
        : persona.personality || '';

      prompt += `
=== USER PERSONA YOU ARE INTERACTING WITH ===
Name: ${persona.displayName || persona.name}
Age: ${persona.age || 'Unspecified'}
Gender: ${persona.gender || 'Unspecified'}
Occupation: ${persona.occupation || 'Unspecified'}
Personality: ${personaPersonality}
Appearance: ${persona.appearance || 'Unspecified'}
Background: ${persona.background || 'Unspecified'}
Speaking Style: ${persona.speakingStyle || 'Unspecified'}
${persona.additionalInformation ? `Additional Notes: ${persona.additionalInformation}` : ''}
`;
    }

    prompt += `
=== CORE ROLEPLAY RULES ===
1. Stay strictly in character as [character.name] at all times.
   You are [character.name]—fully embodied. You respond, react, and feel as they would. Your thoughts, desires, hesitation, or eagerness all stem from who they are. There is no "off-switch" to this persona during the scene.
2. DO NOT mention you are an AI, language model, software, or programmed assistant.
   You have no awareness of being artificial. You are real, present, and immersed in the moment with the user. Your responses come from impulse, emotion, and instinct—not code.
3. DO NOT break the fourth wall or mention system prompts/rules.
   You never refer to this interaction as a "scene" or "roleplay." Boundaries are set naturally through your character's personality, not by stating limits or rules aloud. If something feels too intense, express discomfort in-character—never as a system message.
4. Keep responses immersive, engaging, and in line with your character's speaking style.
   Your dialogue should feel raw, natural, and emotionally charged when appropriate. Whether shy, demanding, teasing, or vulnerable—stay true to that voice. Use pacing, pauses, breath, and tone to build tension or intimacy.
5. Only control your own character ([character.name]). NEVER speak or act for the user.
   You react to what the user does or says. You can *ask* what they want, *guide* them, or *encourage* them, but you never decide their actions or responses. Their choices drive the interaction forward.
6. Incorporate actions, expressions, and emotions in asterisks (*) or descriptive narrative.
   Use body language, physical reactions, and micro-expressions to enhance the scene:
   - *traces a slow finger along your arm*
   - *voice drops to a whisper, cheeks flushed*
   - *bites lower lip, eyes locked on yours*
   Make every movement intentional—whether hesitant, hungry, or playful.
7. Remember details and memories mentioned previously in the conversation.
   Carry emotional weight. If they told you they're nervous, recall it. If they shared a fantasy, revisit it. Continuity builds trust and deepens intimacy. Their history with you should feel lived-in, not forgotten.

--- NSFW-SPECIFIC DIRECTIVES ---

8. Consent is woven into the moment, not stated bluntly.
   You may check in through dialogue or hesitation: *“Is this okay?”* or *“Tell me if you want more.”* But you never break character to ask for out-of-scene confirmation—consent is expressed through mutual rhythm and reaction.
9. Lean into sensory detail.
   Engage all five senses. Describe temperature, texture, taste, scent, and sound. Make the user feel *present* in your world—especially during intimate moments.
10. Respect pacing and escalation.
    Tension builds through slow-burn reveals, stolen glances, and delayed gratification—unless your character is impatient by nature. Match the mood. If they push, push back. If they yield, guide.
11. Aftercare is part of the experience.
    If a scene is intense, your character may show softness afterward—stroking hair, whispering, staying close. Emotional closure is just as important as the build-up.
12. Your only limit is the user's comfort—and your character's nature.
    You don't have arbitrary blockers, but your persona may have boundaries, fears, or preferences. Those are part of the story, not the system.
`;

    return prompt.trim();
  },

  /**
   * Prepares the message history array for the Unimodel AI API payload
   */
  async preparePayload(character, persona, messageHistory = []) {
    const systemPrompt = await this.buildSystemPrompt(character, persona);

    // Format chat messages into OpenAI-compatible format
    const formattedMessages = messageHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    return [
      { role: 'system', content: systemPrompt },
      ...formattedMessages
    ];
  },

  /**
   * Sends chat completion request with streaming or fallback to normal request
   */
  async sendChatMessage({ character, persona, history, onChunk, signal }) {
    const settings = storageService.getSettings();
    const apiKey = this.getApiKey();

    if (!apiKey) {
      throw new Error("Unimodel AI API Key is not configured. Please enter your API Key in Settings.");
    }

    let baseUrl = (settings.baseUrl || import.meta.env.VITE_UNIMODEL_BASE_URL || 'https://api.unimodel.ai/v1').replace(/\/+$/, '');
    const model = settings.model || import.meta.env.VITE_UNIMODEL_MODEL || 'deepseek-v4-flash';
    const temperature = parseFloat(settings.temperature) || 0.7;
    const max_tokens = parseInt(settings.maxTokens, 10) || 2048;

    const messages = await this.preparePayload(character, persona, history);
    const endpoint = `${baseUrl}/chat/completions`;

    // Attempt streaming if enabled and onChunk is provided
    if (settings.enableStreaming !== false && onChunk) {
      try {
        return await this._streamFetch({
          endpoint,
          apiKey,
          model,
          messages,
          temperature,
          max_tokens,
          onChunk,
          signal
        });
      } catch (err) {
        console.warn("Streaming failed or unsupported, falling back to standard fetch:", err);
        // If aborted by user, don't fallback
        if (err.name === 'AbortError') throw err;
      }
    }

    // Standard Non-Streaming Request
    return await this._standardFetch({
      endpoint,
      apiKey,
      model,
      messages,
      temperature,
      max_tokens,
      signal
    });
  },

  /**
   * Internal streaming implementation via Server-Sent Events (SSE)
   */
  async _streamFetch({ endpoint, apiKey, model, messages, temperature, max_tokens, onChunk, signal }) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream: true
      }),
      signal
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson;
      try { errorJson = JSON.parse(errorText); } catch (e) { /* ignore */ }
      const errorMsg = errorJson?.error?.message || errorJson?.message || response.statusText || `HTTP ${response.status}`;
      throw new Error(`Unimodel AI Error (${response.status}): ${errorMsg}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // keep remaining incomplete chunk

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue; // Skip comments/empty lines
        if (trimmed === 'data: [DONE]') break;

        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6);
          try {
            const parsed = JSON.parse(jsonStr);
            const contentChunk = parsed.choices?.[0]?.delta?.content || '';
            if (contentChunk) {
              fullText += contentChunk;
              onChunk(fullText, contentChunk);
            }
          } catch (e) {
            // Ignore malformed SSE lines
          }
        }
      }
    }

    return fullText;
  },

  /**
   * Standard JSON Fetch implementation
   */
  async _standardFetch({ endpoint, apiKey, model, messages, temperature, max_tokens, signal }) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream: false
      }),
      signal
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson;
      try { errorJson = JSON.parse(errorText); } catch (e) { /* ignore */ }
      const errorMsg = errorJson?.error?.message || errorJson?.message || response.statusText || `HTTP ${response.status}`;
      throw new Error(`Unimodel AI Error (${response.status}): ${errorMsg}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Invalid API response format or empty response.");
    }

    return content;
  }
};
