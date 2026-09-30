import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Star,
  Settings,
  Sparkles,
  MessageSquare,
  PlusCircle,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { activePersona } = useApp();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Characters', path: '/characters', icon: Users },
    { label: 'User Personas', path: '/personas', icon: UserCheck },
    { label: 'Favorites', path: '/characters?filter=favorites', icon: Star },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="p-5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <NavLink to="/dashboard" onClick={onClose} className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white border border-indigo-500/40 shadow-md group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  Multo <span className="text-indigo-400">AI</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Roleplay Studio</p>
              </div>
            </NavLink>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Create Button */}
          <NavLink
            to="/characters/create"
            onClick={onClose}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold border border-indigo-500/30 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            Create Character
          </NavLink>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                (item.path.includes('?') && location.pathname + location.search === item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Active Persona Widget */}
        <div className="p-4 m-3 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Persona Aktif</span>
            <NavLink to="/personas" onClick={onClose} className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium">
              Ubah
            </NavLink>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-900/80 border border-indigo-500/40 flex items-center justify-center text-indigo-200 font-bold text-xs shadow-md">
              {activePersona ? activePersona.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-200 truncate">
                {activePersona ? activePersona.displayName : 'Belum Ada Persona'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {activePersona ? activePersona.name : 'Pilih persona'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
