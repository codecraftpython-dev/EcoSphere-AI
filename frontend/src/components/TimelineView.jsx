import React from 'react';

export default function TimelineView({ timeline }) {
  if (!timeline) return null;

  const phases = [
    {
      key: "shortTerm",
      label: "Short-Term Milestones (0 - 6 Months)",
      tasks: timeline.shortTerm || []
    },
    {
      key: "mediumTerm",
      label: "Medium-Term Milestones (6 - 18 Months)",
      tasks: timeline.mediumTerm || []
    },
    {
      key: "longTerm",
      label: "Long-Term Milestones (18+ Months)",
      tasks: timeline.longTerm || []
    }
  ];

  return (
    <div className="timeline-flow">
      {phases.map((phase) => (
        <div key={phase.key} className="timeline-node">
          <div className="timeline-header">
            <span className="timeline-phase">{phase.label}</span>
            <span className="timeline-badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
              {phase.tasks.length} actions
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {phase.tasks.map((task, idx) => (
              <div key={idx} className="timeline-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4>{task.title}</h4>
                  <span className={`timeline-badge difficulty-${task.difficulty.toLowerCase()}`}>
                    {task.difficulty} Difficulty
                  </span>
                </div>
                <p>{task.description}</p>
                <div className="timeline-meta">
                  <span>⏱️ Target: {task.duration}</span>
                  <span>💰 Est. CapEx: {task.costEstimate}</span>
                </div>
              </div>
            ))}
            
            {phase.tasks.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem', fontStyle: 'italic' }}>
                No actions scheduled for this phase.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
