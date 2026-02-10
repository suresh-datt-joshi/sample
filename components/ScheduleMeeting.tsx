
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Meeting, Platform } from '../types';

interface ScheduleMeetingProps {
  onAddMeeting: (meeting: Meeting) => void;
  existingMeetings: Meeting[];
}

interface DraftMeeting {
  title: string;
  date: string;
  startTime: string;
  platform: string;
  link: string;
  description: string;
}

const ScheduleMeeting: React.FC<ScheduleMeetingProps> = ({ onAddMeeting, existingMeetings }) => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [conflict, setConflict] = useState<Meeting | null>(null);
  
  const [draft, setDraft] = useState<DraftMeeting>({
    title: '',
    date: '',
    startTime: '',
    platform: 'Google Meet',
    link: '',
    description: ''
  });

  // Conflict Detection Logic
  useEffect(() => {
    if (draft.date && draft.startTime) {
      const draftStart = new Date(`${draft.date}T${draft.startTime}`).getTime();
      const draftEnd = draftStart + 3600000; // Assume 1 hour

      const foundConflict = existingMeetings.find(m => {
        const mStart = new Date(m.startTime).getTime();
        const mEnd = new Date(m.endTime).getTime();
        return (draftStart < mEnd && draftEnd > mStart);
      });
      setConflict(foundConflict || null);
    }
  }, [draft.date, draft.startTime, existingMeetings]);

  const handleManualChange = (field: keyof DraftMeeting, value: string) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const speakConfirmation = async (text: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Friendly AI Assistant voice: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const arrayBuffer = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0)).buffer;
        
        // Manual PCM decoding based on Gemini SDK guidelines
        const dataInt16 = new Int16Array(arrayBuffer);
        const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
      }
    } catch (e) {
      console.error("TTS failed", e);
    }
  };

  const processNaturalLanguage = async (text: string) => {
    if (!text.trim() || isProcessing) return;
    setIsProcessing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are a high-speed scheduling engine. Extract meeting details from: "${text}"
        Current Year: ${new Date().getFullYear()}
        Current Date: ${new Date().toISOString().split('T')[0]}
        
        Return ONLY a JSON object with: title, date (YYYY-MM-DD), startTime (HH:mm), platform, link. 
        Example: {"title": "Team Sync", "date": "2024-03-25", "startTime": "14:00", "platform": "Zoom", "link": ""}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || '{}');
      
      setDraft(prev => ({
        ...prev,
        title: result.title || prev.title,
        date: result.date || prev.date,
        startTime: result.startTime || prev.startTime,
        platform: result.platform || prev.platform,
        link: result.link || prev.link,
      }));
      setInputValue('');
      
      if (result.title) {
        speakConfirmation(`I've drafted ${result.title} for you.`);
      }
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      processNaturalLanguage(transcript);
    };
    recognition.start();
  };

  const confirmAndSchedule = () => {
    if (!draft.title || !draft.date || !draft.startTime) return;
    
    const startDateTime = new Date(`${draft.date}T${draft.startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + 3600000);

    const newMeeting: Meeting = {
      id: Math.random().toString(36).substr(2, 9),
      title: draft.title,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      platform: (draft.platform as Platform),
      link: draft.link || 'https://meet.google.com/new',
      participants: ['You'],
      source: 'Calendar',
      isReminded: false,
    };

    onAddMeeting(newMeeting);
    setIsConfirmed(true);
  };

  if (isConfirmed) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <i className="fas fa-check text-4xl"></i>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Done! JumpIn.</h1>
        <p className="text-slate-500 text-lg mb-10 font-medium">Your meeting is secured and synced.</p>
        <button onClick={() => window.location.reload()} className="px-12 py-4 bg-slate-900 text-white font-black rounded-2xl hover:scale-105 transition-all uppercase tracking-widest text-xs">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-10">
        
        <div className="flex flex-col items-center text-center space-y-2">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">AI Scheduling</h1>
           <p className="text-slate-500 font-medium text-lg">Talk or type—I'll handle the rest.</p>
        </div>

        <div className="relative group max-w-2xl mx-auto w-full">
          <div className={`absolute -inset-1 bg-gradient-to-r ${conflict ? 'from-red-500 to-orange-500' : 'from-indigo-500 to-purple-600'} rounded-[42px] blur opacity-10 group-focus-within:opacity-30 transition duration-500`}></div>
          
          <div className="relative bg-white rounded-[40px] border border-slate-200 shadow-2xl p-10 md:p-12 overflow-hidden flex flex-col">
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3 text-indigo-600">
                <i className="fas fa-magic text-lg"></i>
                <span className="font-black text-[10px] uppercase tracking-[0.2em]">Smart Draft</span>
              </div>
              <div className="flex items-center gap-2">
                {conflict && (
                  <div className="flex items-center gap-1.5 text-red-500 font-black text-[10px] uppercase tracking-widest animate-pulse">
                    <i className="fas fa-exclamation-triangle"></i>
                    Schedule Conflict
                  </div>
                )}
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Live Sync</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Title</label>
                <input 
                  type="text"
                  placeholder="Waiting for input..."
                  className={`w-full p-5 rounded-2xl border-2 border-dashed transition-all duration-300 outline-none ${draft.title ? 'bg-indigo-50/40 border-indigo-200 text-slate-900 font-extrabold text-2xl' : 'bg-slate-50 border-slate-100 text-slate-300 text-2xl'}`}
                  value={draft.title}
                  onChange={(e) => handleManualChange('title', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Date</label>
                  <input 
                    type="date"
                    className={`w-full p-5 rounded-2xl border-2 border-dashed transition-all duration-300 outline-none ${draft.date ? 'bg-indigo-50/40 border-indigo-200 text-slate-900 font-bold' : 'bg-slate-50 border-slate-100 text-slate-300'}`}
                    value={draft.date}
                    onChange={(e) => handleManualChange('date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Time</label>
                  <input 
                    type="time"
                    className={`w-full p-5 rounded-2xl border-2 border-dashed transition-all duration-300 outline-none ${draft.startTime ? (conflict ? 'bg-red-50 border-red-200 text-red-600' : 'bg-indigo-50/40 border-indigo-200 text-slate-900') : 'bg-slate-50 border-slate-100 text-slate-300'} font-bold`}
                    value={draft.startTime}
                    onChange={(e) => handleManualChange('startTime', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Platform</label>
                  <select 
                    className={`w-full p-5 rounded-2xl border-2 border-dashed transition-all duration-300 outline-none appearance-none font-bold ${draft.platform ? 'bg-indigo-50/40 border-indigo-200 text-slate-900' : 'bg-slate-50 border-slate-100 text-slate-300'}`}
                    value={draft.platform}
                    onChange={(e) => handleManualChange('platform', e.target.value)}
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Microsoft Teams">Teams</option>
                    <option value="Discord">Discord</option>
                    <option value="Slack">Slack</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Link</label>
                  <input 
                    type="text"
                    placeholder="Auto-generated"
                    className={`w-full p-5 rounded-2xl border-2 border-dashed transition-all duration-300 outline-none font-bold truncate ${draft.link ? 'bg-indigo-50/40 border-indigo-200 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}
                    value={draft.link}
                    onChange={(e) => handleManualChange('link', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {conflict && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-in slide-in-from-top-2">
                <i className="fas fa-info-circle"></i>
                Conflict detected with: "{conflict.title}" at {new Date(conflict.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}

            <div className="pt-10 mt-6 border-t border-slate-50 space-y-4">
              <button 
                onClick={confirmAndSchedule}
                disabled={!draft.title || !draft.date || !draft.startTime}
                className="w-full py-6 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs"
              >
                Confirm & Sync Invite
              </button>
            </div>
          </div>
        </div>

        {/* Unified Command Bar */}
        <div className="max-w-3xl mx-auto w-full space-y-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-indigo-500 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-300"></div>
            <div className="relative flex items-center bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-1.5">
              <div className="pl-6 text-indigo-500">
                <i className={`fas ${isProcessing ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'} text-xl`}></i>
              </div>
              <input
                type="text"
                placeholder="Ex: 'Sync with HR tomorrow at 4pm on Zoom'"
                className="flex-1 px-4 py-5 bg-transparent outline-none text-slate-900 font-bold placeholder:text-slate-300 text-lg"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && processNaturalLanguage(inputValue)}
                disabled={isProcessing}
              />
              <div className="flex items-center gap-2 pr-2">
                <button 
                  onClick={startVoiceInput}
                  disabled={isProcessing}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'}`}
                >
                  <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
                </button>
                <button 
                  onClick={() => processNaturalLanguage(inputValue)}
                  className="w-14 h-14 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center"
                >
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScheduleMeeting;
