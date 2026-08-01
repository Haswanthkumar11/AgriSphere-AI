import { Component } from 'react';

/** Catches React render errors & chunk loading errors from new deployment releases. */
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

  handleRetry = () => {
    const msg = this.state.error?.message || '';
    if (msg.includes('dynamically imported module') || msg.includes('Loading chunk') || msg.includes('Failed to fetch')) {
      // Reload page to fetch updated Vercel deployment index.html & JS chunks
      window.location.reload();
    } else {
      this.setState({ hasError: false, error: null });
    }
  };

  render() {
    if (this.state.hasError) {
      const isChunkError = (this.state.error?.message || '').includes('dynamically imported module');

      return (
        <div style={{
          padding: '24px 20px', textAlign: 'center',
          background: '#FBEAE5', border: '1.5px solid #F0BCA9', borderRadius: 20, margin: '20px auto',
          maxWidth: 480, boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔄</div>
          <p style={{ fontWeight: 800, fontSize: 16, color: '#991B1B', marginBottom: 6 }}>
            {isChunkError ? 'New App Version Available' : 'Something went wrong'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 18, lineHeight: 1.5 }}>
            {isChunkError
              ? 'A new production update was deployed. Please tap below to load the latest version.'
              : (this.state.error?.message || 'An unexpected error occurred')}
          </p>
          <button
            className="btn-primary"
            style={{ width: 'auto', padding: '12px 28px', margin: '0 auto' }}
            onClick={this.handleRetry}
          >
            {isChunkError ? '🚀 Reload to Update App' : 'Try again'}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
