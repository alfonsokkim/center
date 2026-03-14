export type SessionStatus = 'idle' | 'session' | 'break';

export interface SessionData {
  status: SessionStatus;
  task: string;
  sessionType: 'timed' | 'unlimited';
  hours: number;
  minutes: number;
  startTime?: string;
}