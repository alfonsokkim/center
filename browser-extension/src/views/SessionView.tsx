import type { SessionData } from '../types';

export default function SessionView({ data, onUpdate }: { data: SessionData, onUpdate: (newData: Partial<SessionData> | null) => void}) {
  return (
    <div className="view-container session-mode">
      <header>
        <h3>Centr <span className="badge">FOCUS</span></h3>
      </header>
      <main>
        <h4>Currently Working On</h4>
        <h1>{data.task}</h1>
        <div className="actions">
          <button onClick={() => onUpdate({ status: 'break' })}>Take Break</button>
          <button className="secondary" onClick={() => onUpdate(null)}>End Session</button>
        </div>
      </main>
    </div>
  );
}