import React, { useState, useEffect } from 'react';

const AGENT_META = [
  {
    key: "Environmental Problem Analyzer Agent",
    label: "Environmental Problem Analyzer",
    icon: "🔍",
    desc: "Analyzes environmental challenges and identifies key sustainability areas."
  },
  {
    key: "Research Agent",
    label: "Research Agent",
    icon: "📚",
    desc: "Retrieves verified sustainability knowledge from the environmental knowledge base."
  },
  {
    key: "Solution Planner Agent",
    label: "Solution Planner Agent",
    icon: "🗓️",
    desc: "Creates practical implementation strategies and sustainability roadmaps."
  },
  {
    key: "Impact Assessment Agent",
    label: "Impact Assessment Agent",
    icon: "📊",
    desc: "Estimates environmental and operational impact."
  },
  {
    key: "Final Advisor Agent",
    label: "Final Advisor Agent",
    icon: "🎓",
    desc: "Generates the final sustainability intelligence report."
  }
];

export default function StatusTracker({ steps, currentStepIndex, isRunning }) {
  const [expandedAgent, setExpandedAgent] = useState(null);

  useEffect(() => {
    // Automatically expand the active agent log
    if (currentStepIndex >= 0 && currentStepIndex < AGENT_META.length) {
      setExpandedAgent(AGENT_META[currentStepIndex].key);
    }
  }, [currentStepIndex]);

  const toggleExpand = (key) => {
    setExpandedAgent(expandedAgent === key ? null : key);
  };

  return (
    <div className="glass-card" style={{ height: '100%' }}>
      <h3 className="card-title">
        <span>🤖</span> AI Sustainability Workflow
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
        Observe the sequential execution of collaborative ADK agents executing tools against the local MCP server:
      </p>

      <div className="status-tracker">
        {AGENT_META.map((meta, idx) => {
          // Find if this step is represented in backend steps
          const stepData = steps.find(s => s.agentName === meta.key);
          const hasData = !!stepData;
          
          let status = "pending";
          let logs = [];
          
          if (isRunning) {
            if (idx === currentStepIndex) {
              status = "active";
            } else if (idx < currentStepIndex) {
              status = "completed";
            }
          } else if (hasData) {
            status = stepData.status; // completed, failed
            logs = stepData.logs || [];
          }

          if (stepData && stepData.logs) {
            logs = stepData.logs;
          }

          const isExpanded = expandedAgent === meta.key;

          return (
            <div
              key={meta.key}
              className={`agent-step-card ${status}`}
              style={{ cursor: logs.length > 0 ? 'pointer' : 'default' }}
              onClick={() => logs.length > 0 && toggleExpand(meta.key)}
            >
              <div className="agent-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{meta.icon}</span>
                  <span style={{ color: status === 'active' ? 'var(--mint)' : '#ffffff' }}>
                    {meta.label}
                  </span>
                </span>
                <span className={`agent-badge badge-${status}`}>
                  {status}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', paddingLeft: '1.5rem' }}>
                {meta.desc}
              </p>

              {isExpanded && logs.length > 0 && (
                <div className="agent-logs" onClick={(e) => e.stopPropagation()}>
                  {logs.map((log, lIdx) => (
                    <div key={lIdx} style={{ marginBottom: '0.2rem' }}>
                      {log}
                    </div>
                  ))}
                </div>
              )}

              {logs.length > 0 && !isExpanded && (
                <div style={{ fontSize: '0.7rem', color: 'var(--mint)', marginTop: '0.3rem', paddingLeft: '1.5rem', textAlign: 'right' }}>
                  Click to inspect console logs ({logs.length}) ▼
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
