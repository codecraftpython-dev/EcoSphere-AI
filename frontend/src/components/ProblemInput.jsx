import React, { useState, useEffect } from 'react';

const PRESETS = [
  {
    label: "♻️ Municipal Waste Program",
    text: "Establish a city-wide organic food waste composting program to divert cafeteria waste from landfills and reduce municipal methane emissions."
  },
  {
    label: "☀️ Corporate Energy Retrofit",
    text: "Convert our corporate headquarter facility to use smart LED occupancy panels, upgrade natural gas boilers to electric heat pumps, and install rooftop solar PV panels."
  },
  {
    label: "💧 Factory Water Recovery",
    text: "Implement rainwater harvesting reservoirs on the manufacturing plant roofs and install greywater treatment systems to reuse water in our cooling towers."
  },
  {
    label: "🚗 EV Logistics Fleet",
    text: "Transition our distribution and sales sales fleets (15 delivery trucks) to battery-powered electric vehicles (EVs) and install renewable-powered charging stations."
  }
];

export default function ProblemInput({ onSubmit, isLoading }) {
  const [problem, setProblem] = useState("");
  const [mcpTools, setMcpTools] = useState([]);

  useEffect(() => {
    // Fetch registered MCP tools from backend to show architecture
    fetch("http://localhost:5000/api/tools")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMcpTools(data.tools);
        }
      })
      .catch(err => console.error("Error fetching MCP tools registry:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (problem.trim().length >= 10) {
      onSubmit(problem);
    }
  };

  const selectPreset = (presetText) => {
    setProblem(presetText);
  };

  return (
    <div className="glass-card">
      <h3 className="card-title">
        🌍 Sustainability Challenge
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="problem-desc">Describe your environmental challenge or sustainability objective</label>
          <textarea
            id="problem-desc"
            placeholder="Describe your environmental challenge, e.g., 'We want to reduce food waste in our university cafeteria by introducing composting...'"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Quick presets (Eco-Templates)</label>
          <div className="template-grid">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                className="template-btn"
                onClick={() => selectPreset(preset.text)}
                disabled={isLoading}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading || problem.trim().length < 10}
        >
          {isLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span className="spinner"></span> Analyzing Sustainability Data...
            </span>
          ) : (
            "Generate Eco Intelligence Report"
          )}
        </button>
      </form>

      {mcpTools.length > 0 && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            🔗 Active MCP Server Tools Registered:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
            {mcpTools.map((tool, idx) => (
              <span
                key={idx}
                className="tool-param-tag"
                title={tool.description}
                style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--mint)' }}
              >
                mcp:{tool.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
