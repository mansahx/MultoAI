# Multo AI — Modern AI Roleplay Studio

> **A 100% Client-Side, Privacy-First AI Roleplay Web Platform powered by Unimodel AI (`deepseek-v4-flash`).**

![Multo AI Pitch Black Theme](https://img.shields.io/badge/Aesthetics-Pitch--Black_Solid-050507?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss)
![AI Model](https://img.shields.io/badge/AI_Model-deepseek--v4--flash-6366F1?style=for-the-badge&logo=openai)
![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)

---

## 🌟 Overview

**Multo AI** is a state-of-the-art, open-source AI roleplay studio designed for immersive character interaction. Built entirely with **React + Vite** without any server-side backend, **all chat sessions, character profiles, user personas, and memories are stored 100% locally in your browser** via `localStorage` and `IndexedDB`.

It integrates seamlessly with the **Unimodel AI API** using the powerful `deepseek-v4-flash` model to deliver rapid, emotionally nuanced, and context-aware responses.

---

## Key Features

### 1. Rich AI Character Studio
- **Custom Character Creation**: Define character bios, age, gender, greeting messages, personality traits, likes/dislikes, speaking styles, and system guardrails.
- **Local Device Avatar Upload**: Drag & drop or upload avatar images directly from your device (converted to instant Base64 Data URL) or paste external image links.
- **Pre-loaded Sample Characters**: Includes pre-seeded characters such as *Aiko Vance*, *Lyra*, *Archmage Eldrin*, and *Captain Kaelen Vance*.

### 2. Dynamic User Persona System
- Create multiple user personas (e.g. *Alex the Traveler*, *Detective Morgan*).
- Switch active personas on the fly. The AI dynamically adapts its tone and dialogue based on your active persona's background and appearance.

### 3. Real-Time SSE Streaming Chat
- Powered by `deepseek-v4-flash` with Server-Sent Events (SSE) streaming for real-time text output.
- Markdown rendering, asterisks action formatting (*smiles softly*), inline message editing, quick response regeneration, and abort/stop generation controls.

### 4. Interactive Memory Drawer
- Add, update, or remove key character facts and memories.
- Memories are injected directly into the system prompt so AI characters remember important details across sessions.

### 5. 100% Privacy & Zero Backend
- **No external database server**. Your conversations and private data never leave your browser.
- Uses `IndexedDB` for high-capacity chat message storage and `localStorage` for app settings.

### 6. Full Data Export & Backup
- **JSON Import/Export**: Backup individual chat histories or export your entire Multo AI database (characters, personas, settings, memories) to a single JSON file.

### 7. Elegant Pitch-Black Design System
- Modern, clean, dark UI without aggressive color gradients.
- Crafted with solid pitch-black aesthetics (`#050507`), glassmorphism panels, and smooth micro-animations.

---

## Tech Stack

| Component | Technology Used |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom Pitch-Black Glassmorphism |
| **Icons** | [Lucide React](https://lucide.react.dev/) |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) |
| **Storage Layer** | LocalStorage + [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (via `idb`) |
| **AI Provider** | [Unimodel AI API](https://unimodel.ai/) (`deepseek-v4-flash`) |

---

## Quick Start (Run Locally)

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/multo-ai.git
   cd multo-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory (or copy `.env.example`):
   ```env
   VITE_UNIMODEL_API_KEY=your_unimodel_api_key_here
   VITE_UNIMODEL_BASE_URL=https://api.unimodel.ai/v1
   VITE_UNIMODEL_MODEL=deepseek-v4-flash
   ```
   > *Note: You can also leave `.env` empty and enter your API Key directly inside the app's **Settings** page or hardcode it in `src/services/aiService.js`.*

4. **Launch Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## Deploying to Vercel

Multo AI is 100% static-ready and optimized for one-click deployment on [Vercel](https://vercel.com/):

1. **Push your code** to GitHub or GitLab.
2. **Import Project** on Vercel Dashboard.
3. **Set Environment Variable** in Vercel Project Settings:
   - `VITE_UNIMODEL_API_KEY`: `your_unimodel_api_key`
4. **Deploy!** The included `vercel.json` ensures SPA routes like `/characters/create` work seamlessly without 404 errors on page refresh.

---

## Project Structure

```
Multo AI/
├── public/                  # Static public assets
├── src/
│   ├── components/          # Reusable UI & Feature components
│   │   ├── character/       # Character cards, tags, AvatarSelector (Device Upload)
│   │   ├── chat/            # Chat bubbles, header, memory drawer, prompt editor
│   │   ├── layout/          # Navbar, Sidebar, AppLayout
│   │   ├── persona/         # User persona cards
│   │   ├── settings/        # API key form, storage stats widget
│   │   └── ui/              # Buttons, Modals, Toasts, ErrorBoundary
│   ├── context/             # AppContext & ChatContext state providers
│   ├── hooks/               # Custom React hooks (useCharacters, usePersonas, useChat)
│   ├── pages/               # Application pages (Dashboard, Chat, CreateCharacter, etc.)
│   ├── services/            # Storage (IndexedDB/LocalStorage), AI API, Memories, Backup
│   ├── utils/               # Seed data, ID generator, formatters
│   ├── App.jsx              # React Router routing setup
│   ├── main.jsx             # Entry point
│   └── index.css            # Dark theme styles & tokens
├── .env.example             # Environment template
├── vercel.json              # Vercel SPA rewrite configuration
├── vite.config.js           # Vite configuration
└── package.json             # Project dependencies & scripts
```

---

## Screenshots
<img width="1920" height="897" alt="image" src="https://github.com/user-attachments/assets/9a739934-b542-446b-9802-c6f93e6b527f" />
<img width="1920" height="903" alt="image" src="https://github.com/user-attachments/assets/dd137491-cae2-42fe-a360-7035c8bdee78" />
<img width="1920" height="904" alt="image" src="https://github.com/user-attachments/assets/cffd36b7-07f7-42be-bcb5-86f6e24f68ce" />
<img width="1920" height="898" alt="image" src="https://github.com/user-attachments/assets/8d9a7cb3-2df6-4b06-a4ae-692f40af9220" />
<img width="1920" height="901" alt="image" src="https://github.com/user-attachments/assets/37110e66-7123-47b1-9695-c2cce3df8e26" />

---

## License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p center align="center">
  Crafted with ❤️ for AI Roleplay Enthusiasts. Built with React & Unimodel AI. by Mansahx
</p>
