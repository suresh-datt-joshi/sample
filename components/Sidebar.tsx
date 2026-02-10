
import React from 'react';
import { TabType } from '../App';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col items-center md:items-stretch py-6 px-4 shrink-0 transition-all">
      <div className="flex items-center gap-3 px-2 mb-10 overflow-hidden">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-100">
          <i className="fas fa-bolt text-lg"></i>
        </div>
        <span className="hidden md:block font-bold text-xl text-slate-800 tracking-tight">JumpIn</span>
      </div>

      <nav className="flex-1 space-y-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${
            activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <i className="fas fa-th-large text-lg"></i>
          <span className="hidden md:block">Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${
            activeTab === 'schedule' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <i className="fas fa-plus-circle text-lg"></i>
          <span className="hidden md:block">Schedule Meeting</span>
        </button>
        <button
          onClick={() => setActiveTab('platforms')}
          className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${
            activeTab === 'platforms' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <i className="fas fa-plug text-lg"></i>
          <span className="hidden md:block">Connected Sources</span>
        </button>
      </nav>

      <div className="mt-auto hidden md:block">
        <div className="p-4 bg-slate-900 rounded-2xl text-white">
          <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">Status</p>
          <p className="text-sm">2 platforms active.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
