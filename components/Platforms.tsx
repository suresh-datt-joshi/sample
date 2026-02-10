
import React from 'react';
import { SyncSource } from '../types';

const SOURCES: SyncSource[] = [
  { id: '1', name: 'Gmail Inbox', icon: 'fab fa-google', connected: true, lastSynced: '2 mins ago' },
  { id: '2', name: 'WhatsApp Web', icon: 'fab fa-whatsapp', connected: false, lastSynced: null },
  { id: '3', name: 'Discord', icon: 'fab fa-discord', connected: true, lastSynced: '1 hour ago' },
  { id: '4', name: 'Outlook', icon: 'fas fa-envelope', connected: false, lastSynced: null },
  { id: '5', name: 'Slack Workspace', icon: 'fab fa-slack', connected: false, lastSynced: null },
  { id: '6', name: 'Microsoft Teams', icon: 'fas fa-users', connected: true, lastSynced: 'Just now' },
];

const Platforms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      <section className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Connected Sources</h1>
          <p className="text-slate-500 mt-1">Manage external sources where JumpIn automatically tracks and detects meeting invitations.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOURCES.map(source => (
            <div key={source.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between group hover:border-indigo-200 transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm border ${source.connected ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  <i className={source.icon}></i>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{source.name}</h3>
                  <p className="text-xs text-slate-400">
                    {source.connected ? `Last synced ${source.lastSynced}` : 'No active connection'}
                  </p>
                </div>
              </div>
              <button className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                source.connected ? 'text-red-500 hover:bg-red-50 border border-transparent' : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}>
                {source.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <i className="fas fa-shield-alt text-9xl"></i>
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-3">Privacy First</h2>
          <p className="text-indigo-100 max-w-xl">
            JumpIn only scans for meeting-related patterns (links, dates, and subjects). Your personal message content never leaves your device and is processed with end-to-end security.
          </p>
          <button className="mt-6 px-6 py-2 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
            Security Overview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Platforms;
