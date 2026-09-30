import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Cpu, Key, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';

export const Navbar = ({ onToggleSidebar }) => {
  const { settings } = useApp();
  const hasApiKey = aiService.hasValidApiKey();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Model Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>Model: <strong className="text-indigo-300">{settings.model || 'deepseek-v4-flash'}</strong></span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* API Key Status Pill */}
        <NavLink
          to="/settings"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            hasApiKey
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 animate-pulse'
          }`}
        >
          {hasApiKey ? (
            <>
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span>API Key Configured</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Set API Key</span>
            </>
          )}
        </NavLink>
      </div>
    </header>
  );
};
