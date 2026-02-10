
import React, { useState } from 'react';
import { Meeting, Platform } from '../types';

interface MeetingCardProps {
  meeting: Meeting;
}

const getPlatformColor = (platform: Platform) => {
  switch (platform) {
    case 'Google Meet': return 'text-green-600 bg-green-50 border-green-100';
    case 'Zoom': return 'text-blue-600 bg-blue-50 border-blue-100';
    case 'Microsoft Teams': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    case 'Discord': return 'text-violet-600 bg-violet-50 border-violet-100';
    case 'Slack': return 'text-orange-600 bg-orange-50 border-orange-100';
    default: return 'text-slate-600 bg-slate-50 border-slate-100';
  }
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'Gmail': return 'fab fa-google text-red-500';
    case 'Calendar': return 'far fa-calendar-check text-indigo-500';
    case 'WhatsApp': return 'fab fa-whatsapp text-green-500';
    case 'Discord': return 'fab fa-discord text-violet-500';
    default: return 'fas fa-link';
  }
};

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  const [showShare, setShowShare] = useState(false);
  const startTime = new Date(meeting.startTime);
  const isSoon = (startTime.getTime() - Date.now()) < (1000 * 60 * 15) && (startTime.getTime() - Date.now()) > 0;

  const handleShare = (method: string) => {
    const text = `Join my meeting "${meeting.title}"\nWhen: ${startTime.toLocaleString()}\nLink: ${meeting.link}`;
    if (method === 'copy') {
      navigator.clipboard.writeText(text);
      alert('Invite copied!');
    } else if (method === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
    setShowShare(false);
  };

  return (
    <div className={`group relative bg-white rounded-[32px] border transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden ${isSoon ? 'border-indigo-500 ring-4 ring-indigo-50 shadow-2xl' : 'border-slate-100 shadow-sm'}`}>
      
      <div className="p-8 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${getPlatformColor(meeting.platform)}`}>
            {meeting.platform}
          </div>
          <div className="flex -space-x-3">
            {['Me', 'JD', 'AK'].map((p, i) => (
              <div 
                key={i} 
                className="w-9 h-9 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm"
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-tight tracking-tight">
          {meeting.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-400 font-bold mb-8 mt-2 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <i className="far fa-calendar-alt text-indigo-400"></i>
            {startTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-2">
            <i className="far fa-clock text-indigo-400"></i>
            {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex items-center gap-2">
            <i className={getSourceIcon(meeting.source)}></i>
            {meeting.source}
          </div>
        </div>

        <div className="mt-auto flex gap-3 relative">
          <a
            href={meeting.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-[10px] ${
              isSoon 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100' 
              : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-play text-[10px]"></i>
            Jump In
          </a>
          
          <div className="relative">
            <button 
              onClick={() => setShowShare(!showShare)}
              className="w-14 h-14 flex items-center justify-center rounded-2xl border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-slate-400 hover:text-indigo-600"
            >
              <i className="fas fa-share-nodes"></i>
            </button>
            
            {showShare && (
              <div className="absolute bottom-full right-0 mb-3 w-48 bg-slate-900 rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 z-20">
                <button onClick={() => handleShare('copy')} className="w-full text-left px-4 py-3 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-3 transition-colors">
                  <i className="fas fa-copy text-slate-400"></i> Copy Invite
                </button>
                <button onClick={() => handleShare('whatsapp')} className="w-full text-left px-4 py-3 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-3 transition-colors">
                  <i className="fab fa-whatsapp text-green-500"></i> WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingCard;
