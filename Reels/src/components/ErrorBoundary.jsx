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
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d1117',
          color: '#f0f6fc',
          fontFamily: 'system-ui, sans-serif',
          padding: 24,
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: 24, marginBottom: 12, color: '#f85149' }}>Something went wrong</h2>
          <p style={{ color: '#8b949e', maxWidth: 480, marginBottom: 20 }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              background: '#238636',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 6,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            Reset Studio & Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
