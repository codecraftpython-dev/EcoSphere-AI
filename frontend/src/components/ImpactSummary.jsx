import React from 'react';

export default function ImpactSummary({ metrics, sector, scale }) {
  if (!metrics) return null;

  // Safe extraction with default fallbacks
  const carbonSavings = Number(metrics.carbon_savings_tco2e_per_year ?? 0);
  const costSavings = Number(metrics.cost_savings_usd_per_year ?? 0);
  const waterSavings = Number(metrics.water_savings_liters_per_year ?? 0);
  const wasteDiverted = Number(metrics.waste_diverted_tons_per_year ?? 0);
  const energySaved = Number(metrics.energy_saved_kwh_per_year ?? 0);
  const paybackPeriod = Number(metrics.payback_period_years ?? 0);

  // Derive simple progress indicators for display
  const maxCarbon = scale === 'large' ? 1000 : scale === 'medium' ? 150 : 25;
  const carbonPct = maxCarbon > 0 ? Math.min((carbonSavings / maxCarbon) * 100, 100) : 0;

  const maxSavings = scale === 'large' ? 500000 : scale === 'medium' ? 50000 : 8000;
  const savingsPct = maxSavings > 0 ? Math.min((costSavings / maxSavings) * 100, 100) : 0;

  return (
    <div>
      <div className="metrics-grid">
        {/* Carbon Card */}
        <div className="metric-box pulse-glow">
          <div className="metric-label">♻️ Carbon Abatement</div>
          <div className="metric-value">{carbonSavings}</div>
          <div className="metric-unit">tCO2e / year</div>
          <div style={{ background: 'rgba(255,255,255,0.05)', height: '4px', borderRadius: '2px', marginTop: '0.75rem', overflow: 'hidden' }}>
            <div style={{ background: 'var(--mint)', height: '100%', width: `${carbonPct}%`, borderRadius: '2px' }}></div>
          </div>
        </div>

        {/* Financial Savings Card */}
        <div className="metric-box">
          <div className="metric-label">💰 Utility Cost Abatement</div>
          <div className="metric-value">${costSavings.toLocaleString()}</div>
          <div className="metric-unit">USD / year</div>
          <div style={{ background: 'rgba(255,255,255,0.05)', height: '4px', borderRadius: '2px', marginTop: '0.75rem', overflow: 'hidden' }}>
            <div style={{ background: 'var(--emerald)', height: '100%', width: `${savingsPct}%`, borderRadius: '2px' }}></div>
          </div>
        </div>

        {/* ROI Payback Card */}
        <div className="metric-box">
          <div className="metric-label">⏱️ Payback Period</div>
          <div className="metric-value">{paybackPeriod}</div>
          <div className="metric-unit">years ROI</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Estimated Break-even point
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {waterSavings > 0 && (
          <div className="glass-card" style={{ padding: '1rem', background: 'rgba(52, 211, 153, 0.02)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>💦 WATER SAVED</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#60a5fa', marginTop: '0.25rem' }}>
              {waterSavings.toLocaleString()} L/yr
            </div>
          </div>
        )}
        {wasteDiverted > 0 && (
          <div className="glass-card" style={{ padding: '1rem', background: 'rgba(52, 211, 153, 0.02)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📦 WASTE DIVERTED</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--mint)', marginTop: '0.25rem' }}>
              {wasteDiverted} Tons/yr
            </div>
          </div>
        )}
        {energySaved > 0 && (
          <div className="glass-card" style={{ padding: '1rem', background: 'rgba(52, 211, 153, 0.02)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⚡ ENERGY SAVED</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f59e0b', marginTop: '0.25rem' }}>
              {energySaved.toLocaleString()} kWh/yr
            </div>
          </div>
        )}
      </div>

      <div className="glass-card" style={{ background: 'rgba(0,0,0,0.2)', border: '1px dashed rgba(255,255,255,0.05)' }}>
        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          📐 Methodology Assumptions:
        </h4>
        <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          <li>Calculated using localized parameters in simulated MCP Calculator Tool.</li>
          <li>CO2 reduction factors mapped from EPA Emission Factors for Greenhouse Gas Inventories.</li>
          <li>Financial savings derived from average national commercial electricity ($0.15/kWh) and waste landfill tipping averages.</li>
        </ul>
      </div>
    </div>
  );
}
