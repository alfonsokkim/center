export type SessionStatus = 'idle' | 'session' | 'break';

export interface SessionData {
  status: SessionStatus;
  task: string;
  sessionType: 'timed' | 'unlimited';
  hours: number;
  minutes: number;
  startTime?: string;
  url?: string;
  workedSeconds?: number;
}

export interface SessionHistory {
  id: string;
  task: string;
  relevanceScore: number;
  durationSeconds: number;
}
