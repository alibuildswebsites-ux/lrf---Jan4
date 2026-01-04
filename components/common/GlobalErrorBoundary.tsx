import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  // Explicitly declare props to ensure TypeScript recognizes it on the class instance
  declare props: Readonly<Props>;

  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <h1 className="text-2xl font-extrabold text-charcoal mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {this.state.error && (
                <div className="bg-gray-50 p-4 rounded-xl mb-8 text-left overflow-hidden">
                <code className="text-xs text-red-500 font-mono break-all">
                    {this.state.error.message}
                </code>
                </div>
            )}
            <button
              onClick={this.handleReload}
              className="w-full bg-charcoal text-white py-3 rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}