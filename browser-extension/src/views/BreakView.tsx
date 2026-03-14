import type { SessionData } from '../types';

export default function BreakView({ data, onUpdate }: { data: SessionData, onUpdate: (newData: Partial<SessionData> | null) => void}) {
  return (
    <div className="view-container break-mode">
      <header><h3>Centr <span className="badge break">BREAK</span></h3></header>
      <main>
        <h1>Time to recharge.</h1>
        <p>You were working on: {data.task}</p>
        <button onClick={() => onUpdate({ status: 'session' })}>Back to Work</button>
      </main>
    </div>
  );
}