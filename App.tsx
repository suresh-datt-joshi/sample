
import React, { useState, useEffect } from 'react';
import { Meeting } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScheduleMeeting from './components/ScheduleMeeting';
import Platforms from './components/Platforms';
import NotificationCenter from './components/NotificationCenter';

const INITIAL_MEETINGS: Meeting[] = [
  {
    id: '1',
    title: 'Product Strategy Sync',
    startTime: new Date(new Date().setHours(new Date().getHours() + 1)).toISOString(),
    endTime: new Date(new Date().setHours(new Date().getHours() + 2)).toISOString(),
    platform: 'Google Meet',
    link: 'https://meet.google.com/abc-defg-hij',
    participants: ['Alice Smith', 'Bob Jones', 'You'],
    source: 'Gmail',
    isReminded: false
  },
  {
    id: '2',
    title: 'Design Review & Assets',
    startTime: new Date(new Date().setHours(new Date().getHours() + 4)).toISOString(),
    endTime: new Date(new Date().setHours(new Date().getHours() + 5)).toISOString(),
    platform: 'Zoom',
    link: 'https://zoom.us/j/123456789',
    participants: ['Charlie Davis', 'Dana White'],
    source: 'Discord',
    isReminded: false
  }
];

export type TabType = 'dashboard' | 'schedule' | 'platforms';

const App: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [notifications, setNotifications] = useState<{id: string, message: string}[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setMeetings(prev => {
        let changed = false;
        const next = prev.map(m => {
          const startTime = new Date(m.startTime);
          const diffMinutes = (startTime.getTime() - now.getTime()) / (1000 * 60);

          if (diffMinutes > 0 && diffMinutes <= 10 && !m.isReminded) {
            addNotification(`Meeting "${m.title}" starts in 10 minutes!`);
            changed = true;
            return { ...m, isReminded: true };
          }
          return m;
        });
        return changed ? next : prev;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const addNotification = (message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [{ id, message }, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 8000);
  };

  const handleAddMeeting = (meeting: Meeting) => {
    setMeetings(prev => [...prev, meeting].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    ));
    addNotification(`Meeting "${meeting.title}" scheduled.`);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard meetings={meetings} />;
      case 'schedule':
        return <ScheduleMeeting onAddMeeting={handleAddMeeting} existingMeetings={meetings} />;
      case 'platforms':
        return <Platforms />;
      default:
        return <Dashboard meetings={meetings} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-inter">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <NotificationCenter notifications={notifications} />
    </div>
  );
};

export default App;
