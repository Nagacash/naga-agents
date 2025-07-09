export enum AgentStatus {
  IDLE = 'Idle',
  RUNNING = 'Running',
  PAUSED = 'Paused',
  ERROR = 'Error',
}

export enum AgentType {
  TEXT = 'Text',
  IMAGE = 'Image',
  VIDEO = 'Video',
}

export enum OutputQuality {
  STANDARD = 'Standard',
  FULL = 'Full',
}

export enum Schedule {
  MANUAL = 'Manual',
  ONCE = 'Once',
  HOURLY = 'Hourly',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
}

export type AIProvider = 'google' | 'openai' | 'anthropic' | 'grok' | 'kling';

export interface Source {
  uri: string;
  title: string;
}

export interface Agent {
  id: string;
  name:string;
  goal: string;
  provider: AIProvider;
  model: string;
  type: AgentType;
  prompt: string;
  status: AgentStatus;
  output?: string;
  error?: string;
  outputQuality?: OutputQuality;
  webSearch?: boolean;
  sources?: Source[];
  schedule?: Schedule;
  scheduleValue?: string; // For time (HH:MM) or date-time
  scheduleDay?: number; // For day of week/month
  nextRunTime?: number; // timestamp
  lastRunTime?: number; // timestamp
}