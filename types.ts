
export type Platform = 'Google Meet' | 'Zoom' | 'Microsoft Teams' | 'Discord' | 'Slack' | 'Webex' | 'Other';

export interface Meeting {
  id: string;
  title: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  platform: Platform;
  link: string;
  participants: string[];
  source: 'Gmail' | 'Calendar' | 'WhatsApp' | 'Discord';
  description?: string;
  isReminded: boolean;
}

export interface SyncSource {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  lastSynced: string | null;
}
