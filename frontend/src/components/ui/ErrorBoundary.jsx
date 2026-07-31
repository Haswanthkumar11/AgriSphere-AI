import { Component } from 'react';

/** Catches React render errors in child components gracefully. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[AgriSphere ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px', textAlign: 'center',
          background: '#FBEAE5', borderRadius: 16, margin: '16px 0',
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
          <p style={{ fontWeight: 700, color: 'var(--bad)', marginBottom: 6 }}>Something went wrong</p>
          <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 14 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            className="btn-secondary"
            style={{ width: 'auto', padding: '10px 20px' }}
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
