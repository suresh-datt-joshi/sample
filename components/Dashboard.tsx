
import React, { useState, useEffect } from 'react';
import { Meeting, Platform } from '../types';
import MeetingCard from './MeetingCard';

interface DashboardProps {
  meetings: Meeting[];
}

const Dashboard: React.FC<DashboardProps> = ({ meetings }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayMeetings = meetings.filter(m => {
    const date = new Date(m.startTime);
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  // Platform count logic
  const platformCounts = todayMeetings.reduce((acc, m) => {
    acc[m.platform] = (acc[m.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const platforms = Object.keys(platformCounts) as Platform[];

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'Google Meet': return 'fab fa-google text-green-500';
      case 'Zoom': return 'fas fa-video text-blue-500';
      case 'Microsoft Teams': return 'fas fa-users text-indigo-500';
      case 'Slack': return 'fab fa-slack text-orange-400';
      case 'Discord': return 'fab fa-discord text-violet-500';
      default: return 'fas fa-link text-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* 1. Header: App Name Left, Platforms Right */}
      <header className="flex items-center justify-between bg-white px-8 py-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <i className="fas fa-bolt"></i>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">JumpIn</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {['Google Meet', 'Zoom', 'Microsoft Teams', 'Slack', 'Discord'].map((p) => (
            <div key={p} className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-help" title={p}>
              <i className={getPlatformIcon(p as Platform)}></i>
            </div>
          ))}
        </div>
      </header>

      {/* 2. Stats Row: Total Meetings & Platform Breakdown */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-auto bg-indigo-600 text-white px-8 py-6 rounded-[32px] shadow-xl shadow-indigo-100 flex flex-col justify-center min-w-[240px]">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">Today's Schedule</span>
          <h2 className="text-4xl font-black tracking-tight">{todayMeetings.length} Meetings</h2>
        </div>

        <div className="flex-1 w-full bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6 overflow-x-auto no-scrollbar">
          {platforms.length > 0 ? (
            platforms.map(p => (
              <div key={p} className="flex items-center gap-3 shrink-0 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <i className={getPlatformIcon(p)}></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p}</p>
                  <p className="text-sm font-black text-slate-800">{platformCounts[p]} scheduled</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400 font-medium italic text-sm px-4">No meetings tracked for today yet.</p>
          )}
        </div>
      </div>

      {/* 3. Meeting Cards: All meetings scheduled today */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Today's Agenda</h2>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {todayMeetings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {todayMeetings.map(m => (
              <MeetingCard key={m.id} meeting={m} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
              <i className="fas fa-calendar-day text-3xl"></i>
            </div>
            <p className="text-slate-400 font-bold">Your schedule is clear for today.</p>
            <button className="mt-4 text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Schedule something new</button>
          </div>
        )}
      </section>

      {/* Next Days Preview (Mini) */}
      {meetings.filter(m => new Date(m.startTime).getDate() !== now.getDate()).length > 0 && (
        <section className="pt-4 opacity-60">
           <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-1.5 h-6 bg-slate-300 rounded-full"></div>
            <h2 className="text-sm font-black text-slate-500 tracking-widest uppercase">Upcoming in the following days</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {meetings
              .filter(m => new Date(m.startTime).getDate() !== now.getDate())
              .slice(0, 3)
              .map(m => (
                <div key={m.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                  <div className="truncate">
                    <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">{new Date(m.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                    <p className="text-xs font-bold text-slate-800 truncate">{m.title}</p>
                  </div>
                  <i className={`${getPlatformIcon(m.platform)} opacity-40`}></i>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
