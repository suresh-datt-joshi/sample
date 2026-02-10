
import React from 'react';

interface NotificationCenterProps {
  notifications: { id: string; message: string }[];
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications }) => {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {notifications.map(n => (
        <div 
          key={n.id} 
          className="pointer-events-auto bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right fade-in min-w-[320px] max-w-md border border-slate-700"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0">
            <i className="fas fa-bell"></i>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium leading-snug">{n.message}</p>
          </div>
          <button className="text-slate-500 hover:text-white transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;
