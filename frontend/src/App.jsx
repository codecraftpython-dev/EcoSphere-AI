import React, { useState } from 'react';
import ProblemInput from './components/ProblemInput';
import StatusTracker from './components/StatusTracker';
import ReportViewer from './components/ReportViewer';
import TimelineView from './components/TimelineView';
import ImpactSummary from './components/ImpactSummary';
import ErrorBoundary from './components/ErrorBoundary';

function validateResponseSchema(data) {
  if (!data) {
    throw new Error("No data received from the multi-agent system.");
  }
  if (data.success !== true) {
    throw new Error(data.error || "The analysis execution failed.");
  }
  
  if (!data.sector || typeof data.sector !== 'string') {
    throw new Error("Invalid schema: Missing environmental sector classification.");
  }
  if (!data.scale || typeof data.scale !== 'string') {
    throw new Error("Invalid schema: Missing estimated project scale.");
  }
  
  if (!data.timeline || typeof data.timeline !== 'object') {
    throw new Error("Invalid schema: Missing phased implementation timeline.");
  }
  const timeline = data.timeline;
  if (!Array.isArray(timeline.shortTerm) || !Array.isArray(timeline.mediumTerm) || !Array.isArray(timeline.longTerm)) {
    throw new Error("Invalid schema: Timeline must contain shortTerm, mediumTerm, and longTerm arrays.");
  }

  if (!data.metrics || typeof data.metrics !== 'object') {
    throw new Error("Invalid schema: Missing quantitative environmental metrics.");
  }
  const metrics = data.metrics;
  const requiredMetrics = [
    'carbon_savings_tco2e_per_year',
    'water_savings_liters_per_year',
    'waste_diverted_tons_per_year',
    'energy_saved_kwh_per_year',
    'cost_savings_usd_per_year',
    'payback_period_years'
  ];
  for (const metricName of requiredMetrics) {
    if (metrics[metricName] === undefined || metrics[metricName] === null) {
      throw new Error(`Invalid schema: Missing required metric value '${metricName}'.`);
    }
  }

  if (!Array.isArray(data.references)) {
    throw new Error("Invalid schema: Missing verified references list.");
  }

  if (!data.report || typeof data.report !== 'string') {
    throw new Error("Invalid schema: Missing synthesized markdown report text.");
  }
  if (!data.executiveSummary || typeof data.executiveSummary !== 'string') {
    throw new Error("Invalid schema: Missing executive summary text.");
  }

  if (!Array.isArray(data.steps) || data.steps.length === 0) {
    throw new Error("Invalid schema: Missing step-by-step agent execution logs.");
  }
}

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("report"); // report, timeline, metrics, sources

  const handleReset = () => {
    setResult(null);
    setError(null);
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsLoading(false);
  };

  const handleAnalyze = async (problemText) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    setSteps([]);
    setCurrentStepIndex(0);

    // Initial state: steps are pending
    const initialSteps = [
      { agentName: "Environmental Problem Analyzer Agent", status: "pending", logs: [] },
      { agentName: "Research Agent", status: "pending", logs: [] },
      { agentName: "Solution Planner Agent", status: "pending", logs: [] },
      { agentName: "Impact Assessment Agent", status: "pending", logs: [] },
      { agentName: "Final Advisor Agent", status: "pending", logs: [] }
    ];
    setSteps(initialSteps);

    try {
      // Call backend API
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: problemText })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "An error occurred during multi-agent analysis.");
      }

      // Verify the schema of response objects before starting the animation
      validateResponseSchema(data);

      // Animate the pipeline steps for premium user experience
      let stepIdx = 0;
      const interval = setInterval(() => {
        if (stepIdx < data.steps.length) {
          const currentIdx = stepIdx;
          setCurrentStepIndex(currentIdx);
          setSteps(prevSteps => {
            const nextSteps = [...prevSteps];
            nextSteps[currentIdx] = {
              agentName: data.steps[currentIdx].agentName,
              status: "completed",
              logs: data.steps[currentIdx].logs
            };
            return nextSteps;
          });
          stepIdx++;
        } else {
          clearInterval(interval);
          setResult(data);
          setIsLoading(false);
          setCurrentStepIndex(-1);
          setActiveTab("report");
        }
      }, 1200); // 1.2s delay per agent step simulation

    } catch (err) {
      console.error(err);
      setError(err.message);
      setIsLoading(false);
      setCurrentStepIndex(-1);
      
      // If there are logs returned from a partial fail, show them
      if (err.steps) {
        setSteps(err.steps);
      } else {
        setSteps(prev => prev.map((s, idx) => 
          idx === currentStepIndex || (idx === 0 && currentStepIndex === -1)
            ? { ...s, status: "failed", logs: ["Error: " + err.message] } 
            : s
        ));
      }
    }
  };

  return (
    <ErrorBoundary onReset={handleReset}>
      <div className="app-container">
      {/* Premium Eco Header */}
      <header>
        <div className="logo-container">
          <div className="logo-icon">E</div>
          <div>
            <h1 className="logo-title">EcoSphere AI</h1>
            <div className="logo-subtitle">Autonomous AI Sustainability Intelligence Platform</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--mint)', display: 'inline-block' }}></span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Local Simulation Active</span>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="dashboard-grid">
        {/* Left Hand: Input & Agent Workflow status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <ProblemInput onSubmit={handleAnalyze} isLoading={isLoading} />
          
          {(isLoading || steps.some(s => s.status !== "pending")) && (
            <StatusTracker
              steps={steps}
              currentStepIndex={currentStepIndex}
              isRunning={isLoading}
            />
          )}
        </div>

        {/* Right Hand: Final Advisory Report & Tabs */}
        <div>
          {error && (
            <div className="glass-card" style={{ borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#f87171', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ⚠️ Analysis Failed
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{error}</p>
            </div>
          )}

          {!result && !isLoading && !error && (
            <div className="glass-card welcome-box">
              <div className="welcome-icon">🌍</div>
              <h2>Ready for Sustainability Audit</h2>
              <p>
                An intelligent multi-agent platform that analyzes environmental challenges, retrieves sustainability knowledge, and generates actionable climate solutions.
              </p>
            </div>
          )}

          {isLoading && !result && (
            <div className="glass-card welcome-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <span className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></span>
              <h2>Agents Collaborating...</h2>
              <p>
                The Analyzer, Researcher, Planner, and Impact Assessment agents are running tools on the local MCP server. Please wait...
              </p>
            </div>
          )}

          {result && (
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Tab Navigation */}
              <div className="tab-nav">
                <button
                  className={`tab-btn ${activeTab === 'report' ? 'active' : ''}`}
                  onClick={() => setActiveTab('report')}
                >
                  📝 Advisory Report
                </button>
                <button
                  className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                  onClick={() => setActiveTab('timeline')}
                >
                  🗓️ Action Timeline
                </button>
                <button
                  className={`tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
                  onClick={() => setActiveTab('metrics')}
                >
                  📊 Impact Summary
                </button>
                <button
                  className={`tab-btn ${activeTab === 'sources' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sources')}
                >
                  📚 References
                </button>
              </div>

              {/* Tab Contents */}
              <div style={{ minHeight: '350px' }}>
                {activeTab === 'report' && (
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      📋 Executive Summary
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--mint)' }}>
                      {result.executiveSummary}
                    </p>
                    <ReportViewer report={result.report} />
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      ⏳ Implementation Milestones
                    </h3>
                    <TimelineView timeline={result.timeline} />
                  </div>
                )}

                {activeTab === 'metrics' && (
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      📈 Quantitative Projections
                    </h3>
                    <ImpactSummary metrics={result.metrics} sector={result.sector} scale={result.scale} />
                  </div>
                )}

                {activeTab === 'sources' && (
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      📖 Verified Documents & Sources
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      The Research Agent compiled findings using these standard source libraries and guidelines:
                    </p>
                    <div className="sources-list">
                      {Array.isArray(result.references) ? result.references.map((ref, idx) => (
                        <div key={idx} className="source-item">
                          <div className="source-bullet"></div>
                          <span>{ref}</span>
                        </div>
                      )) : (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No references available.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
