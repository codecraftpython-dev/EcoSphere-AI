import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught rendering exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card" style={{ borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', padding: '2rem', textAlign: 'center', margin: '2rem auto', maxWidth: '600px' }}>
          <h3 style={{ color: '#f87171', fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            ⚠️ UI Rendering Error
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
            An unexpected error occurred while rendering the dashboard. This has been safely intercepted to prevent a blank screen.
          </p>
          <pre style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '1rem', borderRadius: '8px', color: '#fca5a5', fontSize: '0.8rem', textAlign: 'left', overflowX: 'auto', maxHeight: '180px', fontFamily: 'monospace', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <button 
            type="button"
            className="btn-primary" 
            style={{ width: 'auto', padding: '0.6rem 2rem' }}
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
          >
            Reset Dashboard View
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
